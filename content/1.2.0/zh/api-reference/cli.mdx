# CLI 命令

Hanflow 提供完整的命令行工具，覆盖工作流编写、运行管理、HITL 审批和检查。

```bash
pip install hanflow          # 或: uv add hanflow
hanflow --help               # 列出所有命令
```

## 工作流编写

| 命令 | 说明 |
| --- | --- |
| `hanflow new --name wf --mode static` | 从模板创建工作流（`static`、`dynamic`、`hybrid`） |
| `hanflow validate workflow.yaml` | 校验工作流 YAML 是否符合 DSL 规范 |
| `hanflow compile workflow.yaml` | 编译为 LangGraph 图（dry-run；报告入口和出口节点） |

## 运行

| 命令 | 说明 |
| --- | --- |
| `hanflow run workflow.yaml` | 本地运行工作流（默认使用 FakeProvider） |
| `hanflow serve --host 0.0.0.0 --port 8000` | 启动 HTTP API + Web Studio 后端 |

以下依赖服务器的命令需要 `hanflow serve` 正在运行。设置 `HANFLOW_BASE_URL` 指向服务器（默认：`http://localhost:8000`）。

## 运行管理

| 命令 | 说明 |
| --- | --- |
| `hanflow runs` | 列出最近的运行 |
| `hanflow status <run_id>` | 查看运行状态和结果 |
| `hanflow cancel <run_id>` | 取消运行 |
| `hanflow logs <run_id>` | 轮询运行状态直到终态（succeeded、failed 或 cancelled） |
| `hanflow trace <run_id>` | 查看运行 trace（注意：trace 数据有限，LocalTraceProvider 尚未接入） |
| `hanflow artifacts <run_id>` | 列出运行产物 |

## HITL 审批

| 命令 | 说明 |
| --- | --- |
| `hanflow resume <run_id>` | 恢复暂停的运行（approve 的别名） |
| `hanflow approve <run_id>` | 批准 HITL 门控 |
| `hanflow edit <run_id> --value <new_value>` | 编辑 HITL 门控（需要 `--value`） |
| `hanflow reject <run_id> --reason <text>` | 拒绝 HITL 门控（需要 `--reason`） |
| `hanflow reroute <run_id> --target <node_id>` | 重路由 HITL 门控（需要 `--target`） |

所有 HITL 命令支持 `--by <user>` 指定决策者（默认：`cli`）。

## 本地检查

| 命令 | 说明 |
| --- | --- |
| `hanflow tools` | 列出可用的 MCP 工具 |
| `hanflow tools --server <name>` | 列出指定 MCP server 的工具 |
| `hanflow config` | 以 JSON 格式显示解析后的配置 |
| `hanflow doctor` | 健康检查：配置有效性、后端可达性 |
| `hanflow index <store> <path>` | 将文档索引到检索存储 |

## 尚未可用

以下命令已存在但后端尚未实现。它们会输出明确的"尚未支持"信息：

| 命令 | 状态 |
| --- | --- |
| `hanflow metrics <run_id>` | 指标聚合未接入（`RunResult.usage` 未填充） |
| `hanflow search <query>` | 检索未配置；先使用 `hanflow index` |
| `hanflow eval` | 评测框架尚未实现 |
| `hanflow datasets` | 评测框架尚未实现 |
| `hanflow worker` | 多 worker 模式尚不可用；请使用 `hanflow serve` |
