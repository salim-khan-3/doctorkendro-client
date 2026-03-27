export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1'

export const APP_NAME = 'DoctorKendro'

export const ROUTES = {
  // Auth
  LOGIN: '/login',
  REGISTER: '/register',

  // Patient
  PATIENT_DASHBOARD: '/patient',
  PATIENT_PROFILE: '/patient/profile',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_FAMILY: '/patient/family',

  // Doctor
  DOCTOR_DASHBOARD: '/doctor',
  DOCTOR_PROFILE: '/doctor/profile',
  DOCTOR_APPOINTMENTS: '/doctor/appointments',
  DOCTOR_SCHEDULE: '/doctor/schedule',

  // Admin
  ADMIN_DASHBOARD: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_DOCTORS: '/admin/doctors',
} as const

