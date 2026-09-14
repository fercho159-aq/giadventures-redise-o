import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import ContactInfo from "@/components/contact/ContactInfo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contactPage" });
  return {
    title: t("heroTitle"),
    description: t("heroSubtitle"),
  };
}

export default async function ContactoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contactPage" });

  return (
    <main className="pt-20 lg:pt-24">
      {/* Hero section */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <Image
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920&q=80"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-slate-900/75" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-heading font-bold text-white sm:text-4xl md:text-5xl">
            {t("heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300 md:text-lg">
            {t("heroSubtitle")}
          </p>
        </div>
      </section>

      {/* Two-column layout */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
            {/* Form — 2/3 width */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Sidebar — 1/3 width */}
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
