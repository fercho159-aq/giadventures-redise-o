"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";
import Image from "next/image";
import { Plus, Trash2, Upload, X } from "lucide-react";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface ItineraryDay {
  dayNumber: number;
  titleEs: string;
  titleEn: string;
  descriptionEs: string;
  descriptionEn: string;
  elevation: number | null;
}

interface IncludedItem {
  textEs: string;
  textEn: string;
  icon: string;
  isIncluded: boolean;
}

interface PriceTier {
  minPeople: number;
  maxPeople: number;
  pricePerPerson: number;
}

interface ExpeditionDate {
  startDate: string;
  endDate: string;
  spotsTotal: number;
  spotsTaken: number;
  status: string;
}

interface GalleryItem {
  imageUrl: string;
  altText: string;
  captionEs: string;
  captionEn: string;
  sortOrder: number;
}

export interface ExpeditionData {
  id?: string;
  titleEs: string;
  titleEn: string;
  slug: string;
  subtitleEs: string;
  subtitleEn: string;
  excerptEs: string;
  excerptEn: string;
  descriptionEs: string;
  descriptionEn: string;
  category: string;
  difficulty: string;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  durationDays: number;
  durationNights: number;
  altitude: number | null;
  groupSizeMin: number | null;
  groupSizeMax: number | null;
  locationName: string;
  locationLat: number | null;
  locationLng: number | null;
  pricePerPerson: number;
  currency: string;
  requirementsEs: string;
  requirementsEn: string;
  whatToBringEs: string;
  whatToBringEn: string;
  mainImage: string;
  seoTitleEs: string;
  seoTitleEn: string;
  seoDescriptionEs: string;
  seoDescriptionEn: string;
  seoImage: string;
  itinerary: ItineraryDay[];
  includedItems: IncludedItem[];
  priceTiers: PriceTier[];
  dates: ExpeditionDate[];
  gallery: GalleryItem[];
}

interface ExpeditionFormProps {
  expedition?: ExpeditionData;
  isEdit?: boolean;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const TABS = [
  "General",
  "Detalles",
  "Precios",
  "Itinerario",
  "Incluye / No incluye",
  "Imagenes",
  "SEO",
] as const;

const CATEGORIES = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "alto-rendimiento", label: "Alto Rendimiento" },
  { value: "internacional", label: "Internacional" },
];

const DIFFICULTIES = [
  { value: "principiante", label: "Principiante" },
  { value: "intermedio", label: "Intermedio" },
  { value: "avanzado", label: "Avanzado" },
  { value: "alto-rendimiento", label: "Alto Rendimiento" },
];

const DATE_STATUSES = [
  { value: "available", label: "Disponible" },
  { value: "full", label: "Lleno" },
  { value: "guaranteed", label: "Garantizada" },
];

/* ------------------------------------------------------------------ */
/* Defaults                                                            */
/* ------------------------------------------------------------------ */

function getDefaults(exp?: ExpeditionData): ExpeditionData {
  return {
    titleEs: exp?.titleEs ?? "",
    titleEn: exp?.titleEn ?? "",
    slug: exp?.slug ?? "",
    subtitleEs: exp?.subtitleEs ?? "",
    subtitleEn: exp?.subtitleEn ?? "",
    excerptEs: exp?.excerptEs ?? "",
    excerptEn: exp?.excerptEn ?? "",
    descriptionEs: exp?.descriptionEs ?? "",
    descriptionEn: exp?.descriptionEn ?? "",
    category: exp?.category ?? "principiante",
    difficulty: exp?.difficulty ?? "principiante",
    isActive: exp?.isActive ?? true,
    isFeatured: exp?.isFeatured ?? false,
    sortOrder: exp?.sortOrder ?? 0,
    durationDays: exp?.durationDays ?? 1,
    durationNights: exp?.durationNights ?? 0,
    altitude: exp?.altitude ?? null,
    groupSizeMin: exp?.groupSizeMin ?? null,
    groupSizeMax: exp?.groupSizeMax ?? null,
    locationName: exp?.locationName ?? "",
    locationLat: exp?.locationLat ?? null,
    locationLng: exp?.locationLng ?? null,
    pricePerPerson: exp?.pricePerPerson ?? 0,
    currency: exp?.currency ?? "MXN",
    requirementsEs: exp?.requirementsEs ?? "",
    requirementsEn: exp?.requirementsEn ?? "",
    whatToBringEs: exp?.whatToBringEs ?? "",
    whatToBringEn: exp?.whatToBringEn ?? "",
    mainImage: exp?.mainImage ?? "",
    seoTitleEs: exp?.seoTitleEs ?? "",
    seoTitleEn: exp?.seoTitleEn ?? "",
    seoDescriptionEs: exp?.seoDescriptionEs ?? "",
    seoDescriptionEn: exp?.seoDescriptionEn ?? "",
    seoImage: exp?.seoImage ?? "",
    itinerary: exp?.itinerary ?? [],
    includedItems: exp?.includedItems ?? [],
    priceTiers: exp?.priceTiers ?? [],
    dates: exp?.dates?.map((d) => ({
      ...d,
      startDate: d.startDate ? d.startDate.slice(0, 10) : "",
      endDate: d.endDate ? d.endDate.slice(0, 10) : "",
    })) ?? [],
    gallery: exp?.gallery ?? [],
  };
}

/* ------------------------------------------------------------------ */
/* Reusable UI primitives                                              */
/* ------------------------------------------------------------------ */

function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-medium text-slate-700 mb-1.5"
    >
      {children}
    </label>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }
) {
  const { label, id, className, ...rest } = props;
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <input
        id={id}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
}

function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }
) {
  const { label, id, className, ...rest } = props;
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <textarea
        id={id}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors ${className ?? ""}`}
        {...rest}
      />
    </div>
  );
}

function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement> & {
    label?: string;
    options: { value: string; label: string }[];
  }
) {
  const { label, id, options, className, ...rest } = props;
  return (
    <div>
      {label && <Label htmlFor={id}>{label}</Label>}
      <select
        id={id}
        className={`w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-forest-500 transition-colors bg-white ${className ?? ""}`}
        {...rest}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          checked ? "bg-forest-600" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-lg tracking-wider text-slate-800 mb-4 pt-2 border-t border-slate-200">
      {children}
    </h3>
  );
}

/* ------------------------------------------------------------------ */
/* Main form component                                                 */
/* ------------------------------------------------------------------ */

export default function ExpeditionForm({
  expedition,
  isEdit,
}: ExpeditionFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState<ExpeditionData>(() =>
    getDefaults(expedition)
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---- field helpers ---- */

  function set<K extends keyof ExpeditionData>(key: K, value: ExpeditionData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function handleTitleEsChange(value: string) {
    set("titleEs", value);
    if (!isEdit && !form.slug) {
      set("slug", generateSlug(value));
    }
  }

  /* ---- itinerary ---- */

  function addItineraryDay() {
    set("itinerary", [
      ...form.itinerary,
      {
        dayNumber: form.itinerary.length + 1,
        titleEs: "",
        titleEn: "",
        descriptionEs: "",
        descriptionEn: "",
        elevation: null,
      },
    ]);
  }

  function removeItineraryDay(index: number) {
    const next = form.itinerary
      .filter((_, i) => i !== index)
      .map((d, i) => ({ ...d, dayNumber: i + 1 }));
    set("itinerary", next);
  }

  function updateItineraryDay(
    index: number,
    key: keyof ItineraryDay,
    value: string | number | null
  ) {
    const next = [...form.itinerary];
    next[index] = { ...next[index], [key]: value };
    set("itinerary", next);
  }

  /* ---- included items ---- */

  function addIncludedItem(isIncluded: boolean) {
    set("includedItems", [
      ...form.includedItems,
      { textEs: "", textEn: "", icon: "", isIncluded },
    ]);
  }

  function removeIncludedItem(index: number) {
    set(
      "includedItems",
      form.includedItems.filter((_, i) => i !== index)
    );
  }

  function updateIncludedItem(
    index: number,
    key: keyof IncludedItem,
    value: string | boolean
  ) {
    const next = [...form.includedItems];
    next[index] = { ...next[index], [key]: value };
    set("includedItems", next);
  }

  /* ---- price tiers ---- */

  function addPriceTier() {
    set("priceTiers", [
      ...form.priceTiers,
      { minPeople: 1, maxPeople: 1, pricePerPerson: 0 },
    ]);
  }

  function removePriceTier(index: number) {
    set(
      "priceTiers",
      form.priceTiers.filter((_, i) => i !== index)
    );
  }

  function updatePriceTier(
    index: number,
    key: keyof PriceTier,
    value: number
  ) {
    const next = [...form.priceTiers];
    next[index] = { ...next[index], [key]: value };
    set("priceTiers", next);
  }

  /* ---- dates ---- */

  function addDate() {
    set("dates", [
      ...form.dates,
      {
        startDate: "",
        endDate: "",
        spotsTotal: 10,
        spotsTaken: 0,
        status: "available",
      },
    ]);
  }

  function removeDate(index: number) {
    set(
      "dates",
      form.dates.filter((_, i) => i !== index)
    );
  }

  function updateDate(
    index: number,
    key: keyof ExpeditionDate,
    value: string | number
  ) {
    const next = [...form.dates];
    next[index] = { ...next[index], [key]: value };
    set("dates", next);
  }

  /* ---- gallery ---- */

  function addGalleryItem(url: string) {
    set("gallery", [
      ...form.gallery,
      {
        imageUrl: url,
        altText: "",
        captionEs: "",
        captionEn: "",
        sortOrder: form.gallery.length,
      },
    ]);
  }

  function removeGalleryItem(index: number) {
    set(
      "gallery",
      form.gallery.filter((_, i) => i !== index)
    );
  }

  function updateGalleryItem(
    index: number,
    key: keyof GalleryItem,
    value: string | number
  ) {
    const next = [...form.gallery];
    next[index] = { ...next[index], [key]: value };
    set("gallery", next);
  }

  /* ---- validation ---- */

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!form.titleEs.trim()) errs.titleEs = "El titulo en espanol es requerido";
    if (form.pricePerPerson <= 0)
      errs.pricePerPerson = "El precio debe ser mayor a 0";
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      // Switch to the tab that has the first error
      if (errs.titleEs) setActiveTab(0);
      else if (errs.pricePerPerson) setActiveTab(2);
    }
    return Object.keys(errs).length === 0;
  }

  /* ---- submit ---- */

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setMessage(null);

    try {
      const url = isEdit
        ? `/api/admin/expediciones/${expedition?.id}`
        : "/api/admin/expediciones";
      const method = isEdit ? "PUT" : "POST";

      const body = {
        ...form,
        altitude: form.altitude || null,
        groupSizeMin: form.groupSizeMin || null,
        groupSizeMax: form.groupSizeMax || null,
        locationLat: form.locationLat || null,
        locationLng: form.locationLng || null,
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }

      if (isEdit) {
        setMessage({
          type: "success",
          text: "Expedicion actualizada correctamente",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/admin/expediciones");
      }
    } catch (err) {
      setMessage({
        type: "error",
        text:
          err instanceof Error ? err.message : "Error al guardar la expedicion",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSaving(false);
    }
  }

  /* ---- Gallery file upload handler ---- */

  function handleGalleryFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          addGalleryItem(data.url);
        }
      } catch {
        // silently fail individual uploads
      }
    });
    e.target.value = "";
  }

  /* ================================================================ */
  /* Render                                                            */
  /* ================================================================ */

  const includedItems = form.includedItems.filter((i) => i.isIncluded);
  const excludedItems = form.includedItems.filter((i) => !i.isIncluded);

  return (
    <form onSubmit={handleSubmit}>
      {/* Message */}
      {message && (
        <div
          className={`mb-6 px-4 py-3 rounded-lg text-sm border ${
            message.type === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {message.text}
          <button
            type="button"
            onClick={() => setMessage(null)}
            className="ml-2 underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <nav className="flex gap-0 min-w-max" aria-label="Tabs">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(i)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === i
                  ? "border-forest-600 text-forest-700"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab panels */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        {/* ========== TAB 0: General ========== */}
        {activeTab === 0 && (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Input
                  label="Titulo (ES) *"
                  value={form.titleEs}
                  onChange={(e) => handleTitleEsChange(e.target.value)}
                  placeholder="Ej: Pico de Orizaba"
                />
                {errors.titleEs && (
                  <p className="text-sm text-red-600 mt-1">{errors.titleEs}</p>
                )}
              </div>
              <Input
                label="Titulo (EN)"
                value={form.titleEn}
                onChange={(e) => set("titleEn", e.target.value)}
                placeholder="Ej: Pico de Orizaba"
              />
            </div>

            <Input
              label="Slug"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              placeholder="pico-de-orizaba"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Subtitulo (ES)"
                value={form.subtitleEs}
                onChange={(e) => set("subtitleEs", e.target.value)}
              />
              <Input
                label="Subtitulo (EN)"
                value={form.subtitleEn}
                onChange={(e) => set("subtitleEn", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Textarea
                label="Extracto (ES)"
                value={form.excerptEs}
                onChange={(e) => set("excerptEs", e.target.value)}
                rows={3}
                placeholder="Breve descripcion para listados..."
              />
              <Textarea
                label="Extracto (EN)"
                value={form.excerptEn}
                onChange={(e) => set("excerptEn", e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Select
                label="Categoria"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                options={CATEGORIES}
              />
              <Select
                label="Dificultad"
                value={form.difficulty}
                onChange={(e) => set("difficulty", e.target.value)}
                options={DIFFICULTIES}
              />
            </div>

            <div className="flex flex-wrap gap-6">
              <Toggle
                label="Activa"
                checked={form.isActive}
                onChange={(v) => set("isActive", v)}
              />
              <Toggle
                label="Destacada"
                checked={form.isFeatured}
                onChange={(v) => set("isFeatured", v)}
              />
            </div>

            <div className="max-w-[200px]">
              <Input
                label="Orden"
                type="number"
                value={form.sortOrder}
                onChange={(e) => set("sortOrder", parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        )}

        {/* ========== TAB 1: Detalles ========== */}
        {activeTab === 1 && (
          <div className="space-y-5 max-w-3xl">
            <Textarea
              label="Descripcion (ES)"
              value={form.descriptionEs}
              onChange={(e) => set("descriptionEs", e.target.value)}
              rows={8}
              placeholder="Descripcion completa de la expedicion..."
            />
            <Textarea
              label="Descripcion (EN)"
              value={form.descriptionEn}
              onChange={(e) => set("descriptionEn", e.target.value)}
              rows={8}
            />

            <SectionTitle>Duracion</SectionTitle>
            <div className="grid grid-cols-2 gap-5 max-w-sm">
              <Input
                label="Dias"
                type="number"
                min={1}
                value={form.durationDays}
                onChange={(e) =>
                  set("durationDays", parseInt(e.target.value) || 1)
                }
              />
              <Input
                label="Noches"
                type="number"
                min={0}
                value={form.durationNights}
                onChange={(e) =>
                  set("durationNights", parseInt(e.target.value) || 0)
                }
              />
            </div>

            <div className="max-w-sm">
              <Input
                label="Altitud (metros)"
                type="number"
                value={form.altitude ?? ""}
                onChange={(e) =>
                  set(
                    "altitude",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                placeholder="Ej: 5636"
              />
            </div>

            <SectionTitle>Tamano de grupo</SectionTitle>
            <div className="grid grid-cols-2 gap-5 max-w-sm">
              <Input
                label="Minimo"
                type="number"
                min={1}
                value={form.groupSizeMin ?? ""}
                onChange={(e) =>
                  set(
                    "groupSizeMin",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              />
              <Input
                label="Maximo"
                type="number"
                min={1}
                value={form.groupSizeMax ?? ""}
                onChange={(e) =>
                  set(
                    "groupSizeMax",
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              />
            </div>

            <SectionTitle>Ubicacion</SectionTitle>
            <Input
              label="Nombre de ubicacion"
              value={form.locationName}
              onChange={(e) => set("locationName", e.target.value)}
              placeholder="Ej: Parque Nacional Pico de Orizaba, Puebla"
            />
            <div className="grid grid-cols-2 gap-5 max-w-sm">
              <Input
                label="Latitud"
                type="number"
                step="any"
                value={form.locationLat ?? ""}
                onChange={(e) =>
                  set(
                    "locationLat",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
              <Input
                label="Longitud"
                type="number"
                step="any"
                value={form.locationLng ?? ""}
                onChange={(e) =>
                  set(
                    "locationLng",
                    e.target.value ? parseFloat(e.target.value) : null
                  )
                }
              />
            </div>
          </div>
        )}

        {/* ========== TAB 2: Precios ========== */}
        {activeTab === 2 && (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-md">
              <div>
                <Input
                  label="Precio por persona *"
                  type="number"
                  min={0}
                  step="0.01"
                  value={form.pricePerPerson}
                  onChange={(e) =>
                    set("pricePerPerson", parseFloat(e.target.value) || 0)
                  }
                />
                {errors.pricePerPerson && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.pricePerPerson}
                  </p>
                )}
              </div>
              <Select
                label="Moneda"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                options={[
                  { value: "MXN", label: "MXN - Peso mexicano" },
                  { value: "USD", label: "USD - Dolar americano" },
                ]}
              />
            </div>

            {/* Price tiers */}
            <SectionTitle>Niveles de precio</SectionTitle>
            {form.priceTiers.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay niveles de precio configurados
              </p>
            )}
            {form.priceTiers.map((tier, i) => (
              <div
                key={i}
                className="flex flex-wrap items-end gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="w-28">
                  <Input
                    label="Min personas"
                    type="number"
                    min={1}
                    value={tier.minPeople}
                    onChange={(e) =>
                      updatePriceTier(i, "minPeople", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="w-28">
                  <Input
                    label="Max personas"
                    type="number"
                    min={1}
                    value={tier.maxPeople}
                    onChange={(e) =>
                      updatePriceTier(i, "maxPeople", parseInt(e.target.value) || 1)
                    }
                  />
                </div>
                <div className="w-36">
                  <Input
                    label="Precio"
                    type="number"
                    min={0}
                    step="0.01"
                    value={tier.pricePerPerson}
                    onChange={(e) =>
                      updatePriceTier(
                        i,
                        "pricePerPerson",
                        parseFloat(e.target.value) || 0
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removePriceTier(i)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Eliminar nivel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addPriceTier}
              className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-800 font-medium"
            >
              <Plus className="w-4 h-4" /> Agregar nivel de precio
            </button>

            {/* Dates */}
            <SectionTitle>Fechas disponibles</SectionTitle>
            {form.dates.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay fechas configuradas
              </p>
            )}
            {form.dates.map((date, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
              >
                <div className="flex flex-wrap items-end gap-3">
                  <div className="w-44">
                    <Input
                      label="Fecha inicio"
                      type="date"
                      value={date.startDate}
                      onChange={(e) =>
                        updateDate(i, "startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-44">
                    <Input
                      label="Fecha fin"
                      type="date"
                      value={date.endDate}
                      onChange={(e) => updateDate(i, "endDate", e.target.value)}
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      label="Lugares"
                      type="number"
                      min={0}
                      value={date.spotsTotal}
                      onChange={(e) =>
                        updateDate(
                          i,
                          "spotsTotal",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      label="Tomados"
                      type="number"
                      min={0}
                      value={date.spotsTaken}
                      onChange={(e) =>
                        updateDate(
                          i,
                          "spotsTaken",
                          parseInt(e.target.value) || 0
                        )
                      }
                    />
                  </div>
                  <div className="w-40">
                    <Select
                      label="Estado"
                      value={date.status}
                      onChange={(e) => updateDate(i, "status", e.target.value)}
                      options={DATE_STATUSES}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDate(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Eliminar fecha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addDate}
              className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-800 font-medium"
            >
              <Plus className="w-4 h-4" /> Agregar fecha
            </button>
          </div>
        )}

        {/* ========== TAB 3: Itinerario ========== */}
        {activeTab === 3 && (
          <div className="space-y-5">
            {form.itinerary.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay dias de itinerario configurados
              </p>
            )}
            {form.itinerary.map((day, i) => (
              <div
                key={i}
                className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-lg text-slate-800">
                    Dia {day.dayNumber}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(i)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Eliminar dia"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Titulo (ES)"
                    value={day.titleEs}
                    onChange={(e) =>
                      updateItineraryDay(i, "titleEs", e.target.value)
                    }
                    placeholder="Ej: Llegada al campamento base"
                  />
                  <Input
                    label="Titulo (EN)"
                    value={day.titleEn}
                    onChange={(e) =>
                      updateItineraryDay(i, "titleEn", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Textarea
                    label="Descripcion (ES)"
                    value={day.descriptionEs}
                    onChange={(e) =>
                      updateItineraryDay(i, "descriptionEs", e.target.value)
                    }
                    rows={4}
                  />
                  <Textarea
                    label="Descripcion (EN)"
                    value={day.descriptionEn}
                    onChange={(e) =>
                      updateItineraryDay(i, "descriptionEn", e.target.value)
                    }
                    rows={4}
                  />
                </div>
                <div className="max-w-[200px]">
                  <Input
                    label="Elevacion (m)"
                    type="number"
                    value={day.elevation ?? ""}
                    onChange={(e) =>
                      updateItineraryDay(
                        i,
                        "elevation",
                        e.target.value ? parseInt(e.target.value) : null
                      )
                    }
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addItineraryDay}
              className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-800 font-medium"
            >
              <Plus className="w-4 h-4" /> Agregar dia
            </button>
          </div>
        )}

        {/* ========== TAB 4: Incluye / No incluye ========== */}
        {activeTab === 4 && (
          <div className="space-y-6">
            {/* Included */}
            <div>
              <SectionTitle>Que incluye</SectionTitle>
              {includedItems.length === 0 && (
                <p className="text-sm text-slate-500 mb-3">
                  No hay elementos configurados
                </p>
              )}
              {form.includedItems.map(
                (item, i) =>
                  item.isIncluded && (
                    <div
                      key={i}
                      className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <Input
                          label="Texto (ES)"
                          value={item.textEs}
                          onChange={(e) =>
                            updateIncludedItem(i, "textEs", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <Input
                          label="Texto (EN)"
                          value={item.textEn}
                          onChange={(e) =>
                            updateIncludedItem(i, "textEn", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          label="Icono"
                          value={item.icon}
                          onChange={(e) =>
                            updateIncludedItem(i, "icon", e.target.value)
                          }
                          placeholder="mountain"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
              )}
              <button
                type="button"
                onClick={() => addIncludedItem(true)}
                className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-800 font-medium"
              >
                <Plus className="w-4 h-4" /> Agregar elemento
              </button>
            </div>

            {/* Excluded */}
            <div>
              <SectionTitle>Que NO incluye</SectionTitle>
              {excludedItems.length === 0 && (
                <p className="text-sm text-slate-500 mb-3">
                  No hay elementos configurados
                </p>
              )}
              {form.includedItems.map(
                (item, i) =>
                  !item.isIncluded && (
                    <div
                      key={i}
                      className="flex flex-wrap items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 mb-3"
                    >
                      <div className="flex-1 min-w-[180px]">
                        <Input
                          label="Texto (ES)"
                          value={item.textEs}
                          onChange={(e) =>
                            updateIncludedItem(i, "textEs", e.target.value)
                          }
                        />
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <Input
                          label="Texto (EN)"
                          value={item.textEn}
                          onChange={(e) =>
                            updateIncludedItem(i, "textEn", e.target.value)
                          }
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          label="Icono"
                          value={item.icon}
                          onChange={(e) =>
                            updateIncludedItem(i, "icon", e.target.value)
                          }
                          placeholder="x-circle"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeIncludedItem(i)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
              )}
              <button
                type="button"
                onClick={() => addIncludedItem(false)}
                className="inline-flex items-center gap-2 text-sm text-forest-700 hover:text-forest-800 font-medium"
              >
                <Plus className="w-4 h-4" /> Agregar elemento
              </button>
            </div>

            {/* Requirements & What to bring */}
            <SectionTitle>Requisitos y que llevar</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Textarea
                label="Requisitos (ES)"
                value={form.requirementsEs}
                onChange={(e) => set("requirementsEs", e.target.value)}
                rows={5}
                placeholder="Requisitos para participar..."
              />
              <Textarea
                label="Requisitos (EN)"
                value={form.requirementsEn}
                onChange={(e) => set("requirementsEn", e.target.value)}
                rows={5}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Textarea
                label="Que llevar (ES)"
                value={form.whatToBringEs}
                onChange={(e) => set("whatToBringEs", e.target.value)}
                rows={5}
                placeholder="Lista de equipo necesario..."
              />
              <Textarea
                label="Que llevar (EN)"
                value={form.whatToBringEn}
                onChange={(e) => set("whatToBringEn", e.target.value)}
                rows={5}
              />
            </div>
          </div>
        )}

        {/* ========== TAB 5: Imagenes ========== */}
        {activeTab === 5 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <ImageUploader
                label="Imagen principal"
                value={form.mainImage}
                onChange={(url) => set("mainImage", url)}
              />
            </div>

            <SectionTitle>Galeria</SectionTitle>

            {form.gallery.length === 0 && (
              <p className="text-sm text-slate-500">
                No hay imagenes en la galeria
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.gallery.map((item, i) => (
                <div
                  key={i}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3"
                >
                  <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-200">
                    <Image
                      src={item.imageUrl}
                      alt={item.altText || `Galeria ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 300px"
                    />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg shadow-md"
                      title="Eliminar imagen"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <Input
                    label="Texto alt"
                    value={item.altText}
                    onChange={(e) =>
                      updateGalleryItem(i, "altText", e.target.value)
                    }
                    placeholder="Descripcion de la imagen"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Caption (ES)"
                      value={item.captionEs}
                      onChange={(e) =>
                        updateGalleryItem(i, "captionEs", e.target.value)
                      }
                    />
                    <Input
                      label="Caption (EN)"
                      value={item.captionEn}
                      onChange={(e) =>
                        updateGalleryItem(i, "captionEn", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Agregar imagenes
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* ========== TAB 6: SEO ========== */}
        {activeTab === 6 && (
          <div className="space-y-5 max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Input
                label="Meta titulo (ES)"
                value={form.seoTitleEs}
                onChange={(e) => set("seoTitleEs", e.target.value)}
                placeholder="Titulo para motores de busqueda"
              />
              <Input
                label="Meta titulo (EN)"
                value={form.seoTitleEn}
                onChange={(e) => set("seoTitleEn", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Textarea
                label="Meta descripcion (ES)"
                value={form.seoDescriptionEs}
                onChange={(e) => set("seoDescriptionEs", e.target.value)}
                rows={3}
                placeholder="Descripcion para motores de busqueda (max 160 chars)"
              />
              <Textarea
                label="Meta descripcion (EN)"
                value={form.seoDescriptionEn}
                onChange={(e) => set("seoDescriptionEn", e.target.value)}
                rows={3}
              />
            </div>
            <ImageUploader
              label="Imagen OG"
              value={form.seoImage}
              onChange={(url) => set("seoImage", url)}
            />
          </div>
        )}
      </div>

      {/* Submit button */}
      <div className="mt-6 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push("/admin/expediciones")}
          className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 text-sm font-medium text-white bg-forest-700 rounded-lg hover:bg-forest-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving
            ? "Guardando..."
            : isEdit
              ? "Actualizar expedicion"
              : "Guardar expedicion"}
        </button>
      </div>
    </form>
  );
}
