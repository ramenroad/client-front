import { BridgeMethods, has, invoke } from '@/shared/bridge'

/**
 * 텍스트를 클립보드에 복사한다. 실패하면 throw하므로 호출부가 토스트로 알린다.
 *
 * 앱(WebView)은 비보안 컨텍스트라 navigator.clipboard가 거부된다 → 네이티브 clipboard.write(§2.8.3)를
 * 먼저 쓰고, 순수 웹·구버전 앱(해당 method 미지원)에서만 브라우저 API로 폴백한다.
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  if (has(BridgeMethods.clipboardWrite)) {
    await invoke(BridgeMethods.clipboardWrite, { text })
    return
  }

  await navigator.clipboard.writeText(text)
}
