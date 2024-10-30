<script lang="ts">
	import { truncateString } from '../../../utils/common';

	export let filters: string[] = [];
	export let selectedFilter: string = 'all';

	let dropdownOpened = false;
	let dropdownContainer: HTMLDivElement | null = null;

	function openUpFilterDropdownToggleClick() {
		dropdownOpened = !dropdownOpened;

		if (dropdownOpened) {
			window.addEventListener('click', closeDropdownClickOutside);
		} else {
			window.removeEventListener('click', closeDropdownClickOutside);
		}
	}

	function selectFilter(filter: string) {
		selectedFilter = filter;
		dropdownOpened = false;
		window.removeEventListener('click', closeDropdownClickOutside);
	}

	function closeDropdownClickOutside(event: MouseEvent) {
		if (dropdownContainer) {
			const clickedOutside = !dropdownContainer.contains(event.target as Node);

			if (clickedOutside) {
				dropdownOpened = false;
				window.removeEventListener('click', closeDropdownClickOutside);
			}
		}
	}
</script>

<div class="w-full" bind:this={dropdownContainer}>
	<div class="relative w-44 lg:w-32 2xl:w-36">
		<button
			on:click={openUpFilterDropdownToggleClick}
			type="button"
			class="inline-flex w-full justify-between items-center rounded-md bg-white px-2 py-2 text-primary ring-1 ring-inset ring-accent"
			id="menu-button"
			aria-expanded="true"
			aria-haspopup="true"
		>
			{truncateString(selectedFilter, 9)}

			<button class="material-symbols-outlined text-accent">
				{#if dropdownOpened}
					keyboard_arrow_up
				{:else}
					keyboard_arrow_down
				{/if}
			</button>
		</button>
	</div>
	{#if dropdownOpened}
		<div
			class="absolute rounded-md overflow-hidden -mt-10 z-10 w-44 lg:w-32 2xl:w-36 bg-white shadow-lg ring-1 ring-black ring-opacity-20"
			role="menu"
			aria-orientation="vertical"
			aria-labelledby="menu-button"
			tabindex="-1"
		>
			<div role="none">
				{#each filters as status, index}
					<button
						class="block w-full px-4 py-2.5 text-sm text-primary cursor-pointer
							{selectedFilter === status ? 'bg-curatorMainBackground text-white' : 'bg-white'}
							hover:bg-curatorMainBackground focus:bg-curatorMainBackground hover:bg-opacity-30 focus:bg-opacity-30"
						role="menuitem"
						tabindex="-1"
						on:click={() => selectFilter(status)}
					>
						{status}
					</button>

					{#if index < filters.length - 1}
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
