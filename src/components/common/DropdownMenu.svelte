<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { truncateString } from '../../utils/common';

	interface Labeled {
		label: string;
	}

	export let items: Array<Labeled>;
	export let selectedItem: Labeled;
	export let width: string;
	export let truncate: boolean = false;

	let dropdownOpen = false;
	let dropdownContainer: HTMLDivElement | null = null;

	const dispatch = createEventDispatcher();

	function dropdownOnClick() {
		dropdownOpen = !dropdownOpen;

		if (dropdownOpen) {
			window.addEventListener('click', closeDropdownClickOutside);
		} else {
			window.removeEventListener('click', closeDropdownClickOutside);
		}
	}

	function selectItem(item: Labeled) {
		selectedItem = item;
		dropdownOpen = false;
		dispatch('change', item);
		window.removeEventListener('click', closeDropdownClickOutside);
	}

	function closeDropdownClickOutside(event: MouseEvent) {
		if (dropdownContainer) {
			const clickedOutside = !dropdownContainer.contains(event.target as Node);

			if (clickedOutside) {
				dropdownOpen = false;
				window.removeEventListener('click', closeDropdownClickOutside);
			}
		}
	}
</script>

<div bind:this={dropdownContainer}>
	<div class="relative">
		<button
			on:click={dropdownOnClick}
			type="button"
			class="inline-flex {width} justify-between items-center rounded-md bg-white px-2 py-2 text-primary ring-1 ring-inset ring-accent"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			{truncate ? truncateString(selectedItem.label, 9) : selectedItem.label}

			<button class="material-symbols-outlined text-accent">
				{#if dropdownOpen}
					keyboard_arrow_up
				{:else}
					keyboard_arrow_down
				{/if}
			</button>
		</button>
	</div>
	{#if dropdownOpen}
		<div
			class="absolute {width} rounded-md overflow-hidden -mt-12 z-10 bg-white shadow-lg ring-1 ring-black ring-opacity-20"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				{#each items as item, index}
					<button
						class="block {width} px-4 py-2.5 text-sm text-primary cursor-pointer
							{selectedItem === item ? 'bg-curatorMainBackground text-white' : 'bg-white'}
							hover:bg-curatorMainBackground focus:bg-curatorMainBackground hover:bg-opacity-30 focus:bg-opacity-30"
						role="menuitem"
						tabindex="-1"
						on:click={() => {
							selectItem(item);
						}}
					>
						{item.label}
					</button>

					{#if index < items.length - 1}
						<hr />
					{/if}
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.material-symbols-outlined {
		font-size: 30px;
	}
</style>
