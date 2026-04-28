import type { Meta, StoryObj } from "@storybook/nextjs-vite";

function FoundationsShowcase() {
  return (
    <div className="w-[960px] space-y-8 rounded-[var(--radius-md)] border border-brand-border bg-white p-8">
      <section>
        <h3 className="text-lg font-semibold text-brand-primary">Colors</h3>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            ["Primary", "bg-brand-primary"],
            ["Accent", "bg-brand-accent"],
            ["Surface", "bg-brand-surface"],
            ["Hero", "bg-brand-hero"],
          ].map(([label, cls]) => (
            <div key={label} className="space-y-2">
              <div className={`h-14 rounded-[var(--radius-sm)] ${cls}`} />
              <p className="text-xs text-brand-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 className="text-lg font-semibold text-brand-primary">Typography</h3>
        <h1 className="ds-title mt-3">Display heading</h1>
        <p className="ds-subtitle">Body helper text using subtitle token style.</p>
      </section>
    </div>
  );
}

const meta: Meta<typeof FoundationsShowcase> = {
  title: "Foundations/Tokens",
  component: FoundationsShowcase,
};

export default meta;
type Story = StoryObj<typeof FoundationsShowcase>;

export const Default: Story = {};
