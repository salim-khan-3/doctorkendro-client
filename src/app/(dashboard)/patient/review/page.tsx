'use client'

import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useSearchParams, useRouter } from 'next/navigation'
import { reviewService } from '@/services/review.service'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { ROUTES } from '@/config'

export default function WriteReviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const appointmentId = searchParams.get('appointmentId') || ''
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')

  const reviewMutation = useMutation({
    mutationFn: () =>
      reviewService.createReview({
        appointmentId,
        rating,
        comment: comment || undefined,
      }),
    onSuccess: () => {
      toast.success('Review submitted!')
      router.replace(ROUTES.PATIENT_APPOINTMENTS)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Write a Review
        </h1>

        <Card>
          <CardHeader>
            <h2 className="font-semibold text-gray-900">Rate your experience</h2>
          </CardHeader>
          <CardBody className="flex flex-col gap-6">
            {/* Star Rating */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={40}
                      className={
                        star <= (hoveredRating || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500">
                {rating === 0
                  ? 'Select a rating'
                  : rating === 1
                  ? 'Poor'
                  : rating === 2
                  ? 'Fair'
                  : rating === 3
                  ? 'Good'
                  : rating === 4
                  ? 'Very Good'
                  : 'Excellent'}
              </p>
            </div>

            {/* Comment */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">
                Comment (Optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => reviewMutation.mutate()}
              isLoading={reviewMutation.isPending}
              disabled={rating === 0}
            >
              Submit Review
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}