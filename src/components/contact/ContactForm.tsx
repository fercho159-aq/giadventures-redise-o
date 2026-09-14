"use client";

import { useState, useRef, type FormEvent } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface FormErrors {
  nombre?: string;
  email?: string;
  mensaje?: string;
}

export default function ContactForm() {
  const t = useTranslations("contactPage");
  const formRef = useRef<HTMLDivElement>(null);
  const inView = useInView(formRef, { once: true, margin: "-60px" });
  const shouldReduceMotion = useReducedMotion();

  const [status, setStatus] = useState<FormStatus>("idle");
  const [errors, setErrors] = useState<FormErrors>({});

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoConsulta, setTipoConsulta] = useState("");
  const [mensaje, setMensaje] = useState("");

  function validate(): FormErrors {
    const newErrors: FormErrors = {};
    if (!nombre.trim()) newErrors.nombre = t("required");
    if (!email.trim()) {
      newErrors.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = t("invalidEmail");
    }
    if (!mensaje.trim()) newErrors.mensaje = t("required");
    return newErrors;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          tipoConsulta,
          mensaje: mensaje.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setStatus("success");
      setNombre("");
      setEmail("");
      setTelefono("");
      setTipoConsulta("");
      setMensaje("");
      setErrors({});
    } catch {
      setStatus("error");
    }
  }

  const inputClasses =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-500/20";
  const errorInputClasses =
    "border-red-300 focus:border-red-500 focus:ring-red-500/20";

  const duration = shouldReduceMotion ? 0 : 0.5;

  if (status === "success") {
    return (
      <motion.div
        ref={formRef}
        className="flex flex-col items-center justify-center rounded-2xl border border-forest-200 bg-forest-50 p-8 text-center md:p-12"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration }}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-forest-100">
          <CheckCircle className="h-8 w-8 text-forest-600" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-heading font-bold text-forest-900">
          {t("successTitle")}
        </h3>
        <p className="mt-2 text-sm text-forest-700">{t("successMessage")}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg bg-forest-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-forest-700"
        >
          {t("send")}
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration, delay: shouldReduceMotion ? 0 : 0.1 }}
    >
      <h2 className="text-2xl font-heading font-bold text-slate-900">
        {t("formTitle")}
      </h2>

      {status === "error" && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <p className="text-sm font-semibold text-red-800">{t("errorTitle")}</p>
            <p className="mt-0.5 text-sm text-red-600">{t("errorMessage")}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
        {/* Nombre */}
        <div>
          <label htmlFor="contact-nombre" className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("nameLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder={t("namePlaceholder")}
            className={cn(inputClasses, errors.nombre && errorInputClasses)}
          />
          {errors.nombre && (
            <p className="mt-1 text-xs text-red-500">{errors.nombre}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("emailLabel")} <span className="text-red-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            className={cn(inputClasses, errors.email && errorInputClasses)}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Telefono */}
        <div>
          <label htmlFor="contact-telefono" className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("phoneLabel")}
          </label>
          <input
            id="contact-telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder={t("phonePlaceholder")}
            className={inputClasses}
          />
        </div>

        {/* Tipo de consulta */}
        <div>
          <label htmlFor="contact-tipo" className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("inquiryLabel")}
          </label>
          <select
            id="contact-tipo"
            value={tipoConsulta}
            onChange={(e) => setTipoConsulta(e.target.value)}
            className={cn(inputClasses, !tipoConsulta && "text-slate-400")}
          >
            <option value="">{t("inquiryPlaceholder")}</option>
            <option value="general">{t("inquiryGeneral")}</option>
            <option value="expedicion">{t("inquiryExpedition")}</option>
            <option value="personalizado">{t("inquiryCustom")}</option>
            <option value="grupo">{t("inquiryGroup")}</option>
          </select>
        </div>

        {/* Mensaje */}
        <div>
          <label htmlFor="contact-mensaje" className="mb-1.5 block text-sm font-medium text-slate-700">
            {t("messageLabel")} <span className="text-red-500">*</span>
          </label>
          <textarea
            id="contact-mensaje"
            rows={5}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder={t("messagePlaceholder")}
            className={cn(inputClasses, "resize-none", errors.mensaje && errorInputClasses)}
          />
          {errors.mensaje && (
            <p className="mt-1 text-xs text-red-500">{errors.mensaje}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-summit-500 px-8 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-summit-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-summit-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              {t("sending")}
            </>
          ) : (
            <>
              <Send className="h-5 w-5" aria-hidden="true" />
              {t("send")}
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
