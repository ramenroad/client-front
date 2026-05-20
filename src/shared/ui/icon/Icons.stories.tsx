import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  IconAdd,
  IconArrowRight,
  IconBack,
  IconCamera,
  IconCheckbox,
  IconClose,
  IconComment,
  IconDropDown,
  IconFilterWithOrder,
  IconGPS,
  IconHome,
  IconImageDelete,
  IconInstagram,
  IconLocate,
  IconMap,
  IconMapAppBar,
  IconMenuBoard,
  IconMore,
  IconPinned,
  IconRefresh,
  IconReview,
  IconSearch,
  IconShare,
  IconStar,
  IconTag,
  IconTime,
  IconTooltip,
  IconUser,
} from './Icons'

const iconSamples = [
  { name: 'Back', node: <IconBack /> },
  { name: 'Close', node: <IconClose /> },
  { name: 'Add', node: <IconAdd /> },
  { name: 'ArrowRight', node: <IconArrowRight /> },
  { name: 'DropDown', node: <IconDropDown /> },
  { name: 'Search', node: <IconSearch /> },
  { name: 'GPS', node: <IconGPS /> },
  { name: 'Locate', node: <IconLocate /> },
  { name: 'Time', node: <IconTime /> },
  { name: 'Tag', node: <IconTag /> },
  { name: 'Camera', node: <IconCamera /> },
  { name: 'ImageDelete', node: <IconImageDelete /> },
  { name: 'Comment', node: <IconComment /> },
  { name: 'Review', node: <IconReview /> },
  { name: 'Share', node: <IconShare /> },
  { name: 'More', node: <IconMore /> },
  { name: 'Pinned', node: <IconPinned /> },
  { name: 'Refresh', node: <IconRefresh /> },
  { name: 'Star', node: <IconStar /> },
  { name: 'Home', node: <IconHome selected /> },
  { name: 'User', node: <IconUser selected /> },
  { name: 'MapAppBar', node: <IconMapAppBar selected /> },
  { name: 'Map', node: <IconMap type="kakao" /> },
  { name: 'Checkbox', node: <IconCheckbox checked /> },
  { name: 'Tooltip', node: <IconTooltip /> },
  { name: 'Instagram', node: <IconInstagram /> },
  { name: 'FilterWithOrder', node: <IconFilterWithOrder /> },
  { name: 'MenuBoard', node: <IconMenuBoard /> },
]

const meta = {
  title: 'shared/Icons',
  parameters: {
    layout: 'centered',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Gallery: Story = {
  render: () => (
    <div className="grid w-720 grid-cols-4 gap-16 rounded-16 bg-white p-20 shadow-lg">
      {iconSamples.map((icon) => (
        <div key={icon.name} className="flex flex-col items-center gap-8 rounded-8 border border-border p-12 text-center">
          <div className="flex h-36 items-center justify-center">{icon.node}</div>
          <span className="font-12-r text-gray-600">{icon.name}</span>
        </div>
      ))}
    </div>
  ),
}
