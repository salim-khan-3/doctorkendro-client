// ---- AUTH ----
export interface User {
  id: string
  email: string | null
  phone: string | null
  role: 'PATIENT' | 'DOCTOR' | 'SUPER_ADMIN'
  isActive: boolean
  isEmailVerified: boolean
  isPhoneVerified: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
  patient?: Patient | null
  doctor?: Doctor | null
}

export interface AuthResponse {
  user: User
  accessToken: string
}

// ---- PATIENT ----
export interface Patient {
  id: string
  userId: string
  firstName: string
  lastName: string
  dateOfBirth: string | null
  gender: string | null
  avatarUrl: string | null
  bloodGroup: string | null
  address: string | null
  city: string | null
  createdAt: string
  updatedAt: string
  familyMembers?: FamilyMember[]
}

export interface FamilyMember {
  id: string
  patientId: string
  firstName: string
  lastName: string
  relation: string
  dateOfBirth: string | null
  gender: string | null
  bloodGroup: string | null
  createdAt: string
  updatedAt: string
}

// ---- DOCTOR ----
export interface Doctor {
  id: string
  userId: string
  firstName: string
  lastName: string
  gender: string | null
  avatarUrl: string | null
  pmcNumber: string | null
  about: string | null
  experience: number | null
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED'
  isAvailableOnline: boolean
  onlineFee: string | null
  inPersonFee: string | null
  avgRating: number
  totalReviews: number
  totalPatients: number
  createdAt: string
  updatedAt: string
  specializations?: DoctorSpecialization[]
  qualifications?: DoctorQualification[]
  clinics?: DoctorClinic[]
  schedules?: DoctorSchedule[]
}

export interface DoctorSpecialization {
  id: string
  doctorId: string
  specializationId: string
  isPrimary: boolean
  specialization: Specialization
}

export interface Specialization {
  id: string
  name: string
  slug: string
  description: string | null
  iconUrl: string | null
}

export interface DoctorQualification {
  id: string
  doctorId: string
  degree: string
  institution: string
  year: number | null
  country: string | null
}

export interface DoctorClinic {
  id: string
  doctorId: string
  clinicName: string
  address: string
  city: string
  phone: string | null
  fee: string | null
  latitude: number | null
  longitude: number | null
  isActive: boolean
}

export interface DoctorSchedule {
  id: string
  doctorId: string
  clinicId: string | null
  dayOfWeek: string
  startTime: string
  endTime: string
  slotDuration: number
  maxPatients: number
  isAvailable: boolean
}

// ---- APPOINTMENT ----
export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  familyMemberId: string | null
  type: 'IN_PERSON' | 'VIDEO' | 'AUDIO' | 'CHAT'
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW'
  scheduledAt: string
  notes: string | null
  cancellationReason: string | null
  fee: string
  tokenNumber: number | null
  createdAt: string
  updatedAt: string
  doctor?: Partial<Doctor>
  patient?: Partial<Patient>
  review?: Review | null
}

// ---- REVIEW ----
export interface Review {
  id: string
  userId: string
  appointmentId: string
  doctorId: string
  rating: number
  comment: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

// ---- API RESPONSE ----
export interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  meta?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ---- FORM TYPES ----
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  email: string
  password: string
  role: 'PATIENT' | 'DOCTOR'
}

