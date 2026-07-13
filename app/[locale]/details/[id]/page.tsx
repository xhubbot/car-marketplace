import { CAR_LISTINGS } from '@/lib/data';
import { notFound } from 'next/navigation';
import CarDetailsView from './_components/CarDetailsView';

interface PageProps {
  params: Promise<{ locale: string; id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const car = CAR_LISTINGS.find((c) => c.id === id);
  if (!car) notFound();
  return <CarDetailsView car={car} />;
}
