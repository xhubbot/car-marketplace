import Navbar from '@/components/Navbar'
import { DealersDirectory } from '@/components/Dealers/DealersDirectory'

export const metadata = {
  title: 'Dealers',
  description: 'Search and filter registered dealerships on autod.pro',
}

export default function DealersPage() {
  return (
    <>
      <Navbar />
      <DealersDirectory />
    </>
  )
}
