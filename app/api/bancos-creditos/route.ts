import { NextResponse } from "next/server";
import bankCatalog from "@/lib/bank-credit-catalog.json";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json({
    data: bankCatalog,
    meta: {
      currency: "ARS",
      country: "AR",
      source: "OpenFinance+ MVP reference catalog",
      normalization:
        "Use relational tables bancos, politicas_riesgo, segmentos_crediticios, limites_credito and tasa_versiones.",
    },
  });
}
