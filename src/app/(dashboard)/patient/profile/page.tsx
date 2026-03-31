'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { patientService } from '@/services/patient.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Spinner from '@/components/ui/Spinner'
import toast from 'react-hot-toast'
import { User, Users, Plus, Trash2 } from 'lucide-react'

const profileSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
})

const familySchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  relation: z.string().min(1, 'Relation is required'),
  gender: z.string().optional(),
  bloodGroup: z.string().optional(),
  dateOfBirth: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>
type FamilyFormData = z.infer<typeof familySchema>

export default function PatientProfilePage() {
  const [showFamilyForm, setShowFamilyForm] = useState(false)
  const queryClient = useQueryClient()

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['patient-profile'],
    queryFn: () => patientService.getProfile(),
  })

  const profile = profileData?.data

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      dateOfBirth: profile?.dateOfBirth?.split('T')[0] || '',
      gender: profile?.gender || '',
      bloodGroup: profile?.bloodGroup || '',
      address: profile?.address || '',
      city: profile?.city || '',
    },
  })

  const {
    register: registerFamily,
    handleSubmit: handleFamilySubmit,
    reset: resetFamily,
    formState: { errors: familyErrors },
  } = useForm<FamilyFormData>({
    resolver: zodResolver(familySchema),
  })

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => patientService.updateProfile(data),
    onSuccess: () => {
      toast.success('Profile updated!')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const addFamilyMutation = useMutation({
    mutationFn: (data: FamilyFormData) => patientService.addFamilyMember(data),
    onSuccess: () => {
      toast.success('Family member added!')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
      setShowFamilyForm(false)
      resetFamily()
    },
    onError: () => toast.error('Failed to add family member'),
  })

  const deleteFamilyMutation = useMutation({
    mutationFn: (id: string) => patientService.deleteFamilyMember(id),
    onSuccess: () => {
      toast.success('Family member removed')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
    },
    onError: () => toast.error('Failed to remove family member'),
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

        {/* Avatar */}
        <Card className="mb-6">
          <CardBody>
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
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-gray-500 text-sm">Patient</p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Profile Form */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User size={20} className="text-blue-600" />
              <h2 className="font-semibold text-gray-900">
                Personal Information
              </h2>
            </div>
          </CardHeader>
          <CardBody>
            <form
              onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
              className="flex flex-col gap-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  {...register('dateOfBirth')}
                />
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-gray-700">
                    Blood Group
                  </label>
                  <select
                    {...register('bloodGroup')}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select blood group</option>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <Input label="City" {...register('city')} />
              </div>

              <Input
                label="Address"
                {...register('address')}
              />

              <Button
                type="submit"
                isLoading={updateMutation.isPending}
                className="w-full"
              >
                Save Changes
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Family Members */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                <h2 className="font-semibold text-gray-900">Family Members</h2>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowFamilyForm(!showFamilyForm)}
              >
                <Plus size={16} className="mr-1" />
                Add Member
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            {/* Add Family Form */}
            {showFamilyForm && (
              <form
                onSubmit={handleFamilySubmit((data) =>
                  addFamilyMutation.mutate(data)
                )}
                className="flex flex-col gap-4 mb-6 p-4 bg-blue-50 rounded-xl"
              >
                <h3 className="font-medium text-gray-900">
                  Add Family Member
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    error={familyErrors.firstName?.message}
                    {...registerFamily('firstName')}
                  />
                  <Input
                    label="Last Name"
                    error={familyErrors.lastName?.message}
                    {...registerFamily('lastName')}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Relation"
                    placeholder="e.g. spouse, child, parent"
                    error={familyErrors.relation?.message}
                    {...registerFamily('relation')}
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-gray-700">
                      Gender
                    </label>
                    <select
                      {...registerFamily('gender')}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    isLoading={addFamilyMutation.isPending}
                  >
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowFamilyForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Family Members List */}
            {profile?.familyMembers && profile.familyMembers.length > 0 ? (
              <div className="flex flex-col gap-3">
                {profile.familyMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {member.firstName.charAt(0)}
                          {member.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">
                          {member.relation}
                          {member.gender && ` • ${member.gender}`}
                          {member.bloodGroup && ` • ${member.bloodGroup}`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteFamilyMutation.mutate(member.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">
                No family members added yet
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
