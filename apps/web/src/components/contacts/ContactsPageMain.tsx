import type { ReactNode } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { ContactLeadForm } from "@/components/ContactLeadForm";
import { Typo } from "@/components/Typo";
import { CONTACTS_PAGE } from "@/content/pages";
import { FORM } from "@/content/ui";
import { CONTACT_CHANNEL_BRAND_ICONS } from "@/lib/brand-icons";
import { typo } from "@/lib/typography";
import { getSiteSettings, settingValue } from "@/lib/server-api";

type ChannelKey = keyof typeof CONTACT_CHANNEL_BRAND_ICONS;

type Channel = {
  key: ChannelKey;
  title: string;
  body: ReactNode;
  href?: string;
};

export async function ContactsPageMain({
  productId,
  defaultInterest,
  defaultCity,
}: {
  productId?: string;
  defaultInterest?: string;
  defaultCity?: string;
} = {}) {
  const settings = await getSiteSettings();
  const phone = settingValue(settings, "contact_phone", "+7 (919) 105-38-53");
  const email = settingValue(settings, "contact_email", "avanttec@yandex.ru");
  const address = settingValue(
    settings,
    "contact_address",
    "125424, г. Москва, Волоколамское шоссе д. 73, офис 518",
  );
  const hours = settingValue(settings, "contact_hours", "Пн–Пт: 9:00–18:00");
  const tel = phone.replace(/[^\d+]/g, "");

  const channels: Channel[] = [
    {
      key: "phone",
      title: CONTACTS_PAGE.phoneTitle,
      href: `tel:${tel}`,
      body: (
        <>
          <span className="contacts-channel__primary">{phone}</span>
          <span className="contacts-channel__hint">
            <Typo>{CONTACTS_PAGE.phoneHint}</Typo>
          </span>
        </>
      ),
    },
    {
      key: "mail",
      title: FORM.email,
      href: `mailto:${email}`,
      body: <span className="contacts-channel__primary">{email}</span>,
    },
    {
      key: "schedule",
      title: CONTACTS_PAGE.scheduleTitle,
      body: <span className="contacts-channel__primary">{typo(hours)}</span>,
    },
    {
      key: "office",
      title: CONTACTS_PAGE.officeTitle,
      body: <span className="contacts-channel__primary">{typo(address)}</span>,
    },
  ];

  return (
    <section className="section section--contacts">
      <div className="container">
        <div className="contacts-page">
          <div className="contacts-page__main">
            <p className="contacts-page__intro">
              <Typo>{CONTACTS_PAGE.intro}</Typo>
            </p>
            <ul className="contacts-channels">
              {channels.map((channel) => (
                <li key={channel.key}>
                  <article className="contacts-channel">
                    <div className="contacts-channel__icon" aria-hidden>
                      <BrandIcon name={CONTACT_CHANNEL_BRAND_ICONS[channel.key]} size={40} />
                    </div>
                    <div className="contacts-channel__body">
                      <h3 className="contacts-channel__title">
                        <Typo>{channel.title}</Typo>
                      </h3>
                      {channel.href ? (
                        <a href={channel.href} className="contacts-channel__link">
                          {channel.body}
                        </a>
                      ) : (
                        <div className="contacts-channel__text">{channel.body}</div>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>

            <p className="contacts-page__about-link">
              <Link href="/about" className="link-more">
                <Typo>{CONTACTS_PAGE.aboutLink}</Typo>
              </Link>
            </p>
          </div>

          <aside className="contacts-page__aside">
            <ContactLeadForm
              productId={productId}
              defaultInterest={defaultInterest}
              defaultCity={defaultCity}
              submitLabel={productId ? CONTACTS_PAGE.checkAvailability : FORM.submit}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}
