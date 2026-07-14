import { copyToClipboard } from '@/shared/lib/clipboard'
import render from '@/shared/ui/render'
import { useToast } from '@/shared/ui/toast'

interface RamenyaAddressProps {
  address: string
}

/**
 * 눌러서 클립보드에 복사되는 매장 주소 — 지도 앱이나 메신저에 그대로 붙여넣을 수 있게 한다.
 *
 * 매장 상세 페이지와 지도 하단시트가 같은 주소를 같은 모양으로 보여주므로 복사 동작·문구·글자 스타일을
 * 여기 한 곳에 둔다. 특히 지도 화면은 드래그가 곧 조작이라 select-none이 걸려 있어(길게 눌러 복사가 막힌다)
 * 이 버튼이 유일한 복사 경로다.
 */
export const RamenyaAddress = ({ address }: RamenyaAddressProps) => {
  const { openToast } = useToast()

  const handleCopy = async () => {
    try {
      await copyToClipboard(address)
      openToast('주소를 복사했어요.')
    } catch {
      openToast('주소를 복사하지 못했어요.', undefined, 'error')
    }
  }

  return (
    <CopyButton type="button" onClick={handleCopy} aria-label={`주소 복사: ${address}`}>
      {address}
    </CopyButton>
  )
}

// 옆 항목들과 글자 스타일(font-14-r text-black)은 그대로 두고 버튼 기본 스타일만 걷어낸다.
const CopyButton = render.button(
  'cursor-pointer break-words border-none bg-transparent p-0 text-left font-14-r text-black active:opacity-60',
)
