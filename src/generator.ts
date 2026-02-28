import type { ProjectConfig } from './types.ts'

import { fetch_buffer, read_url_to_str, select_array } from '#self'
import { Spinner } from '@std/cli/unstable-spinner'
import { green, red } from '@std/fmt/colors'
import { join, toFileUrl } from '@std/path'

import { TEMPLATE_TYPES } from './types.ts'

/**
 * 根据配置生成项目文件
 */
export async function generate_project(config: ProjectConfig): Promise<void> {
	const { project_name, folder_name, template_type, need_git, need_lint } = config
	const task_stack: Array<Promise<unknown>> = []
	const basic_dir = new URL(`${folder_name}/`, toFileUrl(join(Deno.cwd(), '/')))

	const spinner = new Spinner({ message: 'Creating...', color: 'yellow' })
	spinner.start()

	try {
		// mkdir
		await Deno.mkdir(basic_dir)

		// insert git
		if (need_git) {
			task_stack.push(
				Deno.writeFile(
					new URL(`.gitignore`, basic_dir),
					await fetch_buffer(new URL('../templates/gitgit/gitignore', import.meta.url)),
					{ create: true, append: false }
				)
			)
			task_stack.push(
				(async () => {
					try {
						await new Deno.Command('git', {
							args: ['init'],
							cwd: join(Deno.cwd(), folder_name),
						}).output()
					} catch (_) {
						console.error(red('Git init failed, please check if git is installed'))
					}
				})()
			)
		}

		// insert biome
		if (need_lint) {
			task_stack.push(
				Deno.writeFile(
					new URL(`biome.jsonc`, basic_dir),
					await fetch_buffer(new URL('../templates/lint/biome.jsonc', import.meta.url)),
					{ create: true, append: false }
				)
			)
		}

		// insert readme
		task_stack.push(
			Deno.writeFile(
				new URL(`README.md`, basic_dir),
				await fetch_buffer(new URL('../templates/tep/README.md', import.meta.url)),
				{ create: true, append: false }
			)
		)

		// insert main.ts / mod.ts
		if (template_type === TEMPLATE_TYPES[0]) {
			task_stack.push(
				Deno.writeFile(
					new URL(`main.ts`, basic_dir),
					await fetch_buffer(new URL('../templates/tep/main.ts', import.meta.url)),
					{ create: true, append: false }
				)
			)
		} else if (template_type === TEMPLATE_TYPES[1]) {
			task_stack.push(
				Deno.writeFile(
					new URL(`mod.ts`, basic_dir),
					await fetch_buffer(new URL('../templates/tep/mod.ts', import.meta.url)),
					{ create: true, append: false }
				)
			)
		}

		// insert dist
		if (select_array(TEMPLATE_TYPES, [0, 1, 2]).includes(template_type)) {
			await Deno.mkdir(new URL(`dist/`, basic_dir))
		}

		// insert test
		if (select_array(TEMPLATE_TYPES, [0, 1, 3]).includes(template_type)) {
			await Deno.mkdir(new URL(`test/`, basic_dir))
			task_stack.push(
				Deno.writeFile(
					new URL(`test/demo.test.ts`, basic_dir),
					await fetch_buffer(new URL('../templates/tep/demo.test.ts', import.meta.url)),
					{ create: true, append: false }
				)
			)
		}

		// insert lib
		if (select_array(TEMPLATE_TYPES, [0, 1, 3]).includes(template_type)) {
			await Deno.mkdir(new URL(`lib/`, basic_dir))
			using modts = await Deno.create(new URL(`lib/mod.ts`, basic_dir))
			await modts.write(new TextEncoder().encode(`/** @module */`))
			using internalts = await Deno.create(new URL(`lib/internal.ts`, basic_dir))
			await internalts.write(new TextEncoder().encode(`/** @internal */`))
		}

		// insert src
		if (select_array(TEMPLATE_TYPES, [1, 3]).includes(template_type)) {
			await Deno.mkdir(new URL(`src/`, basic_dir))
		}

		// insert deno.json
		if (select_array(TEMPLATE_TYPES, [0, 1, 2, 3]).includes(template_type)) {
			const fname_map: Record<string, string> = {
				[TEMPLATE_TYPES[0]]: 'bin',
				[TEMPLATE_TYPES[1]]: 'lib',
				[TEMPLATE_TYPES[2]]: 'wsp',
				[TEMPLATE_TYPES[3]]: 'mono',
			}
			const json_url = new URL(
				`../templates/tep/deno.${fname_map[template_type]}.json`,
				import.meta.url
			)
			task_stack.push(
				(async () => {
					const json_str = (await read_url_to_str(json_url)).replaceAll('ZWF', project_name)
					await Deno.writeTextFile(new URL(`deno.json`, basic_dir), json_str)
				})()
			)
		}

		// insert .vscode
		if (select_array(TEMPLATE_TYPES, [0, 1, 2]).includes(template_type)) {
			await Deno.mkdir(new URL(`.vscode/`, basic_dir))
			task_stack.push(
				Deno.writeFile(
					new URL(`.vscode/launch.json`, basic_dir),
					await fetch_buffer(new URL('../templates/tep/vscode.launch.json', import.meta.url)),
					{ create: true, append: false }
				)
			)

			task_stack.push(
				(async () => {
					const settings = JSON.parse(
						await read_url_to_str(new URL('../templates/tep/vscode.settings.json', import.meta.url))
					)
					if (!need_lint) settings['biome.enabled'] = undefined
					await Deno.writeTextFile(
						new URL(`.vscode/settings.json`, basic_dir),
						JSON.stringify(settings, null, 2),
						{ create: true }
					)
				})()
			)

			task_stack.push(
				(async () => {
					const extensions = JSON.parse(
						await read_url_to_str(
							new URL('../templates/tep/vscode.extensions.json', import.meta.url)
						)
					)
					if (!need_lint) extensions.recommendations = ['denoland.vscode-deno']
					await Deno.writeTextFile(
						new URL(`.vscode/extensions.json`, basic_dir),
						JSON.stringify(extensions, null, 2),
						{ create: true }
					)
				})()
			)
		}

		await Promise.all(task_stack)
		spinner.stop()
		console.log(green('! Project Created !'))
	} catch (e) {
		spinner.stop()
		console.error(red('Creation failed:'), e)
		throw e
	}
}
