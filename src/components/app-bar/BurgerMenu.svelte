<script lang="ts">
	import {
		activeAccount,
		activeAccountBounties,
		walletConnect as wcConnection
	} from '../../stores';
	import { onMount } from 'svelte';
	import modalStyles from '../Modal/Modal.module.css';

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
		sessionStorage.removeItem('account');
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
		<span
			class="material-symbols-rounded items-center rounded-[10px] bg-backgroundButtonLight px-[23px] py-[11px] text-textPrimary"
		>
			menu
		</span>
	</button>

	<!-- Menu Overlay -->
	{#if open}
		<div class={modalStyles.backdrop}></div>
		<div
			class="absolute top-0 right-0 -mt-[11px] flex flex-col items-start z-20 bg-lightGray border shadow-lg p-[5px] rounded-[10px] w-[210px]"
		>
			<button
				on:click={() => {
					open = false;
				}}
				class="self-end mt-[5px] mb-[13px]"
			>
				<span
					class="material-symbols-rounded text-textPrimary rounded-md border border-cloudGray px-[17px] py-1"
				>
					close
				</span>
			</button>
			<a
				on:click={() => {
					open = false;
				}}
				href="/bounty-setup"
				class="bg-accent text-white p-3 mb-2 rounded-[10px] flex w-full justify-between items-center"
			>
				<span class="mt-1">CREATE NEW BOUNTY</span>
			</a>
			<hr class="border-cloudGray my-3 w-full" />

			<button on:click={logOut} class="rounded-md flex space-x-2 items-center mb-2">
				<span class="material-symbols-rounded bg-accent rounded-full p-2 text-white"> logout </span>
				<span class="mt-1">Log out</span>
			</button>
		</div>
	{/if}
</div>
