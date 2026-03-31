import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authService } from '@/services/auth.service'
import { useAuthStore } from '@/store/authStore'
import { LoginForm, RegisterForm } from '@/types'

export const useAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore()

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => authService.loginWithEmail(data),
    onSuccess: (response) => {
      if (response.data) {
        setAuth(response.data.user, response.data.accessToken)
        toast.success('Login successful!')

        const role = response.data.user.role
        setTimeout(() => {
          if (role === 'PATIENT') router.replace('/patient')
          else if (role === 'DOCTOR') router.replace('/doctor')
          else if (role === 'SUPER_ADMIN') router.replace('/admin')
        }, 500)
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Login failed')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => authService.registerWithEmail(data),
    onSuccess: () => {
      toast.success('Registration successful! Please login.')
      router.replace('/login')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Registration failed')
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      storeLogout()
      queryClient.clear()
      toast.success('Logged out successfully')
      router.replace('/login')
    },
    onError: () => {
      storeLogout()
      queryClient.clear()
      router.replace('/login')
    },
  })

  // Get current user
  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  })

  return {
    user: meData?.data || user,
    isAuthenticated,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}










// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import { useRouter } from 'next/navigation'
// import toast from 'react-hot-toast'
// import { authService } from '@/services/auth.service'
// import { useAuthStore } from '@/store/authStore'
// import { LoginForm, RegisterForm } from '@/types'

// export const useAuth = () => {
//   const router = useRouter()
//   const queryClient = useQueryClient()
//   const { setAuth, logout: storeLogout, user, isAuthenticated } = useAuthStore()

//   // Login mutation
//   const loginMutation = useMutation({
//     mutationFn: (data: LoginForm) => authService.loginWithEmail(data),
//     onSuccess: (response) => {
//       if (response.data) {
//         setAuth(response.data.user, response.data.accessToken)
//         toast.success('Login successful!')

//         // Redirect based on role
//         const role = response.data.user.role
//         if (role === 'PATIENT') router.push('/patient')
//         else if (role === 'DOCTOR') router.push('/doctor')
//         else if (role === 'SUPER_ADMIN') router.push('/admin')
//       }
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Login failed')
//     },
//   })

//   // Register mutation
//   const registerMutation = useMutation({
//     mutationFn: (data: RegisterForm) => authService.registerWithEmail(data),
//     onSuccess: () => {
//       toast.success('Registration successful! Please login.')
//       router.push('/login')
//     },
//     onError: (error: any) => {
//       toast.error(error.response?.data?.message || 'Registration failed')
//     },
//   })

//   // Logout mutation
//   const logoutMutation = useMutation({
//     mutationFn: () => authService.logout(),
//     onSuccess: () => {
//       storeLogout()
//       queryClient.clear()
//       toast.success('Logged out successfully')
//       router.push('/login')
//     },
//     onError: () => {
//       storeLogout()
//       queryClient.clear()
//       router.push('/login')
//     },
//   })

//   // Get current user
//   const { data: meData } = useQuery({
//     queryKey: ['me'],
//     queryFn: () => authService.getMe(),
//     enabled: isAuthenticated,
//     staleTime: 1000 * 60 * 5,
//   })

//   return {
//     user: meData?.data || user,
//     isAuthenticated,
//     login: loginMutation.mutate,
//     isLoggingIn: loginMutation.isPending,
//     register: registerMutation.mutate,
//     isRegistering: registerMutation.isPending,
//     logout: logoutMutation.mutate,
//     isLoggingOut: logoutMutation.isPending,
//   }
// }

