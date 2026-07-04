"use client";

import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Banknote,
  Building2,
  CheckCircle2,
  Clock3,
  DatabaseZap,
  Eye,
  Landmark,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  WalletCards,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Entity = {
  id: string;
  name: string;
  description: string;
  connected: boolean;
  icon: typeof Landmark;
};

const initialEntities: Entity[] = [
  {
    id: "arca",
    name: "ARCA (Perfil Fiscal)",
    description: "Constancias, categoria fiscal, facturacion y actividad declarada.",
    connected: false,
    icon: Landmark,
  },
  {
    id: "mercado-pago",
    name: "Mercado Pago",
    description: "Cobros QR, billetera, ingresos digitales y transferencias.",
    connected: false,
    icon: WalletCards,
  },
  {
    id: "banco-nacion",
    name: "Banco Nacion",
    description: "Cuentas, acreditaciones, movimientos y comportamiento bancario.",
    connected: false,
    icon: Building2,
  },
  {
    id: "binance",
    name: "Binance",
    description: "Tenencias declaradas y liquidez cripto para clientes avanzados.",
    connected: false,
    icon: Banknote,
  },
];

export default function ConexionesPage() {
  const [entities, setEntities] = useState(initialEntities);
  const [authorizing, setAuthorizing] = useState<Entity | null>(null);
  const [expandedEntity, setExpandedEntity] = useState("arca");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const connectedCount = entities.filter((entity) => entity.connected).length;
  const selectedEntity = entities.find((entity) => entity.id === expandedEntity);

  useEffect(() => {
    if (!authorizing) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setAuthorizing(null);
        setConsentAccepted(false);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [authorizing]);

  const revokeConnection = (entityId: string) => {
    const target = entities.find((entity) => entity.id === entityId);
    setEntities((current) =>
      current.map((entity) =>
        entity.id === entityId ? { ...entity, connected: false } : entity
      )
    );
    if (target) {
      setSyncLog((current) => [
        `${target.name}: consentimiento revocado por el usuario.`,
        ...current,
      ]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_320px] lg:items-center">
          <div className="min-w-0">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4" />
              Consentimiento expreso y revocable
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl">
              Vincula tus entidades
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
              Tus datos estan encriptados y vos tenes el control. Selecciona las fuentes
              de ingresos que deseas consolidar para mejorar tu perfil crediticio.
            </p>
            <div className="mt-5 grid gap-2 text-xs font-semibold text-slate-600 sm:grid-cols-3">
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <Eye className="h-4 w-4 text-emerald-600" />
                Solo lectura
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <LockKeyhole className="h-4 w-4 text-emerald-600" />
                Consentimiento auditable
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                <Clock3 className="h-4 w-4 text-emerald-600" />
                Revocable al instante
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Fuentes conectadas
            </p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <span className="text-4xl font-black text-slate-950">
                {connectedCount}/{entities.length}
              </span>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700">
                Solo lectura
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                style={{ width: `${(connectedCount / entities.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {entities.map((entity) => {
          const Icon = entity.icon;

          return (
            <article
              key={entity.id}
              className={cn(
                "group rounded-[1.5rem] border bg-white p-4 shadow-sm transition-all sm:p-5",
                entity.connected
                  ? "border-emerald-200 bg-emerald-50/50 ring-2 ring-emerald-50"
                  : "border-slate-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors",
                    entity.connected
                      ? "border-emerald-100 bg-white text-emerald-700"
                      : "border-slate-100 bg-slate-50 text-slate-600 group-hover:text-emerald-700"
                  )}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="text-base font-black text-slate-950">
                        {entity.name}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        {entity.description}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                        entity.connected
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {entity.connected && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {entity.connected ? "Conectado" : "Desconectado"}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-2 text-xs text-slate-500 sm:grid-cols-2">
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                      <LockKeyhole className="h-4 w-4 text-emerald-600" />
                      Acceso cifrado
                    </div>
                    <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2">
                      <Clock3 className="h-4 w-4 text-emerald-600" />
                      Revocable
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-slate-400">
                      Alcance: consulta de ingresos y saldos.
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedEntity((current) =>
                            current === entity.id ? "" : entity.id
                          )
                        }
                        className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50 sm:w-auto"
                      >
                        Ver permisos
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConsentAccepted(false);
                          setAuthorizing(entity);
                        }}
                        disabled={entity.connected}
                        className={cn(
                          "inline-flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-colors sm:w-auto",
                          entity.connected
                            ? "cursor-default bg-white text-emerald-700"
                            : "bg-emerald-600 text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700"
                        )}
                      >
                        {entity.connected ? (
                          <>
                            <BadgeCheck className="h-4 w-4" />
                            Autorizado
                          </>
                        ) : (
                          "Conectar"
                        )}
                      </button>
                      {entity.connected && (
                        <button
                          type="button"
                          onClick={() => revokeConnection(entity.id)}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-50 sm:w-auto"
                        >
                          Revocar
                        </button>
                      )}
                    </div>
                  </div>

                  {expandedEntity === entity.id && (
                    <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-xs leading-5 text-slate-600">
                      <p className="font-black text-slate-900">
                        Permisos solicitados para analisis financiero
                      </p>
                      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                        {[
                          "Saldos y movimientos",
                          "Ingresos acreditados",
                          "Solo lectura",
                          "Revocable desde ajustes",
                        ].map((permission) => (
                          <li key={permission} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            {permission}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        </div>

        <aside className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Panel de consentimiento
          </p>
          <h2 className="mt-2 text-lg font-black text-slate-950">
            {selectedEntity?.name ?? "Selecciona una fuente"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Revisamos permisos, estado y trazabilidad antes de enviar datos al motor
            de scoring.
          </p>
          <div className="mt-5 space-y-3">
            {[
              "No transfiere claves ni credenciales",
              "No permite debitos ni movimientos de dinero",
              "Registra fecha, entidad y alcance del permiso",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => selectedEntity && setAuthorizing(selectedEntity)}
            disabled={!selectedEntity || selectedEntity.connected}
            className="mt-5 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {selectedEntity?.connected ? "Fuente ya conectada" : "Autorizar fuente seleccionada"}
          </button>
        </aside>
      </section>

      {authorizing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            aria-label="Cerrar autorizacion"
            onClick={() => {
              setAuthorizing(null);
              setConsentAccepted(false);
            }}
          />
          <div
            className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-white/80 bg-white p-6 text-center shadow-2xl dark:border-slate-700 dark:bg-slate-900"
            role="dialog"
            aria-modal="true"
            aria-labelledby="consent-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => {
                setAuthorizing(null);
                setConsentAccepted(false);
              }}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Cerrar autorizacion"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mt-2 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
              <div className="relative flex h-14 w-14 items-center justify-center">
                <Loader2 className="absolute h-14 w-14 animate-spin text-emerald-200" />
                <DatabaseZap className="h-7 w-7 text-emerald-700" />
              </div>
            </div>
            <h2 id="consent-title" className="mt-6 text-xl font-black text-slate-950 dark:text-white">
              Confirmar consentimiento
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Estas por autorizar a <strong>{authorizing.name}</strong> con permisos de
              consulta para consolidar tu perfil financiero.
            </p>
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-800">
              Simulacion OAuth: se registrara consentimiento expreso, fecha, entidad y alcance.
            </div>
            <div className="mt-4 grid gap-2 text-left text-xs font-semibold text-slate-500">
              <div className="rounded-xl bg-slate-50 px-3 py-2">Verificando identidad</div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">Solicitando permiso granular</div>
              <div className="rounded-xl bg-slate-50 px-3 py-2">Guardando evento de consentimiento</div>
            </div>
            <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold leading-5 text-slate-600">
              <input
                type="checkbox"
                checked={consentAccepted}
                onChange={(event) => setConsentAccepted(event.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-emerald-600"
              />
              Autorizo el acceso de solo lectura para consolidar ingresos, calcular
              capacidad crediticia y emitir reportes financieros.
            </label>
            <button
              type="button"
              onClick={() => {
                if (!consentAccepted || !authorizing) return;
                setEntities((current) =>
                  current.map((entity) =>
                    entity.id === authorizing.id ? { ...entity, connected: true } : entity
                  )
                );
                setSyncLog((current) => [
                  `${authorizing.name}: consentimiento confirmado y fuente conectada.`,
                  ...current,
                ]);
                setAuthorizing(null);
                setConsentAccepted(false);
              }}
              disabled={!consentAccepted}
              className="mt-4 flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Confirmar consentimiento
            </button>
          </div>
        </div>
      )}

      {syncLog.length > 0 && (
        <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black text-slate-950">Registro de actividad</h2>
          <div className="mt-3 space-y-2">
            {syncLog.map((log) => (
              <div
                key={log}
                className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {log}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
