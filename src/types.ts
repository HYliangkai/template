export enum ErrorMsg {
	EMPTY_NAME = '项目名称不能为空',
	ILLEGAL_NAME = '项目名称格式非法 (最多允许一个 /)',
	HAS_DIR = '项目同名文件(夹)已存在',
	NO_TEMPLATE_DIR = '模板文件夹不存在',
	COPY_ERROR = '复制模板文件失败',
	MONORREPO_ERROR = '未找到根目录下的deno.json文件',
}

export const TEMPLATE_TYPES = [
	'Deno Basic-Bin',
	'Deno Basic-Lib',
	'Deno Workspace',
	'Deno Monorepo',
] as const

export type TemplateType = (typeof TEMPLATE_TYPES)[number]

export interface ProjectConfig {
	project_name: string
	folder_name: string
	template_type: TemplateType
	need_git: boolean
	need_lint: boolean
	need_open: boolean
}
