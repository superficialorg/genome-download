export type TierSlug =
  | "snp"
  | "snp-imputed"
  | "wgs-30x"
  | "wgs-100x";

export type Product = {
  slug: TierSlug;
  name: string;
  priceCents: number;
  priceLabel: string;
  description: string;
  stripePriceId: string;
  stripeProductId?: string;
  popular?: boolean;
};

export const PRODUCTS: Record<TierSlug, Product> = {
  snp: {
    slug: "snp",
    name: "Raw SNP genotype",
    priceCents: 9900,
    priceLabel: "$99",
    description:
      "~700K measured variants. Comparable to consumer genotyping kits. Delivered as a VCF file in 1 week.",
    stripePriceId: process.env.STRIPE_PRICE_SNP ?? "TODO_STRIPE_PRICE_SNP",
    stripeProductId: "prod_UMadBTHvuZE0Ta",
  },
  "snp-imputed": {
    slug: "snp-imputed",
    name: "SNP + imputed genome",
    priceCents: 12900,
    priceLabel: "$129",
    description:
      "~23M variants via statistical imputation from your SNP data. Expanded coverage beyond standard genotyping. Delivered as a VCF file in 1 week.",
    stripePriceId:
      process.env.STRIPE_PRICE_SNP_IMPUTED ?? "TODO_STRIPE_PRICE_SNP_IMPUTED",
    stripeProductId: "prod_UMakmwJOGjbHuZ",
  },
  "wgs-30x": {
    slug: "wgs-30x",
    name: "Whole genome, 30x",
    priceCents: 59900,
    priceLabel: "$599",
    description:
      "Standard-depth whole genome sequencing. ~4–5M variants including SNVs and indels. Delivered as a VCF file in 1 week. BAM and FASTQ available on request.",
    stripePriceId:
      process.env.STRIPE_PRICE_WGS_30X ?? "TODO_STRIPE_PRICE_WGS_30X",
    stripeProductId: "prod_UMaosHtOSO6ATY",
    popular: true,
  },
  "wgs-100x": {
    slug: "wgs-100x",
    name: "Whole genome, 100x",
    priceCents: 99900,
    priceLabel: "$999",
    description:
      "High-depth sequencing for research and advanced use cases. Higher confidence for low-frequency and structural variants. Delivered as a VCF file. BAM and FASTQ available.",
    stripePriceId:
      process.env.STRIPE_PRICE_WGS_100X ?? "TODO_STRIPE_PRICE_WGS_100X",
    stripeProductId: "prod_UMaoDyJYIUROWI",
  },
};

export const PRODUCT_LIST: Product[] = [
  PRODUCTS["snp"],
  PRODUCTS["snp-imputed"],
  PRODUCTS["wgs-30x"],
  PRODUCTS["wgs-100x"],
];

export function isTierSlug(value: string): value is TierSlug {
  return value in PRODUCTS;
}
