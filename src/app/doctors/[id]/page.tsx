'use client'

import { useQuery } from '@tanstack/react-query'
import { doctorService } from '@/services/doctor.service'
import { reviewService } from '@/services/review.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { Star, MapPin, Video, Phone, Award, GraduationCap, Clock } from 'lucide-react'
import { formatCurrency } from '@/utils'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/config'

interface Props {
  params: { id: string }
}

export default function DoctorProfilePage({ params }: Props) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const { data: doctorData, isLoading } = useQuery({
    queryKey: ['doctor', params.id],
    queryFn: () => doctorService.getDoctorProfile(params.id),
  })

  const { data: reviewsData } = useQuery({
    queryKey: ['doctor-reviews', params.id],
    queryFn: () => reviewService.getDoctorReviews(params.id),
  })

  const doctor = doctorData?.data
  const reviews = reviewsData?.data || []

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Doctor not found</p>
      </div>
    )
  }

  const handleBookAppointment = () => {
    if (!isAuthenticated) {
      router.push(ROUTES.LOGIN)
      return
    }
    router.push(`/patient/book-appointment?doctorId=${doctor.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Doctor Header Card */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex gap-6">
              <Avatar
                src={doctor.avatarUrl}
                firstName={doctor.firstName}
                lastName={doctor.lastName}
                size="xl"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      Dr. {doctor.firstName} {doctor.lastName}
                    </h1>
                    {doctor.specializations &&
                      doctor.specializations.length > 0 && (
                        <p className="text-blue-600 font-medium">
                          {doctor.specializations
                            .map((s) => s.specialization.name)
                            .join(', ')}
                        </p>
                      )}
                    {doctor.experience && (
                      <p className="text-gray-500 text-sm mt-1">
                        {doctor.experience} years of experience
                      </p>
                    )}
                  </div>
                  <Badge variant="success">Verified</Badge>
                </div>

                {/* Stats */}
                <div className="flex gap-6 mt-4">
                  {doctor.avgRating > 0 && (
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <Star
                          size={18}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-xl font-bold text-gray-900">
                          {doctor.avgRating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">
                        {doctor.totalReviews} reviews
                      </p>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-900">
                      {doctor.totalPatients}
                    </p>
                    <p className="text-xs text-gray-400">Patients</p>
                  </div>
                  {doctor.experience && (
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">
                        {doctor.experience}+
                      </p>
                      <p className="text-xs text-gray-400">Years</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* About */}
            {doctor.about && (
              <Card>
                <CardHeader>
                  <h2 className="font-semibold text-gray-900">About</h2>
                </CardHeader>
                <CardBody>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {doctor.about}
                  </p>
                </CardBody>
              </Card>
            )}

            {/* Qualifications */}
            {doctor.qualifications && doctor.qualifications.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <GraduationCap size={20} className="text-blue-600" />
                    <h2 className="font-semibold text-gray-900">
                      Qualifications
                    </h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-3">
                    {doctor.qualifications.map((qual) => (
                      <div key={qual.id} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {qual.degree}
                          </p>
                          <p className="text-sm text-gray-500">
                            {qual.institution}
                            {qual.year && ` — ${qual.year}`}
                            {qual.country && `, ${qual.country}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Clinics */}
            {doctor.clinics && doctor.clinics.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    <h2 className="font-semibold text-gray-900">Clinics</h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-4">
                    {doctor.clinics.map((clinic) => (
                      <div
                        key={clinic.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <p className="font-medium text-gray-900">
                          {clinic.clinicName}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {clinic.address}, {clinic.city}
                        </p>
                        {clinic.phone && (
                          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
                            <Phone size={14} />
                            {clinic.phone}
                          </div>
                        )}
                        {clinic.fee && (
                          <p className="text-sm font-medium text-blue-600 mt-2">
                            Fee: {formatCurrency(clinic.fee)}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}

            {/* Reviews */}
            {reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Star size={20} className="text-yellow-400" />
                    <h2 className="font-semibold text-gray-900">
                      Patient Reviews
                    </h2>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-4">
                    {reviews.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }
                              />
                            ))}
                          </div>
                        </div>
                        {review.comment && (
                          <p className="text-sm text-gray-600">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>

          {/* Right Column — Booking */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-4">
                <h3 className="font-semibold text-gray-900">Book Appointment</h3>

                {doctor.inPersonFee && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-blue-600" />
                      <span className="text-sm text-gray-700">In-Person</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(doctor.inPersonFee)}
                    </span>
                  </div>
                )}

                {doctor.isAvailableOnline && doctor.onlineFee && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-2">
                      <Video size={16} className="text-green-600" />
                      <span className="text-sm text-gray-700">Online</span>
                    </div>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(doctor.onlineFee)}
                    </span>
                  </div>
                )}

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBookAppointment}
                >
                  Book Appointment
                </Button>

                {!isAuthenticated && (
                  <p className="text-xs text-gray-400 text-center">
                    Please login to book an appointment
                  </p>
                )}
              </CardBody>
            </Card>

            {/* Schedule */}
            {doctor.schedules && doctor.schedules.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Schedule</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="flex flex-col gap-2">
                    {doctor.schedules.map((schedule) => (
                      <div
                        key={schedule.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600 capitalize">
                          {schedule.dayOfWeek.toLowerCase()}
                        </span>
                        <span className="text-gray-900 font-medium">
                          {schedule.startTime} - {schedule.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

