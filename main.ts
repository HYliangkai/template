import { red } from '@std/fmt/colors'
import { join } from '@std/path'

import { parse_project_config } from '@/cli.ts'
import { generate_project } from '@/generator.ts'
import { check_update } from '@/update.ts'

import deno_json from './deno.json' with { type: 'json' }

async function main(): Promise<void> {
	const update_promise = check_update(deno_json.version)
	try {
		const config = await parse_project_config()
		await generate_project(config)

		if (config.need_open) {
			const { success } = await new Deno.Command('code', {
				args: [join(Deno.cwd(), config.folder_name)],
			}).output()
			if (!success) console.error(red('Open Failed'))
		}

		const update_msg = await update_promise
		if (update_msg) console.log(update_msg)
	} catch (e) {
		if (e instanceof Error && e.name === 'PermissionDenied') {
			console.error(red('Error: Permission denied. Please check your file system permissions.'))
		} else {
			// Specific errors are handled inside generators/cli, others might be cancellation
		}
	}
}

if (import.meta.main) {
	main()
}
