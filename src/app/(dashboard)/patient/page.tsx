'use client'

import { useAuth } from '@/hooks/useAuth'
import { useQuery } from '@tanstack/react-query'
import { appointmentService } from '@/services/appointment.service'
import { patientService } from '@/services/patient.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Spinner from '@/components/ui/Spinner'
import Avatar from '@/components/ui/Avatar'
import { formatDate, formatDateTime, getStatusColor, getAppointmentTypeLabel } from '@/utils'
import { Calendar, User, Users, FileText } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config'

export default function PatientDashboard() {
  const { user } = useAuth()

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: () => patientService.getProfile(),
  })

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['my-appointments'],
    queryFn: () => appointmentService.getMyAppointments({ limit: 5 }),
  })

  const profile = profileData?.data
  const appointments = appointmentsData?.data || []

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            {profile && (
              <Avatar
                src={profile.avatarUrl}
                firstName={profile.firstName}
                lastName={profile.lastName}
                size="lg"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {profile?.firstName}! 👋
              </h1>
              <p className="text-gray-500">
                {formatDate(new Date().toISOString())}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {appointmentsData?.meta?.total || 0}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <User className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Profile</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.firstName} {profile?.lastName}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Family Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.familyMembers?.length || 0}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-xl">
                <FileText className="text-orange-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Blood Group</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.bloodGroup || 'N/A'}
                </p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Recent Appointments */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Appointments
              </h2>
              <Link
                href={ROUTES.PATIENT_APPOINTMENTS}
                className="text-sm text-blue-600 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            {appointmentsLoading ? (
              <div className="flex justify-center py-8">
                <Spinner />
              </div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No appointments yet</p>
                <Link
                  href="/doctors"
                  className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                >
                  Find a doctor
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={(apt.doctor as any)?.avatarUrl}
                        firstName={(apt.doctor as any)?.firstName || 'D'}
                        lastName={(apt.doctor as any)?.lastName || 'R'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          Dr. {(apt.doctor as any)?.firstName}{' '}
                          {(apt.doctor as any)?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(apt.scheduledAt)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {getAppointmentTypeLabel(apt.type)}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        apt.status === 'COMPLETED'
                          ? 'success'
                          : apt.status === 'CONFIRMED'
                          ? 'info'
                          : apt.status === 'CANCELLED'
                          ? 'danger'
                          : 'warning'
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
