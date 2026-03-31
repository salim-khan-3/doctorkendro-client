'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { doctorService } from '@/services/doctor.service'
import { Search, Filter, Star, MapPin, Clock, Video } from 'lucide-react'
import { Card, CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Link from 'next/link'
import { formatCurrency } from '@/utils'

export default function DoctorsPage() {
  const [search, setSearch] = useState('')
  const [selectedSpec, setSelectedSpec] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedType, setSelectedType] = useState('')

  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ['doctors', search, selectedSpec, selectedCity, selectedType],
    queryFn: () =>
      doctorService.searchDoctors({
        q: search || undefined,
        specialization: selectedSpec || undefined,
        city: selectedCity || undefined,
        type: selectedType || undefined,
      }),
  })

  const { data: specsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => doctorService.getAllSpecializations(),
  })

  const doctors = doctorsData?.data || []
  const specializations = specsData?.data || []

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Doctors
          </h1>
          <p className="text-gray-500">
            Search from verified doctors and book appointments
          </p>

          {/* Search Bar */}
          <div className="mt-6 flex gap-3">
            <div className="flex-1 relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search by doctor name or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <Button variant="outline" size="lg">
              <Filter size={18} />
              Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block">
            <Card>
              <CardBody className="flex flex-col gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Specialization
                  </h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedSpec('')}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedSpec === ''
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Specializations
                    </button>
                    {specializations.map((spec) => (
                      <button
                        key={spec.id}
                        onClick={() => setSelectedSpec(spec.slug)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          selectedSpec === spec.slug
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {spec.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">City</h3>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setSelectedCity('')}
                      className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                        selectedCity === ''
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      All Cities
                    </button>
                    {cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          selectedCity === city
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Consultation Type
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { value: '', label: 'All Types' },
                      { value: 'online', label: 'Online' },
                      { value: 'in-person', label: 'In Person' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setSelectedType(type.value)}
                        className={`text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                          selectedType === type.value
                            ? 'bg-blue-50 text-blue-600 font-medium'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Doctor List */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" />
              </div>
            ) : doctors.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">No doctors found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try changing your search filters
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-gray-500">
                  {doctorsData?.meta?.total || 0} doctors found
                </p>
                {doctors.map((doctor) => (
                  <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                    <CardBody>
                      <div className="flex gap-4">
                        <Avatar
                          src={doctor.avatarUrl}
                          firstName={doctor.firstName}
                          lastName={doctor.lastName}
                          size="xl"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">
                                Dr. {doctor.firstName} {doctor.lastName}
                              </h3>
                              {doctor.specializations &&
                                doctor.specializations.length > 0 && (
                                  <p className="text-blue-600 text-sm font-medium">
                                    {
                                      doctor.specializations[0].specialization
                                        .name
                                    }
                                  </p>
                                )}
                              {doctor.experience && (
                                <p className="text-gray-500 text-sm">
                                  {doctor.experience} years experience
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {doctor.avgRating > 0 && (
                                <div className="flex items-center gap-1 justify-end">
                                  <Star
                                    size={16}
                                    className="text-yellow-400 fill-yellow-400"
                                  />
                                  <span className="font-semibold text-gray-900">
                                    {doctor.avgRating.toFixed(1)}
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    ({doctor.totalReviews})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {doctor.clinics && doctor.clinics.length > 0 && (
                              <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <MapPin size={14} />
                                {(doctor.clinics[0] as any).city}
                              </div>
                            )}
                            {doctor.isAvailableOnline && (
                              <Badge variant="success">
                                <Video size={12} className="mr-1" />
                                Online Available
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex gap-4">
                              {doctor.inPersonFee && (
                                <div>
                                  <p className="text-xs text-gray-400">
                                    In-person fee
                                  </p>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(doctor.inPersonFee)}
                                  </p>
                                </div>
                              )}
                              {doctor.onlineFee && (
                                <div>
                                  <p className="text-xs text-gray-400">
                                    Online fee
                                  </p>
                                  <p className="font-semibold text-gray-900">
                                    {formatCurrency(doctor.onlineFee)}
                                  </p>
                                </div>
                              )}
                            </div>
                            <Link href={`/doctors/${doctor.id}`}>
                              <Button size="sm">Book Appointment</Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

