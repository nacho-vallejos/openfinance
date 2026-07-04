"use client";

import { useMemo, useState } from "react";
import {
  BadgeDollarSign,
  Banknote,
  BriefcaseBusiness,
  CheckCircle2,
  CreditCard,
  FileText,
  Globe2,
  GraduationCap,
  Landmark,
  ReceiptText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ProfileId =
  | "estudiante-local"
  | "estudiante-exterior"
  | "salario-minimo"
  | "monotributista"
  | "relacion-dependencia";

type BankOffer = {
  bank: string;
  product: string;
  maxAmount: number;
  tna: number;
  tea: number;
  paymentTypes: string[];
  installments: string;
  requirements: string[];
  fit: "Alta" | "Media" | "Exploratoria";
};

type Profile = {
  id: ProfileId;
  title: string;
  description: string;
  icon: typeof GraduationCap;
  scoreRange: string;
  offers: BankOffer[];
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);

const profiles: Profile[] = [
  {
    id: "estudiante-local",
    title: "Estudiante Local",
    description: "Perfil con actividad academica en Argentina y consumos moderados.",
    icon: GraduationCap,
    scoreRange: "Score estimado: inicial a medio",
    offers: [
      {
        bank: "Banco Nacion",
        product: "Tarjeta joven universitaria",
        maxAmount: 350000,
        tna: 86,
        tea: 128,
        paymentTypes: ["Tarjeta de credito", "Debito automatico"],
        installments: "3, 6 y 12 cuotas",
        requirements: ["DNI", "Constancia de alumno regular", "Cuenta sueldo o caja de ahorro"],
        fit: "Alta",
      },
      {
        bank: "Uala",
        product: "Linea de consumo digital",
        maxAmount: 220000,
        tna: 92,
        tea: 145,
        paymentTypes: ["Billetera", "Transferencia", "Tarjeta virtual"],
        installments: "1 a 9 cuotas",
        requirements: ["DNI", "Validacion de identidad", "Historial transaccional"],
        fit: "Media",
      },
      {
        bank: "Banco Provincia",
        product: "Paquete universitario",
        maxAmount: 300000,
        tna: 82,
        tea: 119,
        paymentTypes: ["Tarjeta", "Cuenta bancaria"],
        installments: "3, 6 y 12 cuotas",
        requirements: ["DNI", "Certificado de estudiante", "Residencia local"],
        fit: "Media",
      },
    ],
  },
  {
    id: "estudiante-exterior",
    title: "Estudiante del Exterior",
    description: "Perfil extranjero o argentino con documentacion academica internacional.",
    icon: Globe2,
    scoreRange: "Score estimado: sujeto a documentacion",
    offers: [
      {
        bank: "Santander",
        product: "Cuenta internacional estudiante",
        maxAmount: 500000,
        tna: 88,
        tea: 134,
        paymentTypes: ["Tarjeta internacional", "Debito", "Transferencia"],
        installments: "3, 6 y 12 cuotas",
        requirements: ["Pasaporte", "Visa de estudiante", "Certificado de alumno regular"],
        fit: "Alta",
      },
      {
        bank: "BBVA Argentina",
        product: "Paquete estudiante global",
        maxAmount: 450000,
        tna: 90,
        tea: 139,
        paymentTypes: ["Tarjeta", "Debito automatico", "Transferencia"],
        installments: "3 a 12 cuotas",
        requirements: ["DNI extranjero o precaria", "Pasaporte", "Constancia de domicilio"],
        fit: "Media",
      },
      {
        bank: "ICBC",
        product: "Tarjeta inicial internacional",
        maxAmount: 380000,
        tna: 94,
        tea: 151,
        paymentTypes: ["Tarjeta", "Pago por home banking"],
        installments: "1, 3, 6 y 12 cuotas",
        requirements: ["Pasaporte", "Visa", "Comprobante de fondos o beca"],
        fit: "Exploratoria",
      },
    ],
  },
  {
    id: "salario-minimo",
    title: "Trabajador con Salario Minimo",
    description: "Consulta con origen general de fondos, sin cargar monto exacto.",
    icon: WalletCards,
    scoreRange: "Score estimado: bajo a medio",
    offers: [
      {
        bank: "Banco Macro",
        product: "Prestamo personal tramo inicial",
        maxAmount: 850000,
        tna: 96,
        tea: 158,
        paymentTypes: ["Debito automatico", "Transferencia"],
        installments: "6, 12, 18 y 24 cuotas",
        requirements: ["DNI", "Antiguedad laboral", "Cuenta bancaria activa"],
        fit: "Media",
      },
      {
        bank: "Banco Nacion",
        product: "Tarjeta basica con limite controlado",
        maxAmount: 520000,
        tna: 84,
        tea: 123,
        paymentTypes: ["Tarjeta", "Debito en cuenta"],
        installments: "3, 6 y 12 cuotas",
        requirements: ["DNI", "Ingresos registrables", "Sin mora activa"],
        fit: "Alta",
      },
      {
        bank: "Brubank",
        product: "Credito digital preevaluado",
        maxAmount: 420000,
        tna: 99,
        tea: 166,
        paymentTypes: ["Billetera", "Debito automatico"],
        installments: "1 a 12 cuotas",
        requirements: ["Identidad validada", "Movimientos recurrentes", "Score transaccional"],
        fit: "Media",
      },
    ],
  },
  {
    id: "monotributista",
    title: "Monotributista",
    description: "Perfil fiscal independiente con facturacion y flujo digital.",
    icon: ReceiptText,
    scoreRange: "Score estimado: medio a alto",
    offers: [
      {
        bank: "Galicia",
        product: "Capital de trabajo monotributo",
        maxAmount: 1800000,
        tna: 78,
        tea: 111,
        paymentTypes: ["Transferencia", "Debito automatico"],
        installments: "6, 12, 18 y 24 cuotas",
        requirements: ["Constancia ARCA", "Actividad vigente", "Ingresos consistentes"],
        fit: "Alta",
      },
      {
        bank: "Santander",
        product: "Tarjeta pyme simple",
        maxAmount: 1450000,
        tna: 81,
        tea: 118,
        paymentTypes: ["Tarjeta", "Pago QR", "Transferencia"],
        installments: "3, 6, 12 y 18 cuotas",
        requirements: ["Monotributo activo", "Cuenta bancaria", "Sin deuda bancaria grave"],
        fit: "Alta",
      },
      {
        bank: "BBVA Argentina",
        product: "Prestamo para profesionales independientes",
        maxAmount: 2100000,
        tna: 83,
        tea: 122,
        paymentTypes: ["Debito automatico", "Transferencia"],
        installments: "12, 24 y 36 cuotas",
        requirements: ["Categoria monotributo", "Historial de pagos", "Movimientos declarados"],
        fit: "Media",
      },
    ],
  },
  {
    id: "relacion-dependencia",
    title: "Relacion de Dependencia",
    description: "Perfil con salario registrado y estabilidad laboral.",
    icon: BriefcaseBusiness,
    scoreRange: "Score estimado: medio a alto",
    offers: [
      {
        bank: "Banco Provincia",
        product: "Prestamo personal sueldo",
        maxAmount: 3200000,
        tna: 74,
        tea: 103,
        paymentTypes: ["Debito automatico", "Cuenta sueldo"],
        installments: "12, 24, 36 y 48 cuotas",
        requirements: ["DNI", "Recibo de sueldo", "Cuenta sueldo activa"],
        fit: "Alta",
      },
      {
        bank: "ICBC",
        product: "Tarjeta premium inicial",
        maxAmount: 1900000,
        tna: 80,
        tea: 116,
        paymentTypes: ["Tarjeta", "Debito automatico"],
        installments: "3, 6, 12 y 18 cuotas",
        requirements: ["Salario registrado", "Antiguedad laboral", "Buen comportamiento crediticio"],
        fit: "Media",
      },
      {
        bank: "Macro",
        product: "Prestamo consumo con score salarial",
        maxAmount: 2800000,
        tna: 79,
        tea: 114,
        paymentTypes: ["Transferencia", "Debito automatico"],
        installments: "6, 12, 24 y 36 cuotas",
        requirements: ["Cuenta bancaria", "Recibo de sueldo", "Validacion BCRA"],
        fit: "Alta",
      },
    ],
  },
];

const fundOrigins = [
  "Salario registrado",
  "Jornal / empleo informal declarado",
  "Asignacion o ayuda familiar",
  "Actividad independiente complementaria",
];

const exteriorDocuments = [
  "Pasaporte vigente",
  "DNI para extranjeros o residencia precaria",
  "Certificado de alumno regular",
  "Visa de estudiante o constancia migratoria",
  "Comprobante general de fondos: beca, ayuda familiar o trabajo permitido",
];

export default function SimuladorElegibilidadPage() {
  const [selectedProfileId, setSelectedProfileId] =
    useState<ProfileId>("estudiante-local");
  const [fundOrigin, setFundOrigin] = useState(fundOrigins[0]);

  const selectedProfile = useMemo(
    () => profiles.find((profile) => profile.id === selectedProfileId) ?? profiles[0],
    [selectedProfileId]
  );

  const strongestOffer = selectedProfile.offers.reduce((best, offer) =>
    offer.maxAmount > best.maxAmount ? offer : best
  );
  const averageTna = Math.round(
    selectedProfile.offers.reduce((total, offer) => total + offer.tna, 0) /
      selectedProfile.offers.length
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_340px] lg:items-center">
          <div className="min-w-0">
            <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              <ShieldCheck className="h-4 w-4" />
              Consulta sin declarar ingresos exactos
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-950 md:text-3xl dark:text-white">
              Simulador de Elegibilidad Crediticia
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Compara bancos, tarjetas y prestamos segun perfil general. El MVP no
              solicita montos exactos de ingresos: trabaja con categoria, origen de
              fondos y documentacion orientativa.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Resultado rapido
            </p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-white p-3 dark:bg-slate-900">
                <p className="text-[11px] font-bold text-slate-400">Ofertas</p>
                <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">
                  {selectedProfile.offers.length}
                </p>
              </div>
              <div className="rounded-2xl bg-white p-3 dark:bg-slate-900">
                <p className="text-[11px] font-bold text-slate-400">TNA prom.</p>
                <p className="mt-1 text-2xl font-black text-emerald-700">
                  {averageTna}%
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-2xl bg-white p-3 text-xs leading-5 text-slate-500 dark:bg-slate-900 dark:text-slate-400">
              Mejor cupo estimado:{" "}
              <strong className="text-slate-900 dark:text-white">
                {strongestOffer.bank} - {formatMoney(strongestOffer.maxAmount)}
              </strong>
            </div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_1fr]">
        <aside className="space-y-4">
          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-base font-black text-slate-950 dark:text-white">
              Perfil de consulta
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Selecciona el caso mas parecido al usuario. No hace falta ingresar
              ingresos exactos.
            </p>

            <div className="mt-4 grid gap-2">
              {profiles.map((profile) => {
                const Icon = profile.icon;
                const isSelected = selectedProfileId === profile.id;

                return (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedProfileId(profile.id)}
                    className={cn(
                      "flex items-start gap-3 rounded-2xl border p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-md",
                      isSelected
                        ? "border-emerald-300 bg-emerald-50 ring-2 ring-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/40 dark:ring-emerald-950"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900"
                    )}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-emerald-700 dark:bg-slate-950 dark:text-emerald-300">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-black text-slate-950 dark:text-white">
                        {profile.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {profile.description}
                      </span>
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-600" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedProfileId === "salario-minimo" && (
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <label className="block">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Origen general de fondos
                </span>
                <select
                  value={fundOrigin}
                  onChange={(event) => setFundOrigin(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                >
                  {fundOrigins.map((origin) => (
                    <option key={origin}>{origin}</option>
                  ))}
                </select>
              </label>
              <p className="mt-3 text-xs leading-5 text-slate-500 dark:text-slate-400">
                Este dato solo orienta la simulacion. No reemplaza validacion bancaria,
                recibo, movimientos ni consulta BCRA.
              </p>
            </div>
          )}
        </aside>

        <main className="space-y-5">
          <section className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Perfil seleccionado
                </p>
                <h2 className="mt-1 text-xl font-black text-slate-950 dark:text-white">
                  {selectedProfile.title}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedProfile.scoreRange}
                  {selectedProfileId === "salario-minimo" ? ` · ${fundOrigin}` : ""}
                </p>
              </div>
              <div className="flex w-fit items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                <BadgeDollarSign className="h-4 w-4" />
                Elegibilidad estimada
              </div>
            </div>
          </section>

          {selectedProfileId === "estudiante-exterior" && (
            <section className="rounded-[1.5rem] border border-sky-200 bg-sky-50 p-4 shadow-sm dark:border-sky-900 dark:bg-sky-950/40 sm:p-5">
              <div className="flex items-start gap-3">
                <Globe2 className="mt-0.5 h-5 w-5 shrink-0 text-sky-700 dark:text-sky-300" />
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">
                    Documentacion extra para estudiantes del exterior
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Los bancos que suelen operar este perfil priorizan identidad,
                    residencia, regularidad academica y origen general de fondos.
                  </p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    {exteriorDocuments.map((doc) => (
                      <div
                        key={doc}
                        className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300"
                      >
                        <FileText className="h-4 w-4 text-sky-600" />
                        {doc}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {selectedProfile.offers.map((offer) => (
              <article
                key={`${selectedProfile.id}-${offer.bank}-${offer.product}`}
                className="rounded-[1.5rem] border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-emerald-700 dark:bg-slate-950 dark:text-emerald-300">
                      <Landmark className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        {offer.bank}
                      </p>
                      <h3 className="mt-1 text-base font-black text-slate-950 dark:text-white">
                        {offer.product}
                      </h3>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[11px] font-black",
                      offer.fit === "Alta"
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                        : offer.fit === "Media"
                          ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                    )}
                  >
                    Afinidad {offer.fit}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Monto max.
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                      {formatMoney(offer.maxAmount)}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      TNA ref.
                    </p>
                    <p className="mt-1 text-lg font-black text-emerald-700">
                      {offer.tna}%
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 p-3 dark:bg-slate-950">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      TEA ref.
                    </p>
                    <p className="mt-1 text-lg font-black text-slate-950 dark:text-white">
                      {offer.tea}%
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start gap-2 text-sm">
                    <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-black text-slate-800 dark:text-slate-100">
                        Tipos de pago
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {offer.paymentTypes.join(" · ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Banknote className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="font-black text-slate-800 dark:text-slate-100">
                        Cuotas disponibles
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                        {offer.installments}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Requisitos orientativos
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {offer.requirements.map((requirement) => (
                      <span
                        key={requirement}
                        className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-slate-600 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {requirement}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </section>
    </div>
  );
}
