"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { uploadPhoto } from "@/lib/admin/resize-image";

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUploader({
  value,
  onChange,
  label,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      try {
        onChange(await uploadPhoto(file));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al subir la imagen"
        );
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    if (inputRef.current) inputRef.current.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handleClear() {
    onChange("");
    setError("");
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      {value ? (
        <div className="fm-imagen relative group">
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <Image
              src={value}
              alt="Vista previa"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 400px"
            />
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg sm:opacity-0 sm:group-hover:opacity-100 transition-opacity shadow-md"
            title="Eliminar imagen"
            aria-label="Eliminar imagen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`fm-subir border-2 border-dashed rounded-lg p-6 sm:p-8 text-center cursor-pointer transition-colors ${
            dragOver
              ? "border-forest-500 bg-forest-50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-forest-600 rounded-full animate-spin mb-2" />
              <p className="text-sm text-slate-500">Subiendo imagen...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">
                <span className="sm:hidden">Toca para subir una foto</span>
                <span className="hidden sm:inline">Haz clic o arrastra una imagen</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG o PNG · se optimiza sola al subir
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 mt-1.5">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
