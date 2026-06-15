import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'
import render from '@/shared/ui/render'

// 앱/웹 공용: 예약 높이를 CSS 변수로(W3). 웹은 기존 267/212, 앱은 0(AppBar/Footer 미렌더).
const PAGE_LAYOUT_MIN_HEIGHT_CLASS_NAMES = {
  appBar: 'min-h-[calc(100dvh_-_var(--page-offset-appbar))]',
  footerOnly: 'min-h-[calc(100dvh_-_var(--page-offset-footer))]',
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
