import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Input } from "@/components/ui/Input";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  args: {
    placeholder: "Введите значение",
  },
  render: (args) => (
    <div className="w-[360px]">
      <Input {...args} />
    </div>
  ),
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {};
