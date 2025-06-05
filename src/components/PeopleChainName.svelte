<script lang="ts">
	import type { Binary } from 'polkadot-api';
	import { names, peopleApi } from '../utils/people';
	import { currentBlockchain } from './app-bar/blockchains';
	import Checkmark from './common/Checkmark.svg';

	export let address: string;

	let label: string | undefined;
	$: getLabel(address).catch(() => {});

	async function getLabel(address: string) {
		label = undefined;
		const input = address;

		const $peopleApi = await getPeopleApi();

		if ($names[address]) {
			label = $names[address];
			return;
		}

		const result = await $peopleApi.query.Identity.IdentityOf.getValue(address);
		if (!result || address !== input) return;

		const { info } = '0' in result ? result[0] : result;
		const value = info.display.value as Binary | undefined;
		const text = value?.asText();
		if (!text) return;

		label = text.substring(0, 20);
		$names[address] = label;
	}

	async function getPeopleApi() {
		const { id, peopleEndpoints, peopleDescriptorsGetter } = $currentBlockchain;
		const $peopleApi = peopleApi.get(id);
		if ($peopleApi) {
			return $peopleApi;
		}

		$names = {};
		const { createPeopleTypedApi } = await import('../utils/createPeopleTypedApi');
		const $newPeopleApi = await createPeopleTypedApi(
			peopleEndpoints as string[] | undefined,
			peopleDescriptorsGetter
		);
		peopleApi.set(id, $newPeopleApi);
		return $newPeopleApi;
	}
</script>

{#if label !== undefined}
	<img class="w-4 h-4 align-sub inline" src={Checkmark} alt="Account name from People Blockchain" />
	<span>{label}</span>
{:else}
	<slot />
{/if}
