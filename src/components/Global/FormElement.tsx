'use client'

import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ErrorMessage } from '@hookform/error-message'

type Props = {
  type?: 'text' | 'email' | 'password' | 'number'
  inputType: 'select' | 'input' | 'textarea'
  options?: { value: string; label: string; id: string }[]
  label?: string
  placeholder?: string
  name: string
  lines?: number
  value?: string
  register: UseFormRegister<FieldValues>
  errors: FieldErrors<FieldValues>
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  readOnly?: boolean
}

const FormElement: React.FC<Props> = ({
  type = 'text',
  inputType,
  label,
  placeholder,
  name,
  register,
  value,
  errors,
  className = '',
  onChange,
  readOnly = false,
}) => {
  if (inputType === 'input') {
    return (
      <div>
        {label && (
          <Label
            htmlFor={`input-${name}`}
            className="block font-medium mb-2 mt-1 text-base"
          >
            {label} <span className="text-red-500">*</span>
          </Label>
        )}
        <Input
          id={`input-${name}`}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={` lg:text-[15px] text-[14px]    dark:border-gray[#444444]      
                      rounded-none  w-full lg:h-12 h-11 mb-2
                      focus:border-black focus:border-[1.8px] focus:outline-none ${className}`}
        />
        <ErrorMessage
          errors={errors}
          name={name}
          render={({ message }) => (
            <p className="text-red-400 mb-2.5 -mt-1.5 ml-1 font-medium text-[13px]">
              {message === 'Required' ? '' : message}
            </p>
          )}
        />
      </div>
    )
  }

  return null
}

export default FormElement
