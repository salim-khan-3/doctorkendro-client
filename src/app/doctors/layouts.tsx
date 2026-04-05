import Navbar from '@/components/common/Navbar'
import Footer from '@/components/common/Footer'

export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {children}
      <Footer />
    </div>
  )
}