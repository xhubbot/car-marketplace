import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getMonthlyCostsForListings } from '@/lib/listingCost';
import { listingSelect, toRealListing } from '@/lib/listing';
import CarDetailsView from './_components/CarDetailsView';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const listingId = Number.parseInt(id, 10);
  if (!Number.isInteger(listingId) || listingId <= 0) notFound();

  const row = await prisma.carListing.findFirst({
    where: { id: listingId, status: 'active' },
    select: listingSelect,
  });
  if (!row) notFound();

  const monthlyCosts = await getMonthlyCostsForListings([
    {
      id: row.id,
      price: Number(row.price),
      fuelTypeId: row.fuelTypeId,
      fuelTypeTechnicalName: row.fuelType.technicalName,
      fuelConsumptionMixed: row.fuelConsumptionMixed ? Number(row.fuelConsumptionMixed) : null,
      makeId: row.makeId,
      modelId: row.modelId,
    },
  ]);
  const monthlyCost = monthlyCosts.get(row.id.toString());
  if (!monthlyCost) notFound();

  const car = toRealListing(row, monthlyCost);
  return <CarDetailsView car={car} />;
}
