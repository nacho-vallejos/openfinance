import { Database, Landmark, ShieldCheck, TrendingUp } from "lucide-react";
import bankCatalog from "@/lib/bank-credit-catalog.json";

const formatMoney = (value: number) => `$ ${value.toLocaleString("es-AR")}`;

export const metadata = {
  title: "Catalogo Bancario | OpenFinance+",
  description:
    "Catalogo MVP de bancos argentinos, tasas base, politicas de riesgo BCRA y montos maximos estimados para originacion crediticia.",
};

export default function CatalogoBancosPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
          <Database className="h-4 w-4" />
          Datos para API bancaria
        </div>
        <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
          Catalogo de bancos y politicas de credito
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          Estructura inicial para simular originacion crediticia con bancos argentinos,
          clasificacion BCRA y multiplicadores de riesgo. Tasas de referencia para MVP.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Landmark className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Entidades
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">{bankCatalog.length}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <TrendingUp className="mb-3 h-5 w-5 text-sky-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            TNA promedio
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">
            {Math.round(
              bankCatalog.reduce((sum, bank) => sum + bank.tasa_base_tna, 0) /
                bankCatalog.length
            )}
            %
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <ShieldCheck className="mb-3 h-5 w-5 text-emerald-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Riesgo
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">BCRA 1-5</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <Database className="mb-3 h-5 w-5 text-violet-600" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Fuente
          </p>
          <p className="mt-1 text-2xl font-black text-slate-950">JSON</p>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {bankCatalog.map((bank) => {
          const bestPolicy = bank.politicas_riesgo[0];
          const riskyPolicy = bank.politicas_riesgo[3];

          return (
            <article
              key={bank.id}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Codigo BCRA {bank.codigo_bcra}
                  </p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">
                    {bank.nombre}
                  </h2>
                </div>
                <span className="w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {bank.tasa_base_tna}% TNA
                </span>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-400">Situacion 1</p>
                  <p className="mt-1 text-sm font-black text-slate-950">
                    x{bestPolicy.multiplicador_riesgo}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Pyme hasta {formatMoney(bestPolicy.monto_maximo_estimado.pyme)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3">
                  <p className="text-xs font-bold text-slate-400">Situacion 4</p>
                  <p className="mt-1 text-sm font-black text-slate-950">
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

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h2 className="text-base font-black text-slate-950">
          Normalizacion recomendada
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          En una base relacional conviene separar bancos, politicas de riesgo, segmentos
          y montos maximos: `bancos`, `politicas_riesgo`, `segmentos_crediticios` y
          `limites_credito`. Asi se evita duplicar multiplicadores, se versionan tasas
          por fecha y se auditan cambios regulatorios o comerciales.
        </p>
      </section>
    </div>
  );
}
