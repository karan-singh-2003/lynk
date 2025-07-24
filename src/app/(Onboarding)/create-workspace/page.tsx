'use client'

import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import useCreateWorkspace from '@/hooks/useCreateWorkspace'
import FormElement from '@/components/Global/FormElement'
import Spinner from '@/components/Global/Spinner'

const CreateWorkspacePage = () => {
  const [workspaceName, setWorkspaceName] = useState('')
  const generatedSlug = workspaceName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/[^\w\-]/g, '') // remove special characters

  const { register, onFormSubmit, errors, setValue, isPending } =
    useCreateWorkspace()

  useEffect(() => {
    register('workspaceslug')
  }, [register])

  useEffect(() => {
    setValue('workspaceslug', generatedSlug)
  }, [generatedSlug, setValue])

  return (
    <div className="mt-4">
      <h1 className="font-bold text-[15px] mb-3 text-[#333333]">
        Workspace setup
      </h1>
      <h1 className="text-[#333333] font-semibold text-[20px]">
        Let’s set up your workspace
      </h1>
      <h1 className="font-medium text-[14px] text-[#727272]">
        Pick a name that’s short and easy to recognize. You can always change
        this later.
      </h1>

      <form className="mt-4" onSubmit={onFormSubmit}>
        {/* Workspace Name */}
        <div>
          <Label
            htmlFor="workspacename"
            className="block font-medium mb-2 mt-1 text-[13px] lg:text-[15px]"
          >
            Workspace Name <span className="text-red-500">*</span>
          </Label>
          <FormElement
            type="text"
            inputType="input"
            placeholder="Enter your workspace name"
            register={register}
            errors={errors}
            name="workspacename"
            value={workspaceName}
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>

        {/* Workspace Slug */}
        <div className="mt-3">
          <Label
            htmlFor="workspaceslug"
            className="block font-medium mb-2 mt-2 text-[13px] lg:text-[15px]"
          >
            Workspace Slug <span className="text-red-500">*</span>
          </Label>
          <FormElement
            type="text"
            inputType="input"
            register={register}
            errors={errors}
            name="workspaceslug"
            value={generatedSlug}
            readOnly
          />
          <div className="text-sm text-gray-500 mt-1 mb-2">
            Your workspace URL will be:{' '}
            <span className="font-medium">lynk.com/{generatedSlug}</span>
          </div>
        </div>

        <Button className="rounded-none my-4 text-[13px] bg-[#246EFF]  px-4">
          {isPending ? <Spinner /> : 'Create Workspace'}
        </Button>
      </form>
    </div>
  )
}

export default CreateWorkspacePage
