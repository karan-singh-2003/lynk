'use client'

import useMutationData from './useMutationData'
import useZodForm from './useZodForm'
import { createWorkspace } from '@/actions/workspace'
import { createWorkspaceSchema } from '@/Schemas/workspaceSchema'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

const useCreateWorkspace = () => {
  const [serverError, setServerError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isOnboarding = searchParams?.get('onboarding') === 'true'

  const { mutate, isPending, data } = useMutationData({
    mutationKey: ['createWorkspace'],
    mutationFn: async (data: {
      workspacename: string
      workspaceslug: string
    }) => {
      console.log('Creating workspace with data:', data)
      const response = await createWorkspace(data)
      if (response.status !== 200) {
        throw new Error('An error occurred while creating workspace.')
      }
      const slug =
        typeof response.data === 'object' &&
        response.data !== null &&
        'slug' in response.data
          ? response.data.slug
          : data.workspaceslug

      if (isOnboarding) {
        router.push(`/invite-members?slug=${encodeURIComponent(slug)}`)
      } else {
        router.push(`/${slug}`)
      }
      return response
    },
    onError: (error: Error) => {
      console.error('Error creating workspace:', error)
      setServerError(error.message)
    },
    onSuccess: () => {
      console.log('Workspace created successfully, redirecting...')
    },
    queryKey: 'workspaces',
  })

  const { register, errors, onFormSubmit, isValid, watch, setValue } =
    useZodForm(createWorkspaceSchema, mutate)

  return {
    register,
    errors,
    onFormSubmit,
    isValid,
    isPending,
    setValue,
    data,
    watch,
    serverError,
  }
}

export default useCreateWorkspace
