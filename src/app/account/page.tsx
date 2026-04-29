import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReorderButton } from "@/components/account/ReorderButton";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/sections/PageIntro";
import { authOptions } from "@/lib/auth-options";
import { isAuthOAuthConfigured } from "@/lib/env";
import { formatRub } from "@/lib/format";
import { fetchAccountDashboard } from "@/lib/graphql-account";
import { applyRussianNbsp } from "@/lib/ru-typography";

export const metadata: Metadata = {
  title: "Личный кабинет",
};
export const dynamic = "force-dynamic";

function formatOrderDate(value: string): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "—";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

const STATUS_LABELS: Record<string, string> = {
  processing: "В обработке",
  completed: "Завершен",
  on_hold: "Ожидает оплаты",
  pending: "Ожидает оплаты",
  cancelled: "Отменен",
  refunded: "Возврат",
  failed: "Ошибка",
};

export default async function AccountPage() {
  if (!isAuthOAuthConfigured()) {
    redirect("/");
  }
  const session = await getServerSession(authOptions);
  if (!session?.user?.email && !session?.accessToken) {
    redirect(`/api/auth/signin?callbackUrl=${encodeURIComponent("/account")}`);
  }

  const { profile, orders } = await fetchAccountDashboard(session);

  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Личный кабинет" current="Кабинет" />

      <Card className="mt-8 p-6">
        <h2 className="font-heading text-2xl text-brand-primary">Профиль</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-brand-muted">Имя</dt>
            <dd className="font-medium text-brand-text">{profile.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-brand-muted">Email</dt>
            <dd className="font-medium text-brand-text">{profile.email || "—"}</dd>
          </div>
        </dl>
      </Card>

      <Card className="mt-8 p-6">
        <h2 className="font-heading text-2xl text-brand-primary">История заказов</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-brand-muted">
            {applyRussianNbsp("Пока заказов нет. Когда вы оформите покупку, она появится здесь.")}
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {orders.map((order) => (
              <li key={order.id} className="rounded-[8px] border border-brand-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-brand-muted">Заказ №{order.number}</p>
                    <p className="text-sm font-medium text-brand-text">
                      {STATUS_LABELS[order.status] ?? order.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-brand-muted">{formatOrderDate(order.date)}</p>
                    <p className="text-sm font-semibold text-brand-primary">
                      {formatRub(order.total)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-brand-muted">
                    Позиций: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                  <ReorderButton items={order.items} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </Section>
  );
}
