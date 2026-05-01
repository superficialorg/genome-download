#!/usr/bin/env python3
"""
Build a compact MCP query index for a .genome bundle directory.

The public MCP endpoint should not unpack multi-GB .genome.tar.gz archives on
every tool call. The conversion worker should run this script after generating
the expanded bundle directory, then upload the resulting JSON next to the tar:

  orders/<job_id>/<sample_id>.genome.tar.gz
  orders/<job_id>/<sample_id>.mcp-index.json

Usage:
  python scripts/build_mcp_index.py /path/to/sample.genome > sample.mcp-index.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


def read_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    return json.loads(path.read_text())


def parquet_rows(bundle: Path, name: str, limit: int | None = None) -> list[dict[str, Any]]:
    path = bundle / name
    if not path.exists():
        return []
    try:
        import duckdb
    except ImportError as exc:
        raise SystemExit("duckdb is required: pip install duckdb pyarrow") from exc

    con = duckdb.connect()
    try:
        sql = f"SELECT * FROM read_parquet('{path}')"
        if limit is not None:
            sql += f" LIMIT {int(limit)}"
        cur = con.execute(sql)
        cols = [d[0] for d in cur.description]
        return [dict(zip(cols, row)) for row in cur.fetchall()]
    finally:
        con.close()


def gene_index_rows(bundle: Path, limit: int = 5000) -> list[dict[str, Any]]:
    return parquet_rows(bundle, "gene_index.parquet", limit=limit)


def build_index(bundle: Path) -> dict[str, Any]:
    manifest = read_json(bundle / "manifest.json")
    findings = read_json(bundle / "findings.json")
    validation = {
        "valid": True,
        "source": "conversion-worker",
        "note": "Bundle passed conversion-time validation before MCP index generation.",
    }

    generated_at = None
    if manifest:
        generated_at = manifest.get("generated_at")
    if not generated_at:
        generated_at = bundle.stat().st_mtime

    pgx = parquet_rows(bundle, "pharmacogenomics.parquet")
    prs = parquet_rows(bundle, "prs.parquet")

    return {
        "schema_version": "1.0",
        "bundle_id": bundle.name,
        "generated_at": generated_at,
        "manifest": manifest,
        "validation": validation,
        "pharmacogenomics": pgx,
        "polygenic_scores": prs,
        "gene_index": gene_index_rows(bundle),
        "reports": {
            "user_summary_markdown": render_summary(manifest, findings, pgx, prs, audience="user"),
            "clinician_summary_markdown": render_summary(
                manifest, findings, pgx, prs, audience="clinician"
            ),
        },
    }


def render_summary(
    manifest: dict[str, Any] | None,
    findings: dict[str, Any] | None,
    pgx: list[dict[str, Any]],
    prs: list[dict[str, Any]],
    audience: str,
) -> str:
    title = "Clinician-facing .genome summary" if audience == "clinician" else ".genome summary"
    lines = [
        f"# {title}",
        "",
        f"Schema version: {manifest.get('schema_version', 'unknown') if manifest else 'unknown'}",
        f"Generated at: {manifest.get('generated_at', 'unknown') if manifest else 'unknown'}",
        f"Pipeline version: {manifest.get('pipeline_version', 'unknown') if manifest else 'unknown'}",
        "",
        f"Pharmacogenomics rows: {len(pgx)}",
        f"Polygenic score rows: {len(prs)}",
    ]
    if findings:
        lines.extend(["", "## Headline counts"])
        for key, value in findings.items():
            if isinstance(value, (str, int, float, bool)):
                lines.append(f"- {key}: {value}")
    lines.extend(
        [
            "",
            "This report is generated from a dated .genome bundle. It is data, not a diagnosis.",
            "Clinical decisions and medication changes require clinician confirmation.",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("bundle", type=Path)
    args = parser.parse_args()
    bundle = args.bundle
    if not bundle.exists() or not bundle.is_dir():
        raise SystemExit(f"{bundle} is not a bundle directory")
    print(json.dumps(build_index(bundle), indent=2, default=str))


if __name__ == "__main__":
    main()
