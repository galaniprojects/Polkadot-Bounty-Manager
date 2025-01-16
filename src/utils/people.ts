import { get, writable } from 'svelte/store';
import { type Binary } from 'polkadot-api';
import { type createPeopleTypedApi } from './createPeopleTypedApi';

const peopleApi = writable<undefined | ReturnType<typeof createPeopleTypedApi>>();

export async function getPeopleChainName(address: string | undefined) {
	if (!address) return;

	if (!get(peopleApi)) {
		const { createPeopleTypedApi } = await import('./createPeopleTypedApi');
		peopleApi.set(createPeopleTypedApi());
	}
	const api = get(peopleApi);
	if (!api) return;

	const result = await api.query.Identity.IdentityOf.getValue(address);
	if (!result) return;

	const value = result[0].info.display.value as Binary | undefined;
	const text = value?.asText();
	if (!text) return;

	return text.substring(0, 20);
}
