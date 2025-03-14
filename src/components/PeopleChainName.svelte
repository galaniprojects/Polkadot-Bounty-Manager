<script lang="ts">
	import type { Binary } from 'polkadot-api';
	import { names, peopleApi } from '../utils/people';
	import Checkmark from './common/Checkmark.svg';

	export let address: string;

	let label: string | undefined;
	$: getLabel(address).catch(() => {});

	async function getLabel(address: string) {
		label = undefined;
		const input = address;

		if (!$peopleApi) {
			const { createPeopleTypedApi } = await import('../utils/createPeopleTypedApi');
			$peopleApi = createPeopleTypedApi();
		}

		if ($names[address]) {
			label = $names[address];
			return;
		}

		const result = await $peopleApi.query.Identity.IdentityOf.getValue(address);
		if (!result || address !== input) return;

		const value = result[0].info.display.value as Binary | undefined;
		const text = value?.asText();
		if (!text) return;

		label = text.substring(0, 20);
		$names[address] = label;
	}
</script>

{#if label !== undefined}
	<img class="w-4 h-4 align-sub inline" src={Checkmark} alt="Account name from People Blockchain" />
	<span>{label}</span>
{:else}
	<slot />
{/if}
