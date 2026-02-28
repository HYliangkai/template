import { check_name, select_array } from '#self'
import { assertEquals } from '@std/assert'

import { ErrorMsg } from '@/types.ts'

Deno.test('checkName - empty name', async () => {
	const result = await check_name('')
	assertEquals(result, ErrorMsg.EMPTY_NAME)
})

Deno.test('checkName - illegal name (too many slashes)', async () => {
	const result = await check_name('a/b/c')
	assertEquals(result, ErrorMsg.ILLEGAL_NAME)
})

Deno.test('checkName - illegal name (leading/trailing slash)', async () => {
	assertEquals(await check_name('/a'), ErrorMsg.ILLEGAL_NAME)
	assertEquals(await check_name('a/'), ErrorMsg.ILLEGAL_NAME)
})

Deno.test('checkName - valid simple name', async () => {
	// Assuming 'test_folder_unique' doesn't exist
	const result = await check_name('test_folder_unique')
	if (typeof result !== 'string') {
		assertEquals(result.project, 'test_folder_unique')
		assertEquals(result.folder, 'test_folder_unique')
	}
})

Deno.test('checkName - valid scoped name', async () => {
	const result = await check_name('@scope/my-project')
	if (typeof result !== 'string') {
		assertEquals(result.project, '@scope/my-project')
		assertEquals(result.folder, 'my-project')
	}
})

Deno.test('selectArray - correctly filters', () => {
	const arr = ['a', 'b', 'c', 'd']
	const result = select_array(arr, [0, 2])
	assertEquals(result, ['a', 'c'])
})
