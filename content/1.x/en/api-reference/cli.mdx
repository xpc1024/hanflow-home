# CLI Commands

Hanflow ships with a full command-line interface for workflow authoring, run management, HITL approval, and inspection.

```bash
pip install hanflow          # or: uv add hanflow
hanflow --help               # list all commands
```

## Authoring

| Command | Description |
| --- | --- |
| `hanflow new --name wf --mode static` | Scaffold a workflow from a template (`static`, `dynamic`, `hybrid`) |
| `hanflow validate workflow.yaml` | Validate a workflow YAML against the DSL schema |
| `hanflow compile workflow.yaml` | Compile to a LangGraph graph (dry-run; reports entry and exit nodes) |

## Running

| Command | Description |
| --- | --- |
| `hanflow run workflow.yaml` | Run a workflow locally (uses FakeProvider by default) |
| `hanflow serve --host 0.0.0.0 --port 8000` | Start the HTTP API + Web Studio backend |

Server-dependent commands below require `hanflow serve` to be running. Set `HANFLOW_BASE_URL` to point to the server (default: `http://localhost:8000`).

## Run Management

| Command | Description |
| --- | --- |
| `hanflow runs` | List recent runs |
| `hanflow status <run_id>` | Show run status and result |
| `hanflow cancel <run_id>` | Cancel a run |
| `hanflow logs <run_id>` | Poll run status until terminal (succeeded, failed, or cancelled) |
| `hanflow trace <run_id>` | Render a run trace (note: trace data is limited until LocalTraceProvider is wired) |
| `hanflow artifacts <run_id>` | List run artifacts |

## HITL Approval

| Command | Description |
| --- | --- |
| `hanflow resume <run_id>` | Resume a paused run (alias for approve) |
| `hanflow approve <run_id>` | Approve a HITL gate |
| `hanflow edit <run_id> --value <new_value>` | Edit a HITL gate (requires `--value`) |
| `hanflow reject <run_id> --reason <text>` | Reject a HITL gate (requires `--reason`) |
| `hanflow reroute <run_id> --target <node_id>` | Reroute a HITL gate (requires `--target`) |

All HITL commands accept `--by <user>` to record the decision maker (default: `cli`).

## Local Inspection

| Command | Description |
| --- | --- |
| `hanflow tools` | List available MCP tools |
| `hanflow tools --server <name>` | List tools from a specific MCP server |
| `hanflow config` | Show resolved configuration as JSON |
| `hanflow doctor` | Health check: config valid, backends reachable |
| `hanflow index <store> <path>` | Index documents into a retrieval store |

## Not Yet Available

The following commands exist but their backend is not yet implemented. They print a clear "not yet supported" message:

| Command | Status |
| --- | --- |
| `hanflow metrics <run_id>` | Metrics aggregation not wired (`RunResult.usage` not populated) |
| `hanflow search <query>` | Retrieval not configured; use `hanflow index` first |
| `hanflow eval` | Eval framework not yet implemented |
| `hanflow datasets` | Eval framework not yet implemented |
| `hanflow worker` | Multi-worker mode not yet available; use `hanflow serve` |
