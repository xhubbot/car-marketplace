import Navbar from '@/components/Navbar'
import { DealerRegisterForm } from '@/components/DealerRegister/DealerRegisterForm'

export const metadata = {
  title: 'Register Your Dealership',
  description: 'Add your company to the autod.pro dealer directory',
}

export default function DealerRegisterPage() {
  return (
    <>
      <Navbar />
      <DealerRegisterForm />
    </>
  )
}
