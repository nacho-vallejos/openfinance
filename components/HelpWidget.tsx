"use client";

import { useState } from "react";
import {
  ChevronDown,
  HelpCircle,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Como se calcula mi Score de Salud Financiera?",
    answer:
      "Analizamos tus ingresos formales, movimientos en wallets, transferencias y actividad fiscal consolidada para estimar estabilidad y capacidad de pago.",
  },
  {
    question: "Que datos comparten con el banco?",
    answer:
      "Solo los datos consolidados que autorizas mediante consentimiento expreso y revocable bajo el Decreto 353/2025.",
  },
  {
    question: "No veo mi linea de credito, por que?",
    answer:
      "Las ofertas se actualizan cada 24hs tras vincular nuevas entidades o validar nuevos ingresos.",
  },
];

export default function HelpWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [openIndex, setOpenIndex] = useState(0);

  const filteredFaqs = faqs.filter((faq) =>
    `${faq.question} ${faq.answer}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
        aria-label="Abrir ayuda"
      >
        <HelpCircle className="h-6 w-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm"
            aria-label="Cerrar ayuda"
            onClick={() => setIsOpen(false)}
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-200">
            <div className="flex items-start justify-between border-b border-slate-100 p-5">
              <div>
                <div className="mb-2 flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ayuda contextual
                </div>
                <h2 className="text-xl font-black text-slate-950">Centro de ayuda</h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Resuelve dudas sin salir del flujo actual.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Cerrar panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="border-b border-slate-100 p-5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Buscar en ayuda..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-50"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-3">
                {(filteredFaqs.length ? filteredFaqs : faqs).map((faq, index) => {
                  const isExpanded = openIndex === index;

                  return (
                    <div
                      key={faq.question}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                    >
                      <button
                        onClick={() => setOpenIndex(isExpanded ? -1 : index)}
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
                      >
                        <span className="text-sm font-black text-slate-900">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-slate-400 transition-transform",
                            isExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {isExpanded && (
                        <p className="border-t border-slate-100 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
