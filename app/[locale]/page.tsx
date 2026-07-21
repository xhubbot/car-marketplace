import prisma from '@/lib/prisma';
import { getMonthlyCostsForListings } from '@/lib/listingCost';
import { listingSelect, toRealListing } from '@/lib/listing';
import HomeListingGrid from './_components/HomeListingGrid';

interface HomeProps {
  params: Promise<{ locale: string }>;
}

export default async function Home({ params }: HomeProps) {
  const { locale } = await params;

  const rows = await prisma.carListing.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    take: 12,
    select: listingSelect,
  });

  const monthlyCosts = await getMonthlyCostsForListings(
    rows.map((row) => ({
      id: row.id,
      price: Number(row.price),
      fuelTypeId: row.fuelTypeId,
      fuelTypeTechnicalName: row.fuelType.technicalName,
      fuelConsumptionMixed: row.fuelConsumptionMixed ? Number(row.fuelConsumptionMixed) : null,
      makeId: row.makeId,
      modelId: row.modelId,
    }))
  );

  const listings = rows
    .map((row) => {
      const monthlyCost = monthlyCosts.get(row.id.toString());
      return monthlyCost ? toRealListing(row, monthlyCost) : null;
    })
    .filter((listing) => listing !== null);

  return <HomeListingGrid locale={locale} listings={listings} />;
}
