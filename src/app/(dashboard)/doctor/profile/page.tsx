'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { doctorService } from '@/services/doctor.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import Badge from '@/components/ui/Badge'
import toast from 'react-hot-toast'
import { User, MapPin, Clock, Plus, GraduationCap } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  about: z.string().optional(),
  experience: z.coerce.number().optional(),
  isAvailableOnline: z.boolean().optional(),
  onlineFee: z.coerce.number().optional(),
  inPersonFee: z.coerce.number().optional(),
  gender: z.string().optional(),
})

const clinicSchema = z.object({
  clinicName: z.string().min(2),
  address: z.string().min(5),
  city: z.string().min(2),
  phone: z.string().optional(),
  fee: z.coerce.number().optional(),
})

const qualificationSchema = z.object({
  degree: z.string().min(2),
  institution: z.string().min(2),
  year: z.coerce.number().optional(),
  country: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type ClinicFormData = z.infer<typeof clinicSchema>
type QualificationFormData = z.infer<typeof qualificationSchema>

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']

export default function DoctorProfilePage() {
  const [showClinicForm, setShowClinicForm] = useState(false)
  const [showQualForm, setShowQualForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => doctorService.getMyProfile(),
  })

  const { data: specsData } = useQuery({
    queryKey: ['specializations'],
    queryFn: () => doctorService.getAllSpecializations(),
  })

  const profile = profileData?.data
  const specializations = specsData?.data || []

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      about: profile?.about || '',
      experience: profile?.experience || 0,
      isAvailableOnline: profile?.isAvailableOnline || false,
      onlineFee: Number(profile?.onlineFee) || 0,
      inPersonFee: Number(profile?.inPersonFee) || 0,
      gender: profile?.gender || '',
    },
  })

  const { register: registerClinic, handleSubmit: handleClinicSubmit, reset: resetClinic, formState: { errors: clinicErrors } } = useForm<ClinicFormData>({
    resolver: zodResolver(clinicSchema),
  })

  const { register: registerQual, handleSubmit: handleQualSubmit, reset: resetQual, formState: { errors: qualErrors } } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
  })

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => doctorService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated!')
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] })
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const addClinicMutation = useMutation({
    mutationFn: (data: ClinicFormData) => doctorService.addClinic(data),
    onSuccess: () => {
      toast.success('Clinic added!')
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] })
      setShowClinicForm(false)
      resetClinic()
    },
    onError: () => toast.error('Failed to add clinic'),
  })

  const addQualMutation = useMutation({
    mutationFn: (data: QualificationFormData) => doctorService.addQualification(data as any),
    onSuccess: () => {
      toast.success('Qualification added!')
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] })
      setShowQualForm(false)
      resetQual()
    },
    onError: () => toast.error('Failed to add qualification'),
  })

  const addSpecMutation = useMutation({
    mutationFn: (specializationId: string) =>
      doctorService.addSpecialization({ specializationId, isPrimary: false }),
    onSuccess: () => {
      toast.success('Specialization added!')
      queryClient.invalidateQueries({ queryKey: ['doctor-profile'] })
    },
    onError: () => toast.error('Failed to add specialization'),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

        {/* Avatar & Status */}
        <Card className="mb-6">
          <CardBody>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {profile && (
                  <Avatar
                    src={profile.avatarUrl}
                    firstName={profile.firstName}
                    lastName={profile.lastName}
                    size="xl"
                  />
                )}
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Dr. {profile?.firstName} {profile?.lastName}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {profile?.specializations?.[0]?.specialization.name}
                  </p>
                </div>
              </div>
              {profile?.verificationStatus === 'VERIFIED' ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <Badge variant="warning">Pending Verification</Badge>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Profile Form */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">Basic Information</h2>
            </div>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" error={errors.firstName?.message} {...register('firstName')} />
                <Input label="Last Name" error={errors.lastName?.message} {...register('lastName')} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="Experience (years)" type="number" {...register('experience')} />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">Gender</label>
                  <select
                    {...register('gender')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">About</label>
                <textarea
                  {...register('about')}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Write about yourself..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label="In-Person Fee (PKR)" type="number" {...register('inPersonFee')} />
                <Input label="Online Fee (PKR)" type="number" {...register('onlineFee')} />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isAvailableOnline"
                  {...register('isAvailableOnline')}
                  className="w-4 h-4 text-blue-600"
                />
                <label htmlFor="isAvailableOnline" className="text-sm text-gray-700">
                  Available for online consultations
                </label>
              </div>

              <Button type="submit" isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Specializations */}
        <Card className="mb-6">
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Specializations</h2>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2 mb-4">
              {profile?.specializations?.map((spec) => (
                <Badge key={spec.id} variant="info">
                  {spec.specialization.name}
                  {spec.isPrimary && ' ⭐'}
                </Badge>
              ))}
              {profile?.specializations?.length === 0 && (
                <p className="text-gray-400 text-sm">No specializations added</p>
              )}
            </div>
            <div className="flex gap-2">
              <select
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => {
                  if (e.target.value) addSpecMutation.mutate(e.target.value)
                  e.target.value = ''
                }}
              >
                <option value="">Add specialization...</option>
                {specializations.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))}
              </select>
            </div>
          </CardBody>
        </Card>

        {/* Qualifications */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap size={20} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900">Qualifications</h2>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowQualForm(!showQualForm)}>
                <Plus size={16} className="mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {showQualForm && (
              <form
                onSubmit={handleQualSubmit((data) => addQualMutation.mutate(data))}
                className="flex flex-col gap-4 mb-6 p-4 bg-blue-50 rounded-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Degree" placeholder="MBBS, MD..." error={qualErrors.degree?.message} {...registerQual('degree')} />
                  <Input label="Institution" error={qualErrors.institution?.message} {...registerQual('institution')} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Year" type="number" {...registerQual('year')} />
                  <Input label="Country" {...registerQual('country')} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" isLoading={addQualMutation.isPending}>Add</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowQualForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="flex flex-col gap-3">
              {profile?.qualifications?.map((qual) => (
                <div key={qual.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">{qual.degree}</p>
                    <p className="text-sm text-gray-500">
                      {qual.institution}
                      {qual.year && ` — ${qual.year}`}
                      {qual.country && `, ${qual.country}`}
                    </p>
                  </div>
                </div>
              ))}
              {profile?.qualifications?.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-2">No qualifications added</p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Clinics */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={20} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900">Clinics</h2>
              </div>
              <Button size="sm" variant="outline" onClick={() => setShowClinicForm(!showClinicForm)}>
                <Plus size={16} className="mr-1" />
                Add Clinic
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {showClinicForm && (
              <form
                onSubmit={handleClinicSubmit((data) => addClinicMutation.mutate(data))}
                className="flex flex-col gap-4 mb-6 p-4 bg-blue-50 rounded-xl"
              >
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Clinic Name" error={clinicErrors.clinicName?.message} {...registerClinic('clinicName')} />
                  <Input label="City" error={clinicErrors.city?.message} {...registerClinic('city')} />
                </div>
                <Input label="Address" error={clinicErrors.address?.message} {...registerClinic('address')} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Phone" {...registerClinic('phone')} />
                  <Input label="Fee (PKR)" type="number" {...registerClinic('fee')} />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" isLoading={addClinicMutation.isPending}>Add Clinic</Button>
                  <Button type="button" variant="ghost" onClick={() => setShowClinicForm(false)}>Cancel</Button>
                </div>
              </form>
            )}

            <div className="flex flex-col gap-3">
              {profile?.clinics?.map((clinic) => (
                <div key={clinic.id} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-medium text-gray-900">{clinic.clinicName}</p>
                  <p className="text-sm text-gray-500">{clinic.address}, {clinic.city}</p>
                  {clinic.phone && <p className="text-sm text-gray-400">{clinic.phone}</p>}
                  {clinic.fee && <p className="text-sm font-medium text-blue-600 mt-1">Fee: PKR {clinic.fee}</p>}
                </div>
              ))}
              {profile?.clinics?.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-2">No clinics added</p>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock size={20} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">Schedule</h2>
            </div>
          </CardHeader>
          <CardBody>
            {profile?.schedules && profile.schedules.length > 0 ? (
              <div className="flex flex-col gap-2">
                {profile.schedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <span className="text-gray-700 font-medium capitalize">
                      {schedule.dayOfWeek.toLowerCase()}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {schedule.startTime} - {schedule.endTime}
                    </span>
                    <Badge variant={schedule.isAvailable ? 'success' : 'danger'}>
                      {schedule.isAvailable ? 'Available' : 'Unavailable'}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No schedule set yet
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

