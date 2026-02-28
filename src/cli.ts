import type { ProjectConfig, TemplateType } from './types.ts'

import { check_name } from '#self'
import { parseArgs } from '@std/cli/parse-args'
import { bgCyan, blue, cyan, green, red, rgb8, stripAnsiCode, yellow } from '@std/fmt/colors'

import { TEMPLATE_TYPES } from './types.ts'
import { Confirm, Input, Select } from '@cliffy/prompt'

const TEMPLATE_INDEX_REGEX = /^[0-3]$/

/**
 * 解析并交互式获取项目配置
 */
export async function parse_project_config(): Promise<ProjectConfig> {
	const args = parseArgs(Deno.args, {
		alias: { name: 'n', template: 't', git: 'g', lint: 'l', open: 'o', help: 'h' },
		boolean: ['help'],
		string: ['name', 'template'],
	})

	if (args.help) {
		show_help()
		Deno.exit(0)
	}

	const template_type = await get_template_type(args.template as string | undefined)
	const { project: project_name, folder: folder_name } = await get_project_names(
		args.name as string | undefined
	)

	const need_git =
		template_type === TEMPLATE_TYPES[3]
			? false
			: ((args.git as boolean | undefined) ??
				(await Confirm.prompt({ message: blue('Git Repository'), default: true })))

	const need_lint =
		template_type === TEMPLATE_TYPES[3]
			? false
			: ((args.lint as boolean | undefined) ??
				(await Confirm.prompt({ message: red('Use Biome'), default: true })))

	const need_open =
		(args.open as boolean | undefined) ??
		(await Confirm.prompt({ message: bgCyan('VScode Open'), default: true }))

	return { project_name, folder_name, template_type, need_git, need_lint, need_open }
}

function show_help(): void {
	console.log(`
${bgCyan(' @chzkyli/template ')}

用法:
  deno run -A jsr:@chzkyli/template [选项]

选项:
  -n, --name      项目名称 (例如: my-project 或 @scope/my-project)
  -t, --template  模板类型 (0-3 或 模板名称)
  -g, --git       是否初始化 Git 仓库
  -l, --lint      是否使用 Biome 进行 Lint
  -o, --open      是否在 VSCode 中打开
  -h, --help      显示帮助信息

模板名称:
  0: Deno Basic-Bin
  1: Deno Basic-Lib
  2: Deno Workspace
  3: Deno Monorepo
`)
}

async function get_template_type(arg_template?: string): Promise<TemplateType> {
	if (arg_template) {
		if (TEMPLATE_INDEX_REGEX.test(arg_template)) {
			return TEMPLATE_TYPES[Number.parseInt(arg_template, 10)]
		}
		if (TEMPLATE_TYPES.includes(arg_template as TemplateType)) {
			return arg_template as TemplateType
		}
	}

	return stripAnsiCode(
		await Select.prompt({
			message: 'Template Select',
			options: [
				rgb8(TEMPLATE_TYPES[0], 180),
				green(TEMPLATE_TYPES[1]),
				yellow(TEMPLATE_TYPES[2]),
				blue(TEMPLATE_TYPES[3]),
			],
			default: TEMPLATE_TYPES[0],
		})
	) as TemplateType
}

async function get_project_names(arg_name?: string): Promise<{ project: string; folder: string }> {
	if (arg_name) {
		const res = await check_name(arg_name)
		if (typeof res !== 'string') return res
		console.error(red(`参数错误: ${res}`))
	}

	for (;;) {
		const name = (
			await Input.prompt({
				message: cyan('Project Name'),
				default: 'demo',
				minLength: 1,
				maxLength: 255,
			})
		).trim()

		const res = await check_name(name)
		if (typeof res === 'string') {
			console.error(yellow(res))
			continue
		}
		return res
	}
}
