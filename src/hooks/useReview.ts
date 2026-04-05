import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reviewService } from '@/services/review.service'
import toast from 'react-hot-toast'

export const useDoctorReviews = (doctorId: string) => {
  return useQuery({
    queryKey: ['doctor-reviews', doctorId],
    queryFn: () => reviewService.getDoctorReviews(doctorId),
    enabled: !!doctorId,
  })
}

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: reviewService.createReview,
    onSuccess: () => {
      toast.success('Review submitted!')
      queryClient.invalidateQueries({ queryKey: ['my-appointments'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    },
  })
}