import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { UserSchema } from '@/Schemas/userSchema'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '../../auth-client'

import { checkIfUserExists } from '@/actions/user'
import { getUserLastWorkspaceSlug } from '@/actions/workspace'

export const useUser = ({ type = 'signup' }: { type: 'signup' | 'signin' }) => {
  const router = useRouter()
  const [serverMsg, setServerMsg] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const { data, isPending, mutate } = useMutationData({
    mutationKey: [type === 'signup' ? 'signUpUser' : 'signInUser'],
    mutationFn: async (data: { email: string }) => {
      const userExists = await checkIfUserExists(data.email)
      const inviteToken = localStorage.getItem('pending_invite_token')

      if (type === 'signup') {
        await authClient.signIn.magicLink(
          {
            email: data.email,
            callbackURL: inviteToken
              ? `${window.location.origin}/profile-setup?token=${inviteToken}`
              : `${window.location.origin}/create-workspace?onboarding=true`,
          },
          {
            onSuccess: async () => {
              setServerMsg('Email sent successfully! ')
            },
            onError: (ctx) => {
              setError(ctx.error.message ?? 'Something went wrong.')
            },
          }
        )
      }

      if (type === 'signin') {
        if (!userExists) {
          setError('User not found. Please sign up first.')
          return
        }

        await authClient.signIn.magicLink(
          { email: data.email },
          {
            onSuccess: async () => {
              setServerMsg('Email sent successfully! ')
              const slug = await getUserLastWorkspaceSlug(data.email)
              router.push(`/workspace/${slug}`)
            },
            onError: (ctx) => {
              setError(ctx.error.message ?? 'Something went wrong.')
            },
          }
        )
      }
    },
  })

  const { register, errors, onFormSubmit, watch, isValid } = useZodForm(
    UserSchema,
    mutate
  )

  useEffect(() => {
    const subscription = watch(() => setServerMsg(null))
    return () => subscription.unsubscribe()
  }, [watch])

  return {
    register,
    errors,
    isValid,
    watch,
    onFormSubmit,
    isPending,
    data,
    error,
    mutate,
    serverMsg,
  }
}
