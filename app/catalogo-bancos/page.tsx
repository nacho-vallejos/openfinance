import CatalogoBancosClient from "./CatalogoBancosClient";

export const metadata = {
  title: "Catalogo Bancario | OpenFinance+",
  description:
    "Catalogo interactivo de bancos argentinos, tasas, CFT, perfiles admitidos y requisitos para originacion crediticia.",
};

export default function CatalogoBancosPage() {
  return <CatalogoBancosClient />;
}
