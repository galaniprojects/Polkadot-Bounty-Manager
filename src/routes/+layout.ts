import { dotApi } from '../stores';
import { endpoints } from '../utils/endpoints';

export async function load() {
	if (typeof window !== 'undefined') {
		// in browser create the API before rendering page contents
		const { createTypedApi } = await import('../utils/createTypedApi');
		dotApi.set(createTypedApi(endpoints));
	}

	return {};
}
