import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const NHTSA_TIMEOUT_MS = 8000

interface NhtsaResult {
  Variable: string
  Value: string | null
}

function fieldMap(results: NhtsaResult[]): Map<string, string> {
  const map = new Map<string, string>()
  for (const r of results) {
    if (r.Value) map.set(r.Variable, r.Value)
  }
  return map
}

function mapFuelType(raw: string): string | null {
  const s = raw.toLowerCase()
  if (!s) return null
  if (s.includes('hybrid') && s.includes('plug')) return s.includes('diesel') ? 'phev_diesel' : 'phev_petrol'
  if (s.includes('mild hybrid')) return s.includes('diesel') ? 'mild_hybrid_diesel' : 'mild_hybrid_petrol'
  if (s.includes('hybrid')) return s.includes('diesel') ? 'hybrid_diesel' : 'hybrid_petrol'
  if (s.includes('electric')) return 'electric'
  if (s.includes('diesel')) return 'diesel'
  if (s.includes('hydrogen')) return 'hydrogen'
  if (s.includes('compressed natural gas') || s.includes('cng')) return 'cng'
  if (s.includes('propane') || s.includes('lpg') || s.includes('liquefied petroleum')) return 'lpg'
  if (s.includes('ethanol') || s.includes('flexible fuel') || s.includes('e85')) return 'ethanol'
  if (s.includes('gasoline') || s.includes('petrol')) return 'petrol'
  return 'other'
}

function mapTransmission(raw: string): string | null {
  const s = raw.toLowerCase()
  if (!s) return null
  if (s.includes('manual')) return 'manual'
  if (s.includes('dual-clutch') || s.includes('dct') || s.includes('automated manual')) return 'semi_automatic'
  if (s.includes('cvt') || s.includes('continuously variable') || s.includes('automatic')) return 'automatic'
  return null
}

function mapDriveType(raw: string): string | null {
  const s = raw.toLowerCase()
  if (!s) return null
  if (s.includes('awd') || s.includes('all wheel') || s.includes('all-wheel') || s.includes('4wd') || s.includes('4x4') || s.includes('four-wheel')) return 'awd'
  if (s.includes('rwd') || s.includes('rear wheel') || s.includes('rear-wheel')) return 'rwd'
  if (s.includes('fwd') || s.includes('front wheel') || s.includes('front-wheel')) return 'fwd'
  return null
}

export async function GET(request: NextRequest) {
  const vin = (request.nextUrl.searchParams.get('vin') || '').trim().toUpperCase()
  if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) {
    return NextResponse.json({ success: false, message: 'Invalid VIN format' }, { status: 400 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), NHTSA_TIMEOUT_MS)

  try {
    const res = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vin)}?format=json`,
      { signal: controller.signal }
    )
    if (!res.ok) {
      return NextResponse.json({ success: false, message: 'NHTSA lookup failed' }, { status: 502 })
    }

    const body = (await res.json()) as { Results?: NhtsaResult[] }
    const fields = fieldMap(body.Results ?? [])

    const make = fields.get('Make') ?? null
    if (!make) {
      const errorText = fields.get('Error Text')
      return NextResponse.json(
        { success: false, message: errorText ? `NHTSA: ${errorText}` : 'VIN could not be decoded by NHTSA' },
        { status: 200 }
      )
    }

    // NHTSA's own "Error Code" flags how much to trust this decode. Code 1 (check-digit
    // mismatch) is common and harmless — plenty of real/demo VINs fail that formula while
    // still decoding correctly from WMI+VDS. Any other code (5, 6, 8, 14, 400, ...) means
    // NHTSA itself is saying the VIN has bad/unrecognized positions and it had to guess —
    // e.g. VIN "YV1FS5250B2024312" (a real Volvo S60) comes back as a 1981 Volvo "740
    // Series" under codes "5,14". Make (from the WMI alone, positions 1-3) is still safe to
    // use in that case, but model/year/trim/specs (from the VDS pattern, which is what the
    // error refers to) are not.
    const errorCodes = (fields.get('Error Code') ?? '').split(',').map(c => c.trim()).filter(Boolean)
    const reliable = errorCodes.length === 0 || errorCodes.every(c => c === '0' || c === '1')

    const model = reliable ? fields.get('Model') ?? null : null
    const modelYearRaw = reliable ? fields.get('Model Year') : null
    const modelYear = modelYearRaw ? parseInt(modelYearRaw, 10) : null
    const trim = reliable ? [fields.get('Trim'), fields.get('Trim2')].filter(Boolean).join(' ') || null : null
    const bodyClass = reliable ? fields.get('Body Class') ?? null : null
    const doorsRaw = reliable ? fields.get('Doors') : undefined
    const doors = doorsRaw ? parseInt(doorsRaw, 10) : null

    const engineKwRaw = reliable ? fields.get('Engine Power (kW)') : undefined
    const engineHpRaw = reliable ? fields.get('Engine Brake (hp) From') : undefined
    let engineKw = engineKwRaw ? Math.round(parseFloat(engineKwRaw)) : null
    let engineHp = engineHpRaw ? Math.round(parseFloat(engineHpRaw)) : null
    if (engineKw && !engineHp) engineHp = Math.round(engineKw / 0.7457)
    if (engineHp && !engineKw) engineKw = Math.round(engineHp * 0.7457)

    const fuelTypeName = reliable ? mapFuelType(fields.get('Fuel Type - Primary') ?? '') : null
    const transmissionName = reliable ? mapTransmission(fields.get('Transmission Style') ?? '') : null
    const driveTypeName = reliable ? mapDriveType(fields.get('Drive Type') ?? '') : null

    const [fuelType, transmission, driveType] = await Promise.all([
      fuelTypeName ? prisma.fuelType.findFirst({ where: { technicalName: fuelTypeName }, select: { id: true } }) : null,
      transmissionName ? prisma.transmission.findFirst({ where: { technicalName: transmissionName }, select: { id: true } }) : null,
      driveTypeName ? prisma.driveType.findFirst({ where: { technicalName: driveTypeName }, select: { id: true } }) : null,
    ])

    return NextResponse.json({
      success: true,
      reliable,
      make,
      model,
      modelYear,
      trim,
      bodyClass,
      doors,
      engineKw,
      engineHp,
      fuelTypeId: fuelType?.id ?? null,
      transmissionId: transmission?.id ?? null,
      driveTypeId: driveType?.id ?? null,
    })
  } catch (error) {
    const message = error instanceof Error && error.name === 'AbortError' ? 'NHTSA lookup timed out' : 'NHTSA lookup failed'
    return NextResponse.json({ success: false, message }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
