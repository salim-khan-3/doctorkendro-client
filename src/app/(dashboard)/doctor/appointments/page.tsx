'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { appointmentService } from '@/services/appointment.service'
import { Card, CardBody } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Avatar from '@/components/ui/Avatar'
import Spinner from '@/components/ui/Spinner'
import Button from '@/components/ui/Button'
import { formatDateTime, getAppointmentTypeLabel } from '@/utils'
import { Calendar, Clock, MapPin, Video, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUS_TABS = [
  { value: '', label: 'All' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRMED', label: 'Confirmed' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function DoctorAppointmentsPage() {
  const [activeTab, setActiveTab] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['doctor-appointments', activeTab, selectedDate],
    queryFn: () =>
      appointmentService.getDoctorAppointments({
        status: activeTab || undefined,
        date: selectedDate || undefined,
      }),
  })

  const confirmMutation = useMutation({
    mutationFn: (id: string) => appointmentService.confirmAppointment(id),
    onSuccess: () => {
      toast.success('Appointment confirmed!')
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to confirm')
    },
  })

  const completeMutation = useMutation({
    mutationFn: (id: string) => appointmentService.completeAppointment(id),
    onSuccess: () => {
      toast.success('Appointment completed!')
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to complete')
    },
  })

  const cancelMutation = useMutation({
    mutationFn: (id: string) =>
      appointmentService.cancelAppointment(id, 'Cancelled by doctor'),
    onSuccess: () => {
      toast.success('Appointment cancelled')
      queryClient.invalidateQueries({ queryKey: ['doctor-appointments'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel')
    },
  })

  const appointments = data?.data || []

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          My Appointments
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Status Tabs */}
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Date Filter */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {selectedDate && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDate('')}
            >
              Clear Date
            </Button>
          )}
        </div>

        {/* Appointments List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-20">
            <Calendar size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {appointments.map((apt) => (
              <Card key={apt.id}>
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4">
                      <Avatar
                        src={(apt.patient as any)?.avatarUrl}
                        firstName={(apt.patient as any)?.firstName || 'P'}
                        lastName={(apt.patient as any)?.lastName || 'A'}
                        size="md"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {(apt.patient as any)?.firstName}{' '}
                          {(apt.patient as any)?.lastName}
                        </h3>

                        <div className="flex flex-wrap gap-3 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Clock size={14} />
                            {formatDateTime(apt.scheduledAt)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            {apt.type === 'IN_PERSON' ? (
                              <MapPin size={14} />
                            ) : (
                              <Video size={14} />
                            )}
                            {getAppointmentTypeLabel(apt.type)}
                          </div>
                        </div>

                        {apt.notes && (
                          <p className="text-sm text-gray-400 mt-1 italic">
                            "{apt.notes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          apt.status === 'COMPLETED'
                            ? 'success'
                            : apt.status === 'CONFIRMED'
                            ? 'info'
                            : apt.status === 'CANCELLED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {apt.status}
                      </Badge>

                      <div className="flex gap-2">
                        {apt.status === 'PENDING' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => confirmMutation.mutate(apt.id)}
                              isLoading={confirmMutation.isPending}
                            >
                              <Check size={14} className="mr-1" />
                              Confirm
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => cancelMutation.mutate(apt.id)}
                              isLoading={cancelMutation.isPending}
                            >
                              <X size={14} className="mr-1" />
                              Cancel
                            </Button>
                          </>
                        )}

                        {apt.status === 'CONFIRMED' && (
                          <Button
                            size="sm"
                            onClick={() => completeMutation.mutate(apt.id)}
                            isLoading={completeMutation.isPending}
                          >
                            <Check size={14} className="mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

