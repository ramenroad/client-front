import type { ChangeEvent, ComponentPropsWithoutRef, KeyboardEvent, RefObject } from 'react'
import { IconBack, IconDeleteSearchValue, IconSearch } from '@/shared/ui/icon'
import render from '@/shared/ui/render'

interface SearchOverlayInputBarProps extends Omit<ComponentPropsWithoutRef<'input'>, 'onChange' | 'onFocus' | 'onKeyDown'> {
  inputRef: RefObject<HTMLInputElement | null>
  keyword: string
  showBackIcon: boolean
  showSearchIcon: boolean
  isHidden?: boolean
  onClose: () => void
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onFocus: () => void
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void
  onClear: () => void
}

export const SearchOverlayInputBar = ({
  inputRef,
  keyword,
  showBackIcon,
  showSearchIcon,
  isHidden = false,
  onClose,
  onChange,
  onFocus,
  onKeyDown,
  onClear,
  ...rest
}: SearchOverlayInputBarProps) => {
  return (
    <SearchOverlayContainer data-hidden={isHidden}>
      {showBackIcon && <FocusResetIcon onClick={onClose} />}
      <SearchBox>
        {showSearchIcon && (
          <IconWrapper>
            <IconSearch />
          </IconWrapper>
        )}
        <SearchInput
          ref={inputRef}
          {...rest}
          type="text"
          value={keyword}
          onChange={onChange}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
        />
        <SearchDeleteIconWrapper onClick={onClear}>
          {keyword.trim() !== '' && <IconDeleteSearchValue />}
        </SearchDeleteIconWrapper>
      </SearchBox>
    </SearchOverlayContainer>
  )
}

const SearchOverlayContainer = render.figure(
  'absolute top-[var(--map-search-top)] left-0 right-0 z-[200] m-0 px-20 h-48 box-border flex gap-12 items-center transition-[transform,opacity] duration-300 ease-out data-[hidden=true]:pointer-events-none data-[hidden=true]:-translate-y-[200%] data-[hidden=true]:opacity-0',
)

const SearchBox = render.div(
  'flex items-center gap-8 w-full h-full rounded-8 box-border border border-solid border-divider bg-white px-16 py-12',
)

const IconWrapper = render.div('w-24 h-24')

const FocusResetIcon = render.extend(IconBack, 'cursor-pointer')

const SearchInput = render.input(
  'w-full h-24 bg-white border-none font-16-r text-black leading-24 placeholder:text-gray-200 focus:outline-none align-middle',
)

const SearchDeleteIconWrapper = render.div('cursor-pointer flex h-full items-center')
