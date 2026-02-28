# @chzkyli/template

[![JSR](https://jsr.io/badges/@chzkyli/template)](https://jsr.io/@chzkyli/template)

`@chzkyli/template` 是一个专为 Deno 项目设计的轻量级、模块化、交互式脚手架工具。它可以帮助开发者快速构建符合规范的项目结构，内置了多种模板以适应不同的开发场景。

## ✨ 特性

- 🚀 **参数化与交互式并存**：既支持快速的交互式问答，也支持通过命令行参数进行全自动化静默配置。
- 📦 **多模板支持**：内置 Deno Basic-Bin, Basic-Lib, Workspace 及 Monorepo 子项目模板。
- 🛠️ **内置最佳实践**：
  - 自动执行 `git init` 并在生成的项目中配置 `.gitignore`。
  - 集成 **Biome** 进行代码格式化和 Lint（可选）。
  - 预配置 **VSCode** 开发环境（调试、扩展建议、项目设置）。
  - 标准化的 `lib/`, `src/`, `test/`, `dist/` 目录结构。
- 🦖 **Deno 原生**：完全基于 Deno 开发，充分利用 JSR 特性与标准库。
- 🔄 **自动更新提醒**：在启动时自动检查 JSR 上的最新版本，确保你始终使用最新的功能与模板。

## 🚀 快速开始

### 方式一：直接运行 (推荐)
无需安装，直接通过 Deno 远程运行：
```bash
deno run -A jsr:@chzkyli/template
```

### 方式二：DenocCreate
```bash
deno create jsr:@chzkyli/template 
```

## 📂 命令行参数

| 参数 | 缩写 | 说明 |
| :--- | :--- | :--- |
| `--name` | `-n` | 项目名称 (支持 `scope/name` 格式) |
| `--template` | `-t` | 模板索引 (0-3) 或模板全名 |
| `--git` | `-g` | 是否初始化 Git 仓库 |
| `--lint` | `-l` | 是否启用 Biome 检查 |
| `--open` | `-o` | 是否在完成后用 VSCode 打开项目 |
| `--help` | `-h` | 显示帮助信息 |

### 模板索引参考
- `0`: **Deno Basic-Bin** (命令行应用)
- `1`: **Deno Basic-Lib** (库开发)
- `2`: **Deno Workspace** (工作区根目录)
- `3`: **Deno Monorepo** (Monorepo 子模块)

## 🛠️ 生成的项目结构

默认生成的项目将包含以下标准化内容：
- `lib/`: 核心逻辑。
  - `mod.ts`: 公开导出入口。
  - `internal.ts`: 内部私有实现。
- `src/`: 业务实现代码。
- `test/`: 单元测试目录 (预置 Deno Standard Assert 示例)。
- `dist/`: 编译/打包产物目录。
- `.vscode/`: IDE 深度定制配置。

## 📝 许可证

[MIT](./LICENSE)
