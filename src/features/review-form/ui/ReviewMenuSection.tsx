import { type ChangeEvent, type ComponentProps, type KeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'
import render from '@/shared/ui/render'

interface ReviewMenuSectionProps {
  menuList: string[]
  selectedMenus: string[]
  customMenuInput: string
  hasError?: boolean
  onMenuClick: (menu: string) => void
  onCustomMenuInputChange: (event: ChangeEvent<HTMLInputElement>) => void
  onCustomMenuAdd: () => void
  onCustomMenuKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const ReviewMenuSection = ({
  menuList,
  selectedMenus,
  customMenuInput,
  hasError = false,
  onMenuClick,
  onCustomMenuInputChange,
  onCustomMenuAdd,
  onCustomMenuKeyDown,
}: ReviewMenuSectionProps) => {
  return (
    <>
      <MenuWrapper>
        <MenuTitleBox>
          <MenuTitle>어떤 메뉴를 드셨나요?</MenuTitle>
          <MenuSubTitle>최대 2개 선택 가능</MenuSubTitle>
        </MenuTitleBox>
        {menuList.length > 0 && (
          <MenuTabContainer>
            {menuList.map((menu, index) => (
              <MenuTab key={`${menu}-${index}`} selected={selectedMenus.includes(menu)} onClick={() => onMenuClick(menu)}>
                {menu}
              </MenuTab>
            ))}
          </MenuTabContainer>
        )}
        {hasError && <ErrorMessage>메뉴를 선택해주세요</ErrorMessage>}
      </MenuWrapper>

      <MenuAddWrapper>
        <MenuInputContainer>
          <MenuInput
            value={customMenuInput}
            onChange={onCustomMenuInputChange}
            onKeyDown={onCustomMenuKeyDown}
            placeholder="메뉴명을 입력해주세요"
          />
          <MenuAddButton type="button" onClick={onCustomMenuAdd}>
            추가
          </MenuAddButton>
        </MenuInputContainer>
      </MenuAddWrapper>
    </>
  )
}

const MenuWrapper = render.div('mt-32 flex flex-col gap-16')

const MenuTitleBox = render.div('flex items-center gap-4')

const MenuTitle = render.div('font-16-m text-black')

const MenuSubTitle = render.div('font-12-r text-gray-400')

const MenuTabContainer = render.div('flex flex-wrap gap-8')

interface MenuTabProps extends ComponentProps<'button'> {
  selected: boolean
}

const MenuTabButton = render.button()

const MenuTab = ({ selected, className, ...props }: MenuTabProps) => {
  return (
    <MenuTabButton
      {...props}
      type="button"
      className={twMerge(
        'font-14-r flex h-29 w-fit cursor-pointer items-center rounded-[50px] border-none px-12 py-6 shadow-none outline-none',
        selected ? 'bg-light-orange text-orange' : 'bg-filter-background text-gray-400',
        className ?? '',
      )}
    />
  )
}

const MenuAddWrapper = render.div('mt-16 flex flex-col gap-12')

const MenuInputContainer = render.div('flex items-center gap-4')

const MenuInput = render.input(
  'font-16-r box-border h-44 flex-1 rounded-[8px] border border-solid border-transparent bg-border px-12 py-10 text-black outline-none focus:border-orange',
)

const MenuAddButton = render.button(
  'h-43 w-67 cursor-pointer rounded-[8px] border border-solid border-gray-100 bg-white px-10 py-8 text-black shadow-none outline-none',
)

const ErrorMessage = render.div('mt-4 font-12-r text-red')
