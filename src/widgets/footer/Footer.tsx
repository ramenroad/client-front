import { ramenroadEmail } from '@/shared/config'
import { IconInstagram } from '@/shared/ui/icon'
import { Line } from '@/shared/ui/line'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'

const SERVICE_TERMS_URL = 'https://kim-junseo.notion.site/21649b91c9c580318d75e7941d6def9c'
const PRIVACY_POLICY_URL = 'https://kim-junseo.notion.site/21849b91c9c580d18097dfe035e990c2?source=copy_link'
const LOCATION_POLICY_URL =
  'https://kim-junseo.notion.site/2025-08-9-24949b91c9c580b48549e8dc5195cdff?source=copy_link'
const INSTAGRAM_URL = 'https://www.instagram.com/ra.ising/'

export const Footer = () => {
  return (
    <Wrapper>
      <Contact>
        <FooterTitle size={14} weight="sb">
          팀 라이징
        </FooterTitle>
        <ContactWrapper>
          <ContactLabel>제휴 및 협업 문의</ContactLabel>
          <Email href={`mailto:${ramenroadEmail}`}>{ramenroadEmail}</Email>
        </ContactWrapper>
      </Contact>

      <TermsAndConditions>
        <Terms>
          <Link href={SERVICE_TERMS_URL} target="_blank" rel="noopener noreferrer">
            서비스 이용 약관
          </Link>
          <Divider vertical />
          <StrongLink href={PRIVACY_POLICY_URL} target="_blank" rel="noopener noreferrer">
            개인정보 처리방침
          </StrongLink>
          <Divider vertical />
          <Link href={LOCATION_POLICY_URL} target="_blank" rel="noopener noreferrer">
            위치 정보 이용약관
          </Link>
        </Terms>
        <RaisingText size={12} weight="r">
          Copyright © 2025 라이징 All rights reserved.
        </RaisingText>
      </TermsAndConditions>

      <InstagramLink href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="라이징 인스타그램">
        <InstagramIcon footer />
      </InstagramLink>
    </Wrapper>
  )
}

const Wrapper = render.div('w-full h-212 p-20 box-border bg-footer text-gray-500 font-14-r flex flex-col gap-24')

const FooterTitle = render.extend(RaisingText, 'leading-27')

const Contact = render.div('flex flex-col gap-4')

const ContactLabel = render.span('text-inherit')

const Email = render.a('font-14-m text-gray-500 no-underline')

const ContactWrapper = render.div('flex gap-8')

const Terms = render.div('flex gap-4 items-center')

const TermsAndConditions = render.div('flex flex-col gap-4')

const Link = render.a('font-12-r cursor-pointer text-gray-500 no-underline')

const StrongLink = render.a('font-12-sb cursor-pointer text-gray-500 no-underline')

const InstagramLink = render.a('w-fit')

const InstagramIcon = render.extend(IconInstagram, 'min-h-40 min-w-40 mt-[-8px]')

const Divider = render.extend(Line, 'h-10')
