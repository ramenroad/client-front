import { type ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Button } from '@/shared/ui/button'
import { PageLayout } from '@/shared/ui/page-layout'
import render from '@/shared/ui/render'
import { RaisingText } from '@/shared/ui/text'
import TopBar from '@/shared/ui/top-bar'
import { useRegisterNicknamePage } from '../model/useRegisterNicknamePage'

const RegisterNicknamePage = () => {
  const {
    currentNickname,
    nickname,
    placeholder,
    isNicknameAlreadyExists,
    isSubmitDisabled,
    isPending,
    handleNicknameChange,
    handleSubmit,
  } = useRegisterNicknamePage()
  const isUpdateMode = Boolean(currentNickname)

  return (
    <Layout variant="footerOnly">
      <TopBar title="" navigate={isUpdateMode ? '/mypage' : undefined} />
      <Wrapper>
        <DescriptionWrapper>
          {!isUpdateMode ? (
            <DescriptionText>
              <DescriptionLine>앞으로 사용하실</DescriptionLine>
              <DescriptionHighlightLine>
                <HighlightText>닉네임</HighlightText>을 설정해주세요
              </DescriptionHighlightLine>
            </DescriptionText>
          ) : (
            <UpdateNicknameText>새로운 닉네임을 입력해주세요</UpdateNicknameText>
          )}
        </DescriptionWrapper>

        <InputWrapper>
          <NicknameInput
            placeholder={placeholder}
            value={nickname}
            onChange={handleNicknameChange}
            minLength={2}
            maxLength={10}
            isError={isNicknameAlreadyExists}
          />
          {isNicknameAlreadyExists && (
            <ErrorMessage size={12} weight="m">
              이미 존재하는 닉네임입니다.
            </ErrorMessage>
          )}
        </InputWrapper>

        <SubmitButton disabled={isSubmitDisabled} onClick={handleSubmit}>
          {isPending ? '저장 중' : isUpdateMode ? '변경 완료' : '완료'}
        </SubmitButton>
      </Wrapper>
    </Layout>
  )
}

const Layout = render.extend(PageLayout)

const Wrapper = render.div('box-border flex min-h-0 w-full flex-1 flex-col px-20')

const DescriptionWrapper = render.div('font-20-m mb-20 mt-20 flex w-full flex-col')

const DescriptionText = render.div('flex flex-col text-inherit')

const DescriptionLine = render.span('text-inherit')

const DescriptionHighlightLine = render.div('text-inherit')

const HighlightText = render.span('text-orange')

const UpdateNicknameText = render.span('font-16-m')

const InputWrapper = render.div('mb-[394px] h-44 md:mb-40')

interface NicknameInputProps extends ComponentProps<'input'> {
  isError?: boolean
}

const InputField = render.input()

const NicknameInput = ({ isError = false, className, ...props }: NicknameInputProps) => {
  return (
    <InputField
      {...props}
      className={twMerge(
        'font-16-m box-border w-full rounded-8 bg-border px-20 py-10 text-black outline-none placeholder:text-gray-200',
        isError ? 'border-2 border-red' : 'border-none',
        className ?? '',
      )}
    />
  )
}

const ErrorMessage = render.extend(RaisingText, 'mt-4 text-red')

const SubmitButton = render.extend(Button, 'mt-auto mb-20')

export default RegisterNicknamePage
