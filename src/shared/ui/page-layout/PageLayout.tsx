import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'
import render from '@/shared/ui/render'

const PAGE_LAYOUT_MIN_HEIGHT_CLASS_NAMES = {
  appBar: 'min-h-[calc(100dvh_-_267px)]',
  footerOnly: 'min-h-[calc(100dvh_-_212px)]',
  standalone: 'min-h-[100dvh]',
} as const

export type PageLayoutVariant = keyof typeof PAGE_LAYOUT_MIN_HEIGHT_CLASS_NAMES

interface PageLayoutProps extends ComponentPropsWithoutRef<'section'> {
  variant: PageLayoutVariant
}

export const PageLayout = ({ variant, className, ...props }: PageLayoutProps) => {
  return <PageLayoutBase {...props} className={twMerge(PAGE_LAYOUT_MIN_HEIGHT_CLASS_NAMES[variant], className)} />
}

const PageLayoutBase = render.section('box-border flex w-full flex-col bg-background text-primary transition-color')
