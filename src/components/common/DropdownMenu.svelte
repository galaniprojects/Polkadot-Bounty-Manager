<script lang="ts">
	import { truncateString } from '../../utils/common';
	import type { Labeled } from './labeled';

	export let items: Array<Labeled>;
	export let selectedItem: Labeled;
	export let widthContainer: string;
	export let widthDropdown: string;
	export let truncate: boolean = false;
	export let textAlign: string;
	export let change: (item: Labeled) => void = () => {};
	export let useLogos: boolean = false;
	export let bgColor: string;
	export let backgroundColorContainer: string;
	export let height: string;
	export let positionOverlay: string;

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

	const bgColorVariants: Record<string, string> = {
		pink: 'bg-accent hover:bg-accent hover:bg-opacity-30 focus:bg-accent focus:bg-opacity-30 hover:text-textPrimary',
		grey: 'bg-backgroundButtonDark hover:bg-backgroundButtonDark hover:bg-opacity-30 focus:bg-backgroundButtonDark focus:bg-opacity-30 hover:text-textPrimary'
	};

	$: selectedBgColor = bgColorVariants[bgColor];
</script>

<div bind:this={dropdownContainer}>
	<div class="relative">
		<button
			on:click={dropdownOnClick}
			type="button"
			class="inline-flex {widthContainer} {height} justify-between items-center rounded-[10px] {backgroundColorContainer} p-2 text-textPrimary"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			{#if useLogos}
				<img src={selectedItem.logo} alt={selectedItem.label} class="h-7 w-7" />
			{:else}
				{truncate ? truncateString(selectedItem.label, 9) : selectedItem.label}
			{/if}

			<span class="material-symbols-outlined">
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
			class="absolute {widthDropdown} rounded-[10px] overflow-hidden {positionOverlay} z-10 bg-lightGray shadow-lg ring-1 ring-black ring-opacity-20"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				{#each items as item, index (item)}
					<button
						class="block {widthDropdown} px-2 py-2.5 text-[16px] text-primary cursor-pointer {textAlign}
							{selectedItem === item
							? `${selectedBgColor} text-white`
							: `bg-backgroundApp hover:${selectedBgColor}`}
							"
						role="menuitem"
						tabindex="-1"
						on:click={() => {
							selectItem(item);
						}}
					>
						{#if useLogos}
							<img
								src={selectedItem === item ? item.invertedLogo : item.logo}
								alt={item.label}
								class="h-7 w-7 inline-block mr-2"
							/>
						{/if}
						{item.label}
					</button>

					{#if index < items.length - 1}
						<hr class="border-cloudGray" />
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
