"use client";

import { useRef, useState } from "react";
import type { Lang } from "@/i18n/dictionaries";
import { IconArrowRight, IconCheck, IconClose } from "@/components/icons";

const MAX_FILE = 15 * 1024 * 1024; // 15 Mo

const L = {
  fr: {
    firstName: "Prénom",
    lastName: "Nom",
    email: "E-mail",
    phone: "Téléphone",
    phoneOpt: "Téléphone (optionnel)",
    typeLabel: "Vous postulez pour",
    emploi: "Un emploi",
    stage: "Un stage",
    position: "Poste ou domaine visé",
    positionPh: "Ex : Développeur full-stack, Designer UI…",
    message: "Message",
    messagePh: "Présentez-vous en quelques lignes : motivation, disponibilité…",
    fileTitle: "Votre dossier (.zip)",
    fileHint: "CV, lettre de motivation, diplômes… regroupés dans un seul fichier ZIP (max 15 Mo).",
    fileCta: "Glissez votre ZIP ici ou cliquez pour parcourir",
    fileChange: "Changer de fichier",
    submit: "Envoyer ma candidature",
    sending: "Envoi en cours…",
    successTitle: "Candidature envoyée 🎉",
    successText: "Merci ! Nous avons bien reçu votre dossier et reviendrons vers vous très vite.",
    again: "Envoyer une autre candidature",
    errRequired: "Merci de renseigner prénom, nom et un e-mail valide.",
    errFile: "Veuillez joindre votre dossier au format ZIP.",
    errZip: "Le fichier doit être une archive ZIP.",
    errSize: "Le fichier dépasse 15 Mo. Compressez votre dossier.",
    errSend: "L'envoi a échoué. Réessayez ou écrivez-nous à contact@horus-lab.com.",
    consent: "En envoyant ce formulaire, vous acceptez que Horus-Lab traite vos données pour étudier votre candidature.",
  },
  en: {
    firstName: "First name",
    lastName: "Last name",
    email: "Email",
    phone: "Phone",
    phoneOpt: "Phone (optional)",
    typeLabel: "You are applying for",
    emploi: "A job",
    stage: "An internship",
    position: "Role or field",
    positionPh: "E.g. Full-stack developer, UI Designer…",
    message: "Message",
    messagePh: "Introduce yourself: motivation, availability…",
    fileTitle: "Your documents (.zip)",
    fileHint: "Résumé, cover letter, diplomas… bundled in a single ZIP file (max 15 MB).",
    fileCta: "Drag your ZIP here or click to browse",
    fileChange: "Change file",
    submit: "Send my application",
    sending: "Sending…",
    successTitle: "Application sent 🎉",
    successText: "Thank you! We've received your documents and will get back to you very soon.",
    again: "Send another application",
    errRequired: "Please provide first name, last name and a valid email.",
    errFile: "Please attach your documents as a ZIP file.",
    errZip: "The file must be a ZIP archive.",
    errSize: "The file exceeds 15 MB. Please compress your documents.",
    errSend: "Sending failed. Try again or email us at contact@horus-lab.com.",
    consent: "By submitting this form, you agree that Horus-Lab processes your data to review your application.",
  },
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export function CandidatureForm({ lang }: { lang: Lang }) {
  const t = L[lang] ?? L.fr;

  const [type, setType] = useState<"emploi" | "stage">("emploi");
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const website = useRef(""); // honeypot

  function pickFile(f: File | null) {
    setError("");
    if (!f) return;
    if (!/\.zip$/i.test(f.name) && !f.type.includes("zip")) {
      setError(t.errZip);
      return;
    }
    if (f.size > MAX_FILE) {
      setError(t.errSize);
      return;
    }
    setFile(f);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setError("");

    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);

    const firstName = String(data.get("firstName") || "").trim();
    const lastName = String(data.get("lastName") || "").trim();
    const email = String(data.get("email") || "").trim();
    if (!firstName || !lastName || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t.errRequired);
      return;
    }
    if (!file) {
      setError(t.errFile);
      return;
    }

    data.set("type", type);
    data.set("file", file);
    data.set("website", website.current);

    setStatus("sending");
    try {
      const res = await fetch("/api/applications", { method: "POST", body: data });
      if (!res.ok) throw new Error("send_failed");
      setStatus("success");
      form.reset();
      setFile(null);
      setType("emploi");
    } catch {
      setStatus("idle");
      setError(t.errSend);
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-brand-100 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-slate-900">
        <div className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-lg">
          <IconCheck className="size-8" />
        </div>
        <h3 className="mt-6 text-2xl font-extrabold text-brand-900 dark:text-white">{t.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-md text-muted">{t.successText}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50 dark:border-white/15 dark:text-brand-200 dark:hover:bg-white/5"
        >
          {t.again}
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="rounded-3xl border border-brand-100 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-slate-900 sm:p-9"
    >
      {/* Honeypot */}
      <input tabIndex={-1} autoComplete="off" aria-hidden name="website" className="hidden"
        onChange={(e) => { website.current = e.target.value; }} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="firstName" label={t.firstName} required />
        <Field name="lastName" label={t.lastName} required />
        <Field name="email" label={t.email} type="email" required />
        <Field name="phone" label={t.phoneOpt} type="tel" />
      </div>

      {/* Type de candidature */}
      <fieldset className="mt-6">
        <legend className="mb-2 text-sm font-semibold text-brand-900 dark:text-white">{t.typeLabel}</legend>
        <div className="grid grid-cols-2 gap-3">
          {([
            { v: "emploi", label: t.emploi },
            { v: "stage", label: t.stage },
          ] as const).map((opt) => (
            <button
              key={opt.v}
              type="button"
              onClick={() => setType(opt.v)}
              aria-pressed={type === opt.v}
              className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                type === opt.v
                  ? "border-brand-500 bg-brand-50 text-brand-700 shadow-sm dark:bg-white/10 dark:text-brand-200"
                  : "border-brand-100 text-ink/70 hover:border-brand-300 hover:bg-brand-50/50 dark:border-white/10 dark:text-brand-100/70 dark:hover:bg-white/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <Field name="position" label={t.position} placeholder={t.positionPh} />
      </div>

      <div className="mt-6">
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold text-brand-900 dark:text-white">
          {t.message}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder={t.messagePh}
          className="w-full resize-y rounded-2xl border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
      </div>

      {/* Zone de dépôt ZIP */}
      <div className="mt-6">
        <label className="mb-1.5 block text-sm font-semibold text-brand-900 dark:text-white">{t.fileTitle}</label>
        <p className="mb-2.5 text-xs text-muted">{t.fileHint}</p>

        {!file ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pickFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all ${
              dragging
                ? "border-brand-500 bg-brand-50 dark:bg-white/10"
                : "border-brand-200 hover:border-brand-400 hover:bg-brand-50/40 dark:border-white/15 dark:hover:bg-white/5"
            }`}
          >
            <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow-lg">
              <IconUpload className="size-6" />
            </span>
            <span className="text-sm font-medium text-ink/80 dark:text-brand-100/80">{t.fileCta}</span>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-600 dark:bg-white/5 dark:text-brand-300">
              .zip · 15 Mo max
            </span>
          </button>
        ) : (
          <div className="flex items-center gap-3 rounded-2xl border border-brand-100 bg-surface/50 p-4 dark:border-white/10 dark:bg-white/5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-700 to-brand-500 text-white shadow">
              <IconZip className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-brand-900 dark:text-white">{file.name}</p>
              <p className="text-xs text-muted">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = ""; }}
              aria-label={t.fileChange}
              className="grid size-9 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-white/10"
            >
              <IconClose className="size-5" />
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept=".zip,application/zip,application/x-zip-compressed"
          className="hidden"
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-brand-700/25 transition-all hover:bg-brand-800 disabled:opacity-60"
      >
        {status === "sending" ? t.sending : t.submit}
        {status !== "sending" && <IconArrowRight className="size-5 transition-transform group-hover:translate-x-1" />}
      </button>

      <p className="mt-4 text-center text-[11px] leading-relaxed text-muted">{t.consent}</p>
    </form>
  );
}

/* ── Champ texte réutilisable ── */
function Field({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold text-brand-900 dark:text-white">
        {label} {required && <span className="text-brand-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-brand-100 bg-surface/60 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white"
      />
    </div>
  );
}

/* ── Icônes locales ── */
function IconUpload({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M17 8l-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

function IconZip({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M11 10h1v1h-1zM12 11h1v1h-1zM11 12h1v1h-1zM12 13h1v1h-1z" fill="currentColor" stroke="none" />
    </svg>
  );
}
