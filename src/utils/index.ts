import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date
export const formatDate = (date: string | null): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Format date time
export const formatDateTime = (date: string | null): string => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Format currency (PKR)
export const formatCurrency = (amount: string | number | null): string => {
  if (!amount) return 'N/A'
  return `PKR ${Number(amount).toLocaleString()}`
}

// Get initials from name
export const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

// Get appointment status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'CONFIRMED':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    case 'NO_SHOW':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Get appointment type label
export const getAppointmentTypeLabel = (type: string): string => {
  switch (type) {
    case 'IN_PERSON':
      return 'In Person'
    case 'VIDEO':
      return 'Video Call'
    case 'AUDIO':
      return 'Audio Call'
    case 'CHAT':
      return 'Chat'
    default:
      return type
  }
}

// Calculate age from date of birth
export const calculateAge = (dateOfBirth: string | null): string => {
  if (!dateOfBirth) return 'N/A'
  const today = new Date()
  const birth = new Date(dateOfBirth)
  const age = today.getFullYear() - birth.getFullYear()
  return `${age} years`
}

