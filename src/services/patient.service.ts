import axiosInstance from '@/lib/axios'
import { ApiResponse, Patient, FamilyMember } from '@/types'

export const patientService = {
  // Get patient profile
  getProfile: async () => {
    const response = await axiosInstance.get<ApiResponse<Patient>>(
      '/patients/profile'
    )
    return response.data
  },

  // Update patient profile
  updateProfile: async (data: Partial<Patient>) => {
    const response = await axiosInstance.patch<ApiResponse<Patient>>(
      '/patients/profile',
      data
    )
    return response.data
  },

  // Add family member
  addFamilyMember: async (data: {
    firstName: string
    lastName: string
    relation: string
    dateOfBirth?: string
    gender?: string
    bloodGroup?: string
  }) => {
    const response = await axiosInstance.post<ApiResponse<FamilyMember>>(
      '/patients/family',
      data
    )
    return response.data
  },

  // Delete family member
  deleteFamilyMember: async (memberId: string) => {
    const response = await axiosInstance.delete<ApiResponse<null>>(
      `/patients/family/${memberId}`
    )
    return response.data
  },

  // Get medical records
  getMedicalRecords: async () => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      '/patients/medical-records'
    )
    return response.data
  },

  // Add medical record
  addMedicalRecord: async (data: {
    title: string
    description?: string
    fileUrl?: string
    fileType?: string
    recordDate: string
  }) => {
    const response = await axiosInstance.post<ApiResponse<any>>(
      '/patients/medical-records',
      data
    )
    return response.data
  },
}

