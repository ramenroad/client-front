import { useState, type ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Toggle } from './Toggle'

const ToggleDemo = (args: ComponentProps<typeof Toggle>) => {
  const [checked, setChecked] = useState(args.checked)

  return <Toggle {...args} checked={checked} onChange={setChecked} />
}

const meta = {
  title: 'shared/Toggle',
  component: Toggle,
  parameters: {
    layout: 'centered',
  },
  args: {
    checked: true,
    onChange: () => undefined,
    onText: 'ON',
    offText: 'OFF',
  },
} satisfies Meta<typeof Toggle>

export default meta

type Story = StoryObj<typeof meta>

export const Playground: Story = {
  render: (args) => <ToggleDemo {...args} />,
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}
