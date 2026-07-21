import { redirect } from 'next/navigation'

interface SellPageProps {
  params: Promise<{ locale: string }>
}

// The old /sell form posted to a since-removed /api/cars endpoint built around
// a `Car` model that no longer exists in the schema. /create is the real,
// complete listing flow (make/model lookups, images, features, etc.) — redirect
// here instead of duplicating it with a form that can't satisfy the real schema.
export default async function SellPage({ params }: SellPageProps) {
  const { locale } = await params
  redirect(`/${locale}/create`)
}
