import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

export class ImageValidationError extends Error {}

interface ProcessImageOptions {
  maxDimension?: number
  quality?: number
}

/**
 * Validates, re-encodes (auto-rotate, resize, compress to JPEG) and writes an
 * uploaded image. Always outputs `${filename}.jpg` regardless of input format.
 */
export async function processAndSaveImage(
  file: File,
  dir: string,
  filename: string,
  options: ProcessImageOptions = {}
): Promise<string> {
  const { maxDimension = 1200, quality = 85 } = options

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new ImageValidationError(`Unsupported image type: ${file.type || 'unknown'}`)
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new ImageValidationError('Image exceeds the maximum size of 10MB')
  }

  await mkdir(dir, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  const finalFilename = `${filename}.jpg`

  await sharp(buffer)
    .rotate()
    .resize(maxDimension, maxDimension, { fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality, progressive: true })
    .toFile(path.join(dir, finalFilename))

  return finalFilename
}

/**
 * Per-user upload root: uploads/users/{userId}/
 * Holds a `classifieds/{listingId}/` folder per listing and one `dealer/`
 * folder (a user has at most one dealer profile), so deleting a listing or
 * a whole account only ever requires removing one directory tree.
 */
export function userUploadDir(userId: number): string {
  return path.join(process.cwd(), 'public', 'uploads', 'users', userId.toString())
}

export function classifiedUploadDir(userId: number, listingId: number | bigint | string): string {
  return path.join(userUploadDir(userId), 'classifieds', listingId.toString())
}

export function dealerUploadDir(userId: number): string {
  return path.join(userUploadDir(userId), 'dealer')
}
