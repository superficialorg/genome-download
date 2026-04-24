export type TierSlug =
  | "snp"
  | "snp-imputed"
  | "wgs-30x"
  | "wgs-100x"
  | "convert";

export type Product = {
  slug: TierSlug;
  name: string;
  priceCents: number;
  priceLabel: string;
  description: string;
  stripeProductId?: string;
  popular?: boolean;
  /**
   * Digital products skip shipping address collection and deliver by email.
   */
  kind?: "kit" | "digital";
};

export const PRODUCTS: Record<TierSlug, Product> = {
  snp: {
    slug: "snp",
    name: "Raw SNP genotype",
    priceCents: 9900,
    priceLabel: "$99",
    description:
      "~700K measured variants. Comparable to consumer genotyping kits. Ships as a .genome bundle with the readmygenome.md Claude skill. 1 week lab turnaround. VCF on request.",
    stripeProductId: "prod_UMadBTHvuZE0Ta",
  },
  "snp-imputed": {
    slug: "snp-imputed",
    name: "SNP + imputed genome",
    priceCents: 12900,
    priceLabel: "$129",
    description:
      "~23M variants via statistical imputation from your SNP data. Expanded coverage beyond standard genotyping. Ships as a .genome bundle with the readmygenome.md Claude skill. 1 week lab turnaround. VCF on request.",
    stripeProductId: "prod_UMakmwJOGjbHuZ",
  },
  "wgs-30x": {
    slug: "wgs-30x",
    name: "Whole genome, 30x",
    priceCents: 59900,
    priceLabel: "$599",
    description:
      "Standard-depth whole genome sequencing. ~4–5M variants including SNVs and indels. Ships as a .genome bundle with the readmygenome.md Claude skill. 4-6 weeks lab turnaround. VCF, BAM, and FASTQ on request.",
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
    stripeProductId: "prod_UMaoDyJYIUROWI",
  },
  convert: {
    slug: "convert",
    name: ".genome conversion",
    priceCents: 5900,
    priceLabel: "$59",
    description:
      "Convert any existing DNA file into a .genome bundle. We'll send you a secure upload link after order and deliver your .genome bundle and readmygenome.md file within 48 hours.",
    stripeProductId: "prod_UOJNA3QUw0tYXk",
    kind: "digital",
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
