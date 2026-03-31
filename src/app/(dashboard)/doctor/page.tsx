'use client'

import { useQuery } from '@tanstack/react-query'
import { doctorService } from '@/services/doctor.service'
import { appointmentService } from '@/services/appointment.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { formatDateTime, getAppointmentTypeLabel } from '@/utils'
import { Calendar, Users, Star, Clock } from 'lucide-react'
import Link from 'next/link'
import { ROUTES } from '@/config'

export default function DoctorDashboard() {
  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => doctorService.getMyProfile(),
  })

  const { data: appointmentsData, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['doctor-appointments'],
    queryFn: () =>
      appointmentService.getDoctorAppointments({ limit: 5 } as any),
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
                Welcome, Dr. {profile?.firstName}! 👋
              </h1>
              <div className="flex items-center gap-2 mt-1">
                {profile?.verificationStatus === 'VERIFIED' ? (
                  <Badge variant="success">Verified</Badge>
                ) : (
                  <Badge variant="warning">Pending Verification</Badge>
                )}
                {profile?.isAvailableOnline && (
                  <Badge variant="info">Online Available</Badge>
                )}
              </div>
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
                <Users className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.totalPatients || 0}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Star className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.avgRating?.toFixed(1) || '0.0'}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Clock className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Experience</p>
                <p className="text-2xl font-bold text-gray-900">
                  {profile?.experience || 0} yrs
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
              <Link href={ROUTES.DOCTOR_APPOINTMENTS}>
                <Button variant="outline" size="sm">
                  View All
                </Button>
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
                        src={(apt.patient as any)?.avatarUrl}
                        firstName={(apt.patient as any)?.firstName || 'P'}
                        lastName={(apt.patient as any)?.lastName || 'A'}
                        size="md"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {(apt.patient as any)?.firstName}{' '}
                          {(apt.patient as any)?.lastName}
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

