import React from "react";
import { notFound } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = PRODUCTS.find((p) => p.id === resolvedParams.id);

  if (!product) {
    notFound();
  }

  return (
    <div style={{ paddingTop: "var(--header-height)", minHeight: "100vh" }}>
      <div className="container">
        <ProductDetailClient product={product} />
      </div>
    </div>
  );
}
export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}
