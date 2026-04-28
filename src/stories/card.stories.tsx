import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "@/components/ui/Card";

function CardDemo() {
  return (
    <Card className="w-[320px] p-5">
      <p className="text-xs uppercase tracking-[0.08em] text-brand-accent">Кейс</p>
      <h3 className="mt-2 text-lg font-semibold text-brand-primary">Сервисное сопровождение</h3>
      <p className="mt-3 text-sm text-brand-muted">
        Регулярный контроль качества воды, технические осмотры и профилактика.
      </p>
    </Card>
  );
}

const meta: Meta<typeof CardDemo> = {
  title: "Primitives/Card",
  component: CardDemo,
};

export default meta;
type Story = StoryObj<typeof CardDemo>;

export const Default: Story = {};
