/** @module */
import { red } from '@std/fmt/colors'

import { ErrorMsg } from '@/types.ts'

/**
 * 获取远程资源的 ReadableStream
 */
export async function fetch_buffer(url: URL): Promise<ReadableStream<Uint8Array>> {
	const res = await fetch(url)
	if (!res.body) {
		console.log(red(`Fetch ${url.href} Error`))
		Deno.exit(1)
	}
	return res.body
}

/**
 * 读取远程资源并转换为字符串
 */
export async function read_url_to_str(url: URL): Promise<string> {
	return await new Response(await fetch_buffer(url)).text()
}

/**
 * 校验并解析项目名称
 * @param name 用户输入的名称
 * @returns 解析后的项目名和文件夹名，或者错误信息
 */
export async function check_name(
	name: string
): Promise<{ project: string; folder: string } | string> {
	const trimmed_name = name.trim()
	if (trimmed_name === '') return ErrorMsg.EMPTY_NAME

	const parts = trimmed_name.split('/')
	if (parts.length > 2 || parts.some(p => p === '')) return ErrorMsg.ILLEGAL_NAME

	const target_folder = parts.length === 2 ? parts[1] : parts[0]

	try {
		await Deno.stat(`./${target_folder}/`)
		return ErrorMsg.HAS_DIR
	} catch (_) {
		return { project: trimmed_name, folder: target_folder }
	}
}

/**
 * 简单的数组筛选工具
 */
export function select_array<T>(arr: readonly T[], indexes: number[]): T[] {
	return indexes.map(i => arr[i])
}
