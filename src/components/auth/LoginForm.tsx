'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { ROUTES } from '@/config'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const { login, isLoggingIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 mt-2">Sign in to your account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          error={errors.email?.message}
          required
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          required
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          isLoading={isLoggingIn}
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don&apos;t have an account?{' '}
        <Link
          href={ROUTES.REGISTER}
          className="text-blue-600 font-medium hover:underline"
        >
          Register here
        </Link>
      </p>
    </div>
  )
}

