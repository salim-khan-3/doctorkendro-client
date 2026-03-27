import axiosInstance from '@/lib/axios'
import { ApiResponse, Appointment } from '@/types'

export const appointmentService = {
  // Book appointment
  bookAppointment: async (data: {
    doctorId: string
    type: 'IN_PERSON' | 'VIDEO' | 'AUDIO' | 'CHAT'
    scheduledAt: string
    familyMemberId?: string
    notes?: string
  }) => {
    const response = await axiosInstance.post<ApiResponse<Appointment>>(
      '/appointments',
      data
    )
    return response.data
  },

  // Get my appointments (patient)
  getMyAppointments: async (params?: {
    status?: string
    page?: number
    limit?: number
  }) => {
    const response = await axiosInstance.get<ApiResponse<Appointment[]>>(
      '/appointments/my',
      { params }
    )
    return response.data
  },

  // Get doctor appointments
  getDoctorAppointments: async (params?: {
    status?: string
    date?: string
    page?: number
    limit?: number
  }) => {
    const response = await axiosInstance.get<ApiResponse<Appointment[]>>(
      '/appointments/doctor',
      { params }
    )
    return response.data
  },

  // Get single appointment
  getAppointmentById: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Appointment>>(
      `/appointments/${id}`
    )
    return response.data
  },

  // Confirm appointment (doctor)
  confirmAppointment: async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/confirm`
    )
    return response.data
  },

  // Cancel appointment
  cancelAppointment: async (id: string, reason?: string) => {
    const response = await axiosInstance.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/cancel`,
      { reason }
    )
    return response.data
  },

  // Complete appointment (doctor)
  completeAppointment: async (id: string) => {
    const response = await axiosInstance.patch<ApiResponse<Appointment>>(
      `/appointments/${id}/complete`
    )
    return response.data
  },
}

