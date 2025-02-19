<script lang="ts">
	import {
		activeAccount,
		activeAccountBounties,
		walletConnect as wcConnection
	} from '../../stores';
	import { onMount } from 'svelte';

	let open = false;
	let container: HTMLDivElement | null = null;

	$: {
		if (open) {
			window.addEventListener('click', closeMenuOnOutsideClick);
		} else {
			window.removeEventListener('click', closeMenuOnOutsideClick);
		}
	}

	async function logOut() {
		activeAccount.set(undefined);
		sessionStorage.clear();
		activeAccountBounties.set([]);
		if ($wcConnection) {
			await $wcConnection.disconnect();
		}
		open = false;
	}

	function closeMenuOnOutsideClick(event: MouseEvent) {
		if (!container?.contains(event.target as Node)) {
			open = false;
		}
	}

	onMount(() => {
		return () => {
			window.removeEventListener('click', closeMenuOnOutsideClick);
		};
	});
</script>

<div bind:this={container} class="relative">
	<!-- Burger Menu Icon -->
	<button
		on:click={() => {
			open = !open;
		}}
	>
		<span class="material-symbols-rounded text-textPrimary"> menu </span>
	</button>

	<!-- Menu Overlay -->
	{#if open}
		<div class="flex justify-center fixed inset-0 w-screen z-10 bg-black bg-opacity-60"></div>
		<div
			class="absolute top-0 right-0 flex flex-col items-start z-20 bg-backgroundApp border shadow-lg p-2.5 rounded-md w-[210px]"
		>
			<button
				on:click={() => {
					open = false;
				}}
				class="self-end mr-2.5 mb-1"
			>
				<span class="material-symbols-rounded text-textPrimary"> close </span>
			</button>
			<a
				on:click={() => {
					open = false;
				}}
				href="/bounty-setup"
				class="bg-backgroundBounty text-textPrimary p-2.5 mb-2 rounded-md w-[189px] flex justify-between items-center"
			>
				<span class="mt-1">Create new bounty</span>
				<span class="material-symbols-rounded"> add </span>
			</a>
			<button
				on:click={logOut}
				class="text-textPrimary p-2.5 rounded-md w-[189px] flex justify-between items-center"
			>
				<span class="mt-1">Log out</span>
				<span class="material-symbols-rounded"> logout </span>
			</button>
		</div>
	{/if}
</div>
