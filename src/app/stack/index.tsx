import { basicUIPlugin } from '@stackflow/plugin-basic-ui'
import { historySyncPlugin } from '@stackflow/plugin-history-sync'
import { basicRendererPlugin } from '@stackflow/plugin-renderer-basic'
import { stackflow } from '@stackflow/react'
import '@stackflow/plugin-basic-ui/index.css'
import { readAppEnv } from '@/shared/app-env'
import { initializeNavigator } from '@/shared/navigation'
import { activityComponents } from './activities'
import { bridgePlugin } from './bridgePlugin'
import { stackConfig } from './config'

const { Stack, actions, stepActions } = stackflow({
  config: stackConfig,
  components: activityComponents,
  plugins: [
    // 스택을 실제로 그리는 렌더러. basicUIPlugin은 테마/화면 크롬만 얹으므로 이게 없으면 아무것도 렌더되지 않는다.
    basicRendererPlugin(),
    basicUIPlugin({
      // 전환/제스처는 플랫폼 관례를 따른다. iOS는 네이티브 스와이프 백 제스처를 끄고(앱 설정)
      // 여기 cupertino 테마가 제공하는 엣지 스와이프를 쓴다 — 웹이 뒤로가기를 온전히 소유한다.
      theme: readAppEnv().platform === 'android' ? 'android' : 'cupertino',
      backgroundColor: 'var(--color-surface)',
    }),
    // URL ↔ 액티비티 동기화. push마다 히스토리가 쌓이므로 딥링크·공유 링크·브라우저 뒤로가기가 그대로 산다.
    historySyncPlugin({ config: stackConfig, fallbackActivity: () => 'Home' }),
    bridgePlugin(),
  ],
})

// 화면 코드와 브리지 리스너가 같은 네비게이션 구현을 쓰도록 액션을 주입한다(initializeHttpAuth와 동일 패턴).
initializeNavigator({ actions, stepActions })

export { Stack }
