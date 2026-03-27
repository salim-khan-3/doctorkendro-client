import axiosInstance from '@/lib/axios'
import { ApiResponse, Doctor, Specialization } from '@/types'

export const doctorService = {
  // Search doctors
  searchDoctors: async (params?: {
    q?: string
    specialization?: string
    city?: string
    gender?: string
    type?: string
    minFee?: string
    maxFee?: string
    minRating?: string
    sortBy?: string
    order?: string
    page?: number
    limit?: number
  }) => {
    const response = await axiosInstance.get<ApiResponse<Doctor[]>>(
      '/doctors',
      { params }
    )
    return response.data
  },

  // Get doctor profile
  getDoctorProfile: async (id: string) => {
    const response = await axiosInstance.get<ApiResponse<Doctor>>(
      `/doctors/${id}`
    )
    return response.data
  },

  // Get my doctor profile
  getMyProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<Doctor>>(
      '/doctors/me/profile'
    )
    return response.data
  },

  // Update doctor profile
  updateProfile: async (data: Partial<Doctor>) => {
    const response = await axiosInstance.patch<ApiResponse<Doctor>>(
      '/doctors/me/profile',
      data
    )
    return response.data
  },

  // Add clinic
  addClinic: async (data: {
    clinicName: string
    address: string
    city: string
    phone?: string
    fee?: number
  }) => {
    const response = await axiosInstance.post<ApiResponse<Doctor>>(
      '/doctors/me/clinic',
      data
    )
    return response.data
  },

  // Set schedule
  setSchedule: async (schedules: Array<{
    dayOfWeek: string
    startTime: string
    endTime: string
    slotDuration: number
    maxPatients: number
    isAvailable: boolean
  }>) => {
    const response = await axiosInstance.post<ApiResponse<{ count: number }>>(
      '/doctors/me/schedule',
      { schedules }
    )
    return response.data
  },

  // Add specialization
  addSpecialization: async (data: {
    specializationId: string
    isPrimary: boolean
  }) => {
    const response = await axiosInstance.post<ApiResponse<Doctor>>(
      '/doctors/me/specialization',
      data
    )
    return response.data
  },

  // Get all specializations
  getAllSpecializations: async () => {
    const response = await axiosInstance.get<ApiResponse<Specialization[]>>(
      '/doctors/specializations'
    )
    return response.data
  },
}

