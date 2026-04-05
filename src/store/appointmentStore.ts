import { create } from 'zustand'
import { Appointment } from '@/types'

interface AppointmentState {
  selectedAppointment: Appointment | null
  setSelectedAppointment: (appointment: Appointment | null) => void
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
  selectedAppointment: null,
  setSelectedAppointment: (appointment) =>
    set({ selectedAppointment: appointment }),
}))