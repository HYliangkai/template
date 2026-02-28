import { cyan, gray, italic, yellow } from '@std/fmt/colors'
import { compare, parse } from '@std/semver'

/**
 * 检查 JSR 上是否有新版本
 * @param current_version 当前版本号
 * @returns 如果有新版本，返回提示信息，否则返回 null
 */
export async function check_update(current_version: string): Promise<string | null> {
	try {
		const res = await fetch('https://jsr.io/@chzkyli/template/meta.json')
		if (!res.ok) return null

		const meta = await res.json()
		const latest_version = meta.latest

		if (!latest_version) return null

		const current = parse(current_version)
		const latest = parse(latest_version)

		if (compare(latest, current) > 0) {
			return `
  ${yellow('✨ A new version of @chzkyli/template is available!')}
  ${gray('current:')} ${current_version}  ${gray('latest:')} ${cyan(latest_version)}

  ${italic('Run to update:')}
  ${cyan('deno install -Ar jsr:@chzkyli/template')}
`
		}
	} catch (_) {
		// 忽略网络错误，不阻塞主流程
	}
	return null
}
