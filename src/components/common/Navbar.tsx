'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LogOut, Menu, X, User, Calendar, Home } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { APP_NAME, ROUTES } from '@/config'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'

export default function Navbar() {
  const { user, isAuthenticated, logout, isLoggingOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const getNavLinks = () => {
    if (!isAuthenticated || !user) return []

    if (user.role === 'PATIENT') {
      return [
        { href: ROUTES.PATIENT_DASHBOARD, label: 'Dashboard', icon: Home },
        { href: ROUTES.PATIENT_APPOINTMENTS, label: 'Appointments', icon: Calendar },
        { href: ROUTES.PATIENT_PROFILE, label: 'Profile', icon: User },
      ]
    }

    if (user.role === 'DOCTOR') {
      return [
        { href: ROUTES.DOCTOR_DASHBOARD, label: 'Dashboard', icon: Home },
        { href: ROUTES.DOCTOR_APPOINTMENTS, label: 'Appointments', icon: Calendar },
        { href: ROUTES.DOCTOR_PROFILE, label: 'Profile', icon: User },
      ]
    }

    if (user.role === 'SUPER_ADMIN') {
      return [
        { href: ROUTES.ADMIN_DASHBOARD, label: 'Dashboard', icon: Home },
        { href: ROUTES.ADMIN_USERS, label: 'Users', icon: User },
        { href: ROUTES.ADMIN_DOCTORS, label: 'Doctors', icon: User },
      ]
    }

    return []
  }

  const navLinks = getNavLinks()
  const profile = user?.patient || user?.doctor

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-blue-600"
          >
            🏥 {APP_NAME}
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user && profile ? (
              <div className="flex items-center gap-3">
                <Avatar
                  src={(profile as any).avatarUrl}
                  firstName={(profile as any).firstName}
                  lastName={(profile as any).lastName}
                  size="sm"
                />
                <span className="text-sm font-medium text-gray-700">
                  {(profile as any).firstName} {(profile as any).lastName}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  isLoading={isLoggingOut}
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(ROUTES.LOGIN)}
                >
                  Login
                </Button>
                <Button
                  size="sm"
                  onClick={() => router.push(ROUTES.REGISTER)}
                >
                  Register
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <link.icon size={16} />
                  {link.label}
                </Link>
              ))}
              {isAuthenticated ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => logout()}
                  isLoading={isLoggingOut}
                  className="mt-2"
                >
                  Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      router.push(ROUTES.LOGIN)
                      setIsMenuOpen(false)
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      router.push(ROUTES.REGISTER)
                      setIsMenuOpen(false)
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

