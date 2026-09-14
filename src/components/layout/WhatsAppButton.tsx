"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { WHATSAPP_LINK } from "@/lib/constants";

interface WhatsAppButtonProps {
  packageName?: string;
}

export default function WhatsAppButton({ packageName }: WhatsAppButtonProps) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("whatsapp");

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const message = packageName
    ? t("packageMessage", { packageName })
    : t("defaultMessage");

  const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(message)}`;

  if (!visible) return null;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("label")}
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2 md:h-12 md:w-12 animate-fade-in-up animate-wa-pulse"
    >
      <MessageCircle className="h-7 w-7 md:h-6 md:w-6" fill="currentColor" />
    </a>
  );
}
