import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '@/services/appointment.service'
import toast from 'react-hot-toast'

export const useMyAppointments = (params?: { status?: string }) => {
  return useQuery({
    queryKey: ['my-appointments', params],
    queryFn: () => appointmentService.getMyAppointments(params),
  })
}

export const useDoctorAppointments = (params?: {
  status?: string
  date?: string
}) => {
  return useQuery({
    queryKey: ['doctor-appointments', params],
    queryFn: () => appointmentService.getDoctorAppointments(params),
  })
}

export const useBookAppointment = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: appointmentService.bookAppointment,
    onSuccess: () => {
      toast.success('Appointment booked!')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book')
    },
  })
}