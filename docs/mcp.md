# Genome Computer MCP

The public MCP endpoint is:

```text
https://mcp.genome.computer/mcp
```

Codex users can connect it with:

```bash
codex mcp add genomeComputer --url https://mcp.genome.computer/mcp
```

The first protected tool call triggers OAuth discovery, dynamic client registration,
email-code sign-in, consent, and token exchange.

## Data model

The MCP server binds an OAuth token to:

- the authenticated customer email
- a default ready `conversion_jobs.id`
- scopes: `genome:read genome:query genome:report`

Ready bundles are discovered from `conversion_jobs`:

```text
status = ready
email = authenticated email
bundle_key is not null
```

## Query index sidecar

Completed bundles are stored as `.genome.tar.gz` archives. The MCP server does
not unpack those archives at request time. Instead, the conversion worker should
upload a compact sidecar JSON next to the archive:

```text
orders/<job_id>/<sample_id>.genome.tar.gz
orders/<job_id>/<sample_id>.mcp-index.json
```

Generate the sidecar from the expanded bundle directory:

```bash
python scripts/build_mcp_index.py /path/to/sample.genome > sample.mcp-index.json
```

The MCP tools use this sidecar for fast, bounded responses.

## Initial tools

- `list_genome_bundles`
- `get_genome_manifest`
- `validate_genome_bundle`
- `get_pgx_profile`
- `query_genome`
- `generate_genome_report`

`query_genome` is intentionally constrained to approved query names in v1:

- `pgx_phenotypes`
- `polygenic_scores`
- `gene_summary`

Raw SQL should wait until there is a dedicated query sandbox.
