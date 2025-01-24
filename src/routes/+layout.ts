import { dotApi } from '../stores';
import { endpoints } from '../utils/endpoints';
import { get } from 'svelte/store';
import { initializeApi } from '../utils/initializeApi';

export async function load() {
	if (typeof window !== 'undefined' && typeof get(dotApi) === 'undefined') {
		// in browser create the API before rendering page contents
		await initializeApi(endpoints);
	}

	return {};
}
