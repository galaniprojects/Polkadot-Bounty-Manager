import { dotApi } from '../stores';
import { endpoints } from '../utils/endpoints';
import { get } from 'svelte/store';

export async function load() {
	if (typeof window !== 'undefined' && typeof get(dotApi) === 'undefined') {
		// in browser create the API before rendering page contents
		const { createTypedApi } = await import('../utils/createTypedApi');
		dotApi.set(createTypedApi(endpoints));
	}

	return {};
}
