'use client'

import React, { useState } from 'react'
import LoginButton from '@/components/AuthPage/LoginButton'
import LinkSkeleton from '@/components/AuthPage/LinkSkeleton'
import { useUser } from '@/hooks/useUser'
import FormElement from '@/components/Global/FormElement'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect } from 'react'
import Spinner from '@/components/Global/Spinner'
import { CircleCheck, X } from 'lucide-react'
import WorkspaceDescription from '@/components/Global/WorkspaceDescription'
import { useSearchParams } from 'next/navigation'

const SignInPage = () => {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')
  const [isInviteFlow, setIsInviteFlow] = useState(false)

  useEffect(() => {
    if (redirect && redirect.startsWith('/invite/')) {
      setIsInviteFlow(true)
    }
  }, [redirect])

  const options = [
    {
      key: 'google',
      text: 'Log in with Google',
      imgUrl: '/google.svg',
      onClick: () => {
        localStorage.setItem('lastUsedLogin', 'google')
        console.log('Google login clicked')
      },
    },
    {
      key: 'microsoft',
      text: 'Log in with Microsoft',
      imgUrl: '/microsoft.svg',
      onClick: () => {
        localStorage.setItem('lastUsedLogin', 'microsoft')
        console.log('Microsoft login clicked')
      },
    },
  ]
  const [lastUsedLogin, setLastUsedLogin] = useState<string | null>(null)

  useEffect(() => {
    const last = localStorage.getItem('lastUsedLogin')
    if (last) setLastUsedLogin(last)
  }, [])

  const { register, onFormSubmit, isPending, serverMsg, errors, error } =
    useUser({
      type: 'signin',
    })
  const isLastUsed = lastUsedLogin === 'email'

  return (
    <div className="flex h-screen w-full flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 flex flex-col justify-center px-6 gap-4">
        <div className="flex  flex-col w-[330px]  lg:w-[460px]  mx-auto mt-10 lg:mt-0 md:mt-0">
          <h1
            style={{ fontFamily: 'var(--font-poppins)' }}
            className="text-[24px] lg:text-[28px] font-bold"
          >
            <Link href="/">Lynk</Link>
          </h1>
          {!isInviteFlow && (
            <div className="font-medium text-[18px] lg:text-[22px] mt-1 mb-6">
              Access your Lynk dashboard.
            </div>
          )}
          {isInviteFlow && (
            <div className="w-[350px]  lg:w-3/4  mt-10 lg:mt-0 md:mt-0">
              {' '}
              <WorkspaceDescription></WorkspaceDescription>
            </div>
          )}
          {serverMsg && (
            <div className="text-normal text-[#117031] bg-[#CFFFDC] mb-4 flex items-center justify-center gap-x-2 w-full lg:w-3/4 text-center py-4 px-4 font-medium text-[14px]">
              <div>
                <CircleCheck size={16} />
              </div>
              <div>{serverMsg}</div>
            </div>
          )}
          {error && (
            <div className="text-normal text-[#701111] bg-[#ffcfcf] mb-4 flex items-center justify-center gap-x-2 w-full lg:w-3/4 text-center py-4 px-4 font-medium text-[14px]">
              <div>
                <X size={16} />
              </div>
              <div>{error}</div>
            </div>
          )}

          <div className="w-full">
            {options.map((option, index) => {
              const isLastUsed = lastUsedLogin === option.key

              return (
                <div key={index}>
                  <div className="flex  w-full  items-center gap-5">
                    <div className="lg:w-3/4 w-full mb-1  ">
                      <LoginButton
                        text={option.text}
                        imgUrl={option.imgUrl}
                        onClick={option.onClick}
                      />
                    </div>
                    <div className="hidden sm:flex items-center lg:w-1/4 w-full ">
                      {isLastUsed && (
                        <div className="hidden sm:block text-[12px] lg:text-[13px] font-semibold text-[#246EFF] whitespace-nowrap">
                          Last Used
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-2 my-6 lg:w-3/4">
            <hr className="flex-grow border-t border-gray-200" />
            <span className="text-sm text-[#BABABA] font-medium">or</span>
            <hr className="flex-grow border-t border-gray-200" />
          </div>

          <div className="lg:w-3/4 w-full">
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor="email"
                className="block font-medium mb-2 mt-1  text-[13px] lg:text-[15px] "
              >
                Email <span className="text-red-500">*</span>
              </Label>
              <div>
                {isLastUsed && (
                  <div className="hidden sm:block text-[12px] lg:text-[13px] font-semibold text-[#246EFF] whitespace-nowrap">
                    Last Used
                  </div>
                )}
              </div>
            </div>
            <form onSubmit={onFormSubmit} className="w-full">
              <FormElement
                type="text"
                inputType="input"
                placeholder="Enter your email"
                register={register}
                errors={errors}
                name="email"
              />
              <Button
                disabled={isPending}
                className="rounded-none my-2 text-[15px] h-12 bg-[#246EFF] hover:bg-[#1156DD] px-4 w-full "
                onClick={() => {
                  localStorage.setItem('lastUsedLogin', 'email')
                }}
              >
                {isPending ? <Spinner /> : 'Send verification link'}
              </Button>
            </form>
          </div>

          <div className="mt-8 text-center sm:w-3/4 w-full">
            <h1 className="text-[15px] font-semibold text-[#3C3C3C]">
              New here?{' '}
              <Link
                href="/sign-up"
                className="text-[#246EFF] hover:underline hover:text-[#1156DD] transition-colors"
              >
                Create a Lynk account
              </Link>
            </h1>
          </div>
        </div>
      </div>

      <div className="w-full sm:w-1/2 hidden sm:block bg-gradient-to-b px-5 py-2 from-white to-[#7EC9FF]/50">
        <div className="flex flex-col items-center justify-center h-full w-[400px] mx-auto">
          <LinkSkeleton />
          <LinkSkeleton />
          <LinkSkeleton />
        </div>
      </div>
    </div>
  )
}

export default SignInPage
