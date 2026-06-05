import { type ComponentProps, type ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import render from '@/shared/ui/render'

export type SocialLoginProvider = 'kakao' | 'naver' | 'google'

interface SocialLoginButtonProps extends ComponentProps<'button'> {
  icon: ReactNode
  provider: SocialLoginProvider
}

const providerClassNameMap: Record<SocialLoginProvider, string> = {
  kakao: 'bg-kakao text-[rgba(17,17,17,0.85)]',
  naver: 'bg-naver text-white',
  google: 'border border-solid border-gray-200 bg-white text-black',
}

export const SocialLoginButton = ({ className, icon, provider, children, ...props }: SocialLoginButtonProps) => {
  return (
    <ButtonRoot
      {...props}
      className={twMerge(
        'font-18-m flex h-46 w-310 cursor-pointer items-center justify-center gap-8 rounded-full border-none shadow-none outline-none disabled:cursor-not-allowed disabled:opacity-60',
        providerClassNameMap[provider],
        className ?? '',
      )}
    >
      <IconSlot>{icon}</IconSlot>
      <Label>{children}</Label>
    </ButtonRoot>
  )
}

const ButtonRoot = render.button()

const IconSlot = render.span('flex items-center justify-center')

const Label = render.span('leading-27')
