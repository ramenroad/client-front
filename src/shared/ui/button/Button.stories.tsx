import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from './Button'

const meta = {
  title: 'shared/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: '버튼',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'gray', 'gray-outline'],
    },
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: {
    variant: 'primary',
    className: 'w-240',
  },
}

export const Variants: Story = {
  render: () => (
    <div className="flex w-240 flex-col gap-12">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="gray">Gray</Button>
      <Button variant="gray-outline">Gray Outline</Button>
      <Button disabled>Disabled</Button>
    </div>
  ),
}
