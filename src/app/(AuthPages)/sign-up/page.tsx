'use client'

import React from 'react'
import LoginButton from '@/components/AuthPage/LoginButton'
import LinkSkeleton from '@/components/AuthPage/LinkSkeleton'

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { useUser } from '@/hooks/useUser'
import FormElement from '@/components/Global/FormElement'
import Spinner from '@/components/Global/Spinner'
import { CircleCheck, X } from 'lucide-react'

const SignUpPage = () => {
  const options = [
    {
      text: 'Continue with Google',
      imgUrl: '/google.svg',
      onClick: () => console.log('Google login clicked'),
    },

    {
      text: 'Continue with Microsoft',
      imgUrl: '/microsoft.svg',
      onClick: () => console.log('Microsoft login clicked'),
    },
  ]
  const { register, onFormSubmit, isPending, serverMsg, errors, error } =
    useUser({
      type: 'signup',
    })
  console.log('Server Error in signup page :', serverMsg)

  return (
    <div className="flex h-screen w-full flex-col sm:flex-row">
      <div className="w-full sm:w-1/2 flex flex-col justify-center px-6 gap-4">
        <div className="flex flex-col w-[330px]  lg:w-[460px] mx-auto mt-10 lg:mt-0 md:mt-0">
          <h1
            style={{ fontFamily: 'var(--font-poppins)' }}
            className="text-[24px] lg:text-[28px] font-bold"
          >
            <Link href="/">Lynk</Link>
          </h1>
          <div className="font-medium text-[18px] lg:text-[22px] mt-1 mb-6">
            Get started with Lynk
          </div>
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
          {options.map((option, index) => {
            return (
              <div key={index} className="lg:w-3/4 w-full mb-1 ">
                <LoginButton
                  text={option.text}
                  imgUrl={option.imgUrl}
                  onClick={option.onClick}
                />
              </div>
            )
          })}

          <div className="flex items-center gap-2 my-6 w-full lg:w-3/4">
            <hr className="flex-grow border-t border-gray-200" />
            <span className="text-sm text-[#BABABA] font-medium">or</span>
            <hr className="flex-grow border-t border-gray-200" />
          </div>

          <div className="w-full lg:w-3/4">
            <Label
              htmlFor="email"
              className="block font-medium mb-2 mt-1  text-[13px] lg:text-[15px] "
            >
              Email <span className="text-red-500">*</span>
            </Label>
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
              >
                {isPending ? <Spinner /> : 'Send verification link'}
              </Button>
            </form>
          </div>

          <div className="flex items-start gap-3 mt-8 w-full lg:w-3/4">
            <Checkbox id="terms-2" className="mt-0.5" defaultChecked />
            <div className="grid gap-2">
              <Label htmlFor="terms-2" className="text-[14px]">
                Accept terms and conditions
              </Label>
              <p className="text-muted-foreground text-[13px] lg:text-[14px]">
                By clicking this checkbox, you agree to the terms and
                conditions.
              </p>
            </div>
          </div>

          <div className="mt-8 pr-2  text-center  lg:w-3/4 ">
            <h1 className="text-[15px] font-semibold text-[#3C3C3C]">
              Already have an account?{' '}
              <Link
                href="/sign-in"
                className="text-[#246EFF] hover:underline hover:text-[#1156DD] transition-colors"
              >
                Log in to Lynk
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

export default SignUpPage
