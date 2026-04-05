import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { patientService } from '@/services/patient.service'
import toast from 'react-hot-toast'

export const usePatientProfile = () => {
  return useQuery({
    queryKey: ['patient-profile'],
    queryFn: () => patientService.getProfile(),
  })
}

export const useUpdatePatientProfile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patientService.updateProfile,
    onSuccess: () => {
      toast.success('Profile updated!')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
    },
    onError: () => toast.error('Failed to update profile'),
  })
}

export const useAddFamilyMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patientService.addFamilyMember,
    onSuccess: () => {
      toast.success('Family member added!')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
    },
    onError: () => toast.error('Failed to add family member'),
  })
}

export const useDeleteFamilyMember = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: patientService.deleteFamilyMember,
    onSuccess: () => {
      toast.success('Family member removed!')
      queryClient.invalidateQueries({ queryKey: ['patient-profile'] })
    },
    onError: () => toast.error('Failed to remove family member'),
  })
}