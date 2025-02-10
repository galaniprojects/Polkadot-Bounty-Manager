<script context="module" lang="ts">
	export interface Labeled {
		label: string;
		logo?: string;
		invertedLogo?: string;
	}
</script>

<script lang="ts">
	import { truncateString } from '../../utils/common';

	export let items: Array<Labeled>;
	export let selectedItem: Labeled;
	export let widthContainer: string;
	export let widthDropdown: string;
	export let truncate: boolean = false;
	export let textAlign: string;
	export let change: (item: Labeled) => void = () => {};
	export let useLogos: boolean = false;
	export let bgColor: string;

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
		pink: 'bg-accent hover:bg-accent hover:bg-opacity-30 focus:bg-accent focus:bg-opacity-30 hover:text-primary',
		lilac:
			'bg-curatorMainBackground hover:bg-curatorMainBackground hover:bg-opacity-30 focus:bg-curatorMainBackground focus:bg-opacity-30 hover:text-primary'
	};

	$: selectedBgColor = bgColorVariants[bgColor];
</script>

<div bind:this={dropdownContainer}>
	<div class="relative">
		<button
			on:click={dropdownOnClick}
			type="button"
			class="inline-flex {widthContainer} justify-between items-center rounded-md bg-cloudGray px-2 py-2 text-primary"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			{#if useLogos}
				<img src={selectedItem.logo} alt={selectedItem.label} class="h-7 w-7" />
			{:else}
				{truncate ? truncateString(selectedItem.label, 9) : selectedItem.label}
			{/if}

			<span class="material-symbols-outlined text-charcoal">
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
			class="absolute {widthDropdown} rounded-md overflow-hidden -mt-[48px] z-10 bg-lightGray shadow-lg ring-1 ring-black ring-opacity-20"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				{#each items as item, index}
					<button
						class={`block ${widthDropdown} px-2 py-2.5 text-[16px] text-primary cursor-pointer ${textAlign} 
						${selectedItem === item ? `${selectedBgColor} text-white` : `bg-lightGray hover:${selectedBgColor} hover:bg-opacity-30 focus:bg-opacity-30 hover:text-primary`}`}
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
