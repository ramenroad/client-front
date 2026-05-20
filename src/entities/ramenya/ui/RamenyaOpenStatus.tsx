import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { OpenStatus, type OpenStatus as OpenStatusType } from '../model'
import render from '@/shared/ui/render'

interface RamenyaOpenStatusProps extends ComponentPropsWithoutRef<'span'> {
  status: OpenStatusType
}

const getStatusColorClassName = (status: OpenStatusType) => {
  if (status === OpenStatus.OPEN) {
    return 'text-green'
  }

  if (status === OpenStatus.BREAK) {
    return 'text-yellow'
  }

  if (status === OpenStatus.DAY_OFF) {
    return 'text-red'
  }

  if (status === OpenStatus.CLOSED) {
    return 'text-closed'
  }

  return 'text-gray-700'
}

export const RamenyaOpenStatus = ({ status, className, ...rest }: RamenyaOpenStatusProps) => {
  return (
    <StatusText {...rest} className={twMerge('font-14-r', getStatusColorClassName(status), className)}>
      {status}
    </StatusText>
  )
}

const StatusText = render.span()
