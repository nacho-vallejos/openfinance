"use client";

import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Database,
  ExternalLink,
  FileText,
  Landmark,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from "lucide-react";
import bankCatalog from "@/lib/bank-credit-catalog.json";
import { cn } from "@/lib/utils";

type ProfileFilter =
  | "todos"
  | "estudiante"
  | "estudianteExtranjero"
  | "salarioMinimo"
  | "monotributista"
  | "relacionDependencia";

type ProfileData = {
  productos: string[];
  requisitos: string[];
  documentacionExtra?: string[];
};

type BankCatalogItem = (typeof bankCatalog)[number] & {
  sitioWeb?: string;
  tea?: number;
  cft?: number;
  perfilesAdmitidos?: Partial<Record<Exclude<ProfileFilter, "todos">, ProfileData>>;
};

const profileOptions: Array<{ id: ProfileFilter; label: string }> = [
  { id: "todos", label: "Todos" },
  { id: "estudiante", label: "Estudiante" },
  { id: "estudianteExtranjero", label: "Estudiante Extranjero" },
  { id: "salarioMinimo", label: "Trabajador Salario Minimo" },
  { id: "monotributista", label: "Monotributista" },
  { id: "relacionDependencia", label: "Relacion de Dependencia" },
];

const profileLabelById = Object.fromEntries(
  profileOptions.map((profile) => [profile.id, profile.label])
) as Record<ProfileFilter, string>;

const formatMoney = (value: number) => `$ ${value.toLocaleString("es-AR")}`;

const getAllProducts = (bank: BankCatalogItem) =>
  Object.values(bank.perfilesAdmitidos ?? {})
    .flatMap((profile) => profile?.productos ?? [])
    .filter(Boolean);

const getProfileEntries = (bank: BankCatalogItem) =>
  Object.entries(bank.perfilesAdmitidos ?? {}) as Array<
    [Exclude<ProfileFilter, "todos">, ProfileData]
  >;

export default function CatalogoBancosClient() {
  const [selectedProfile, setSelectedProfile] = useState<ProfileFilter>("todos");

  const filteredBanks = useMemo(() => {
    const banks = bankCatalog as BankCatalogItem[];
    if (selectedProfile === "todos") {
      return banks.filter((bank) => Object.keys(bank.perfilesAdmitidos ?? {}).length > 0);
    }

    return banks.filter((bank) => Boolean(bank.perfilesAdmitidos?.[selectedProfile]));
  }, [selectedProfile]);

  const averageTna = Math.round(
    filteredBanks.reduce((sum, bank) => sum + bank.tasa_base_tna, 0) /
      Math.max(filteredBanks.length, 1)
  );
  const averageCft = Math.round(
    filteredBanks.reduce((sum, bank) => sum + (bank.cft ?? bank.tasa_base_tna * 1.55), 0) /
      Math.max(filteredBanks.length, 1)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
          <Database className="h-4 w-4" />
          Consulta interactiva bancaria
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white md:text-3xl">
              Catalogo de bancos y politicas de credito
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Filtra entidades por perfil de usuario y revisa productos aplicables,
              tasas referenciales, CFT y requisitos documentales para originacion.
            </p>
          </div>

          <label className="block">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">
              Perfil de consulta
            </span>
            <select
              value={selectedProfile}
              onChange={(event) => setSelectedProfile(event.target.value as ProfileFilter)}
              className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
            >
              {profileOptions.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Landmark className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Entidades compatibles
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            {filteredBanks.length}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <TrendingUp className="mb-3 h-5 w-5 text-sky-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            TNA promedio
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            {averageTna}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <BadgeDollarSign className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            CFT promedio
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
            {averageCft}%
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <UsersRound className="mb-3 h-5 w-5 text-violet-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Perfil activo
          </p>
          <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
            {profileLabelById[selectedProfile]}
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-2">
        {profileOptions.map((profile) => {
          const isSelected = selectedProfile === profile.id;

          return (
            <button
              key={profile.id}
              type="button"
              onClick={() => setSelectedProfile(profile.id)}
              className={cn(
                "rounded-full border px-3 py-2 text-xs font-black transition-all",
                isSelected
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:ring-emerald-950"
                  : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
              )}
            >
              {profile.label}
            </button>
          );
        })}
      </div>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredBanks.map((bank) => {
          const bestPolicy = bank.politicas_riesgo[0];
          const riskyPolicy = bank.politicas_riesgo[3];
          const selectedProfileData =
            selectedProfile === "todos"
              ? undefined
              : bank.perfilesAdmitidos?.[selectedProfile];
          const products =
            selectedProfile === "todos"
              ? getAllProducts(bank)
              : selectedProfileData?.productos ?? [];
          const requirements =
            selectedProfile === "todos"
              ? []
              : selectedProfileData?.requisitos ?? [];
          const profileEntries = getProfileEntries(bank);

          return (
            <article
              key={bank.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Codigo BCRA {bank.codigo_bcra}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                    {bank.nombre}
                  </h2>
                </div>
                <a
                  href={bank.sitioWeb ?? "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-emerald-700"
                >
                  Visitar sitio oficial
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <p className="text-[10px] font-black uppercase tracking-wider">TNA</p>
                  <p className="mt-1 text-lg font-black">{bank.tasa_base_tna}%</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    TEA
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                    {bank.tea ?? Math.round(bank.tasa_base_tna * 1.42)}%
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    CFT
                  </p>
                  <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                    {bank.cft ?? Math.round(bank.tasa_base_tna * 1.55)}%
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Aplica para
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {products.map((product) => (
                    <span
                      key={product}
                      className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                    >
                      {product}
                    </span>
                  ))}
                </div>

                {selectedProfile === "todos" && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {profileEntries.map(([profileId]) => (
                      <span
                        key={profileId}
                        className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                      >
                        {profileLabelById[profileId]}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {requirements.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Requisitos base
                  </p>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {requirements.map((requirement) => (
                      <div
                        key={requirement}
                        className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        {requirement}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedProfile === "estudianteExtranjero" &&
                selectedProfileData?.documentacionExtra && (
                  <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-3 dark:border-sky-900 dark:bg-sky-950/40">
                    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-sky-800 dark:text-sky-300">
                      <FileText className="h-4 w-4" />
                      Documentacion extra requerida
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedProfileData.documentacionExtra.map((document) => (
                        <span
                          key={document}
                          className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200"
                        >
                          {document}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-xs font-bold text-slate-400">Situacion 1</p>
                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                    x{bestPolicy.multiplicador_riesgo}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pyme hasta {formatMoney(bestPolicy.monto_maximo_estimado.pyme)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                  <p className="text-xs font-bold text-slate-400">Situacion 4</p>
                  <p className="mt-1 text-sm font-black text-slate-950 dark:text-white">
                    x{riskyPolicy.multiplicador_riesgo}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pyme hasta {formatMoney(riskyPolicy.monto_maximo_estimado.pyme)}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filteredBanks.length === 0 && (
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5 text-sm font-bold text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          No hay bancos configurados para este perfil en el catalogo MVP.
        </section>
      )}

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <h2 className="text-base font-black text-slate-950 dark:text-white">
          Normalizacion recomendada
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
          En una base relacional conviene separar bancos, tasas versionadas,
          perfiles admitidos, productos, requisitos documentales y politicas de
          riesgo. Asi se auditan cambios comerciales sin duplicar reglas BCRA.
        </p>
      </section>
    </div>
  );
}
