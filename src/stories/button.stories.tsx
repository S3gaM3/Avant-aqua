import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "@/components/ui/Button";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  args: { children: "Кнопка" },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: "primary", size: "md" },
};

export const Secondary: Story = {
  args: { variant: "secondary", size: "md" },
};

export const Ghost: Story = {
  args: { variant: "ghost", size: "md" },
};

export const Inverse: Story = {
  args: { variant: "inverse", size: "md" },
  parameters: { backgrounds: { default: "hero" } },
};
