import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { doctorService } from '@/services/doctor.service'
import toast from 'react-hot-toast'

export const useDoctorProfile = () => {
  return useQuery({
    queryKey: ['doctor-profile'],
    queryFn: () => doctorService.getMyProfile(),
  })
}

export const useSearchDoctors = (params?: {
  q?: string
  specialization?: string
  city?: string
  type?: string
  page?: number
}) => {
  return useQuery({
    queryKey: ['doctors', params],
    queryFn: () => doctorService.searchDoctors(params),
  })
}

export const useSpecializations = () => {
  return useQuery({
    queryKey: ['specializations'],
    queryFn: () => doctorService.getAllSpecializations(),
  })
}