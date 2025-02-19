<script lang="ts">
	import { truncateString } from '../../utils/common';

	interface Labeled {
		label: string;
	}

	export let items: Array<Labeled>;
	export let selectedItem: Labeled;
	export let width: string;
	export let truncate: boolean = false;
	export let change: (item: Labeled) => void = () => {};

	let dropdownOpen = false;
	let dropdownContainer: HTMLDivElement | null = null;

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
		change(item);
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
			class="inline-flex {width} justify-between items-center rounded-md bg-backgroundApp px-2 py-2 text-textPrimary ring-1 ring-inset ring-borderDropdown"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			{truncate ? truncateString(selectedItem.label, 9) : selectedItem.label}

			<span class="material-symbols-outlined text-textPrimary">
				{#if dropdownOpen}
					keyboard_arrow_up
				{:else}
					keyboard_arrow_down
				{/if}
			</span>
		</button>
	</div>
	{#if dropdownOpen}
		<div
			class="absolute {width} rounded-md overflow-hidden -mt-12 z-10 bg-backgroundApp shadow-lg ring-1 ring-black ring-opacity-20"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				{#each items as item, index}
					<button
						class="block {width} px-4 py-2.5 text-sm text-primary cursor-pointer
							{selectedItem === item ? 'bg-backgroundButtonDark text-white' : 'bg-backgroundApp'}
							hover:bg-backgroundButtonLight hover:text-textPrimary focus:bg-backgroundButtonLight focus:text-textPrimary hover:bg-opacity-30 focus:bg-opacity-30"
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
