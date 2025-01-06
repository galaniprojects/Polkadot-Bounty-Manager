<script lang="ts">
	import {
		activeAccount,
		activeAccountBounties,
		walletConnect as wcConnection
	} from '../../stores';
	import { onMount } from 'svelte';

	let burgerMenuOpen = false;
	let burgerMenuContainer: HTMLDivElement | null = null;

	function toggleBurgerMenu() {
		burgerMenuOpen = !burgerMenuOpen;

		if (burgerMenuOpen) {
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
		closeBurgerMenu();
	}

	function closeBurgerMenu() {
		burgerMenuOpen = false;
		window.removeEventListener('click', closeMenuOnOutsideClick);
	}

	function closeMenuOnOutsideClick(event: MouseEvent) {
		if (!burgerMenuContainer?.contains(event.target as Node)) {
			closeBurgerMenu();
		}
	}

	onMount(() => {
		return () => {
			window.removeEventListener('click', closeMenuOnOutsideClick);
		};
	});
</script>

<div bind:this={burgerMenuContainer} class="relative">
	<!-- Burger Menu Icon -->
	<button on:click={toggleBurgerMenu}>
		<span class="material-symbols-rounded text-white w-5 h-3"> menu </span>
	</button>

	<!-- Menu Overlay -->
	{#if burgerMenuOpen}
		<div
			class="absolute top-0 right-0 flex flex-col items-start bg-backgroundContent border shadow-lg p-2.5 rounded-md w-[210px]"
		>
			<button on:click={toggleBurgerMenu} class="self-end mr-2.5 mb-1">
				<span class="material-symbols-rounded text-accent w-5 h-3"> close </span>
			</button>
			<a
				href="/bounty-setup"
				on:click={closeBurgerMenu}
				class="bg-accent text-white p-2.5 mb-2 rounded-md w-[189px] flex justify-between items-center"
			>
				<span class="mt-1">Create new bounty</span>
				<span class="material-symbols-rounded"> add </span>
			</a>
			<button
				on:click={logOut}
				class="text-primary p-2.5 rounded-md w-[189px] flex justify-between items-center"
			>
				<span class="mt-1">Log out</span>
				<span class="material-symbols-rounded"> logout </span>
			</button>
		</div>
	{/if}
</div>
