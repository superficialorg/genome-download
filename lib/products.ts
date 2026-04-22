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
      "~700K measured variants. Comparable to consumer genotyping kits. Ships as a .genome bundle with the readmygenome.md Claude skill. 1 week lab turnaround. VCF on request.",
    stripePriceId: process.env.STRIPE_PRICE_SNP ?? "TODO_STRIPE_PRICE_SNP",
    stripeProductId: "prod_UMadBTHvuZE0Ta",
  },
  "snp-imputed": {
    slug: "snp-imputed",
    name: "SNP + imputed genome",
    priceCents: 12900,
    priceLabel: "$129",
    description:
      "~23M variants via statistical imputation from your SNP data. Expanded coverage beyond standard genotyping. Ships as a .genome bundle with the readmygenome.md Claude skill. 1 week lab turnaround. VCF on request.",
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
      "Standard-depth whole genome sequencing. ~4–5M variants including SNVs and indels. Ships as a .genome bundle with the readmygenome.md Claude skill. 4-6 weeks lab turnaround. VCF, BAM, and FASTQ on request.",
    stripePriceId:
      process.env.STRIPE_PRICE_WGS_30X ?? "TODO_STRIPE_PRICE_WGS_30X",
    stripeProductId: "prod_UMaosHtOSO6ATY",
    popular: true,
  },
  "wgs-100x": {
    slug: "wgs-100x",
    name: "Whole genome, 100x",
    priceCents: 149900,
    priceLabel: "$1,499",
    description:
      "High-depth sequencing. Higher confidence for low-frequency and structural variants. Suitable for research workflows. Ships as a .genome bundle with the readmygenome.md Claude skill. 4-6 weeks lab turnaround. VCF, BAM, and FASTQ on request.",
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
