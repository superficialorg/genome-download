export type TierSlug =
  | "snp"
  | "snp-imputed"
  | "wgs-1x"
  | "wgs-30x"
  | "wgs-100x";

export type Product = {
  slug: TierSlug;
  name: string;
  priceCents: number;
  priceLabel: string;
  description: string;
  stripePriceId: string;
};

export const PRODUCTS: Record<TierSlug, Product> = {
  snp: {
    slug: "snp",
    name: "Raw SNP genotype",
    priceCents: 6900,
    priceLabel: "$69",
    description:
      "700K variants. Comparable to 23andMe coverage. Delivered as a VCF file.",
    stripePriceId: process.env.STRIPE_PRICE_SNP ?? "TODO_STRIPE_PRICE_SNP",
  },
  "snp-imputed": {
    slug: "snp-imputed",
    name: "SNP + imputed genome",
    priceCents: 8900,
    priceLabel: "$89",
    description:
      "23M variants via statistical imputation. Delivered as a VCF file.",
    stripePriceId:
      process.env.STRIPE_PRICE_SNP_IMPUTED ?? "TODO_STRIPE_PRICE_SNP_IMPUTED",
  },
  "wgs-1x": {
    slug: "wgs-1x",
    name: "Whole genome, 1x",
    priceCents: 9900,
    priceLabel: "$99",
    description:
      "Low-coverage whole genome sequencing. Imputation-friendly. Delivered as a VCF file.",
    stripePriceId: process.env.STRIPE_PRICE_WGS_1X ?? "TODO_STRIPE_PRICE_WGS_1X",
  },
  "wgs-30x": {
    slug: "wgs-30x",
    name: "Whole genome, 30x",
    priceCents: 14900,
    priceLabel: "$149",
    description:
      "Full genome sequencing. Delivered as a VCF file — BAM and FASTQ available on request.",
    stripePriceId:
      process.env.STRIPE_PRICE_WGS_30X ?? "TODO_STRIPE_PRICE_WGS_30X",
  },
  "wgs-100x": {
    slug: "wgs-100x",
    name: "Whole genome, 100x",
    priceCents: 19900,
    priceLabel: "$199",
    description:
      "Research-grade depth. Delivered as a VCF file — BAM and FASTQ available on request.",
    stripePriceId:
      process.env.STRIPE_PRICE_WGS_100X ?? "TODO_STRIPE_PRICE_WGS_100X",
  },
};

export const PRODUCT_LIST: Product[] = [
  PRODUCTS["snp"],
  PRODUCTS["snp-imputed"],
  PRODUCTS["wgs-1x"],
  PRODUCTS["wgs-30x"],
  PRODUCTS["wgs-100x"],
];

export function isTierSlug(value: string): value is TierSlug {
  return value in PRODUCTS;
}
