<script lang="ts">
	import { tick } from 'svelte';
	import { generate } from '@bramus/pagination-sequence';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let currentPage = 1;
	export let totalPages = 5;
	export let activeButtonColor = 'text-textPrimary border border-textPrimary';
	export let itemsPerPage = 10;
	export let perPageOptions = [5, 10, 15, 20].map((value) => ({ value, label: value.toString() }));
	let selectedItem = perPageOptions.filter(({ value }) => value === itemsPerPage)[0];
	export let pageChange: (page: number) => void;
	export let itemsPerPageChange: (itemsPerPage: number) => void;

	$: pageNumbers = generate(currentPage, totalPages, 1, 1);

	let paginationContainer: HTMLElement | null = null;

	async function changePage(page: number) {
		if (page <= 0 || page > totalPages || page === currentPage) return;

		pageChange(page);

		await tick(); // give Svelte time to re-render before DOM access
		paginationContainer
			?.closest('[data-pagination-scroll]')
			?.scrollIntoView({ behavior: 'smooth' });
	}

	function handleDropdownChange(itemsPerPage: unknown) {
		itemsPerPageChange((itemsPerPage as { value: number }).value);
	}
</script>

<div bind:this={paginationContainer} class="flex-col items-center space-y-[18px]">
	<div class="flex justify-center">
		<DropdownMenu
			items={perPageOptions}
			bind:selectedItem
			textAlign="text-center"
			widthDropdown="w-[350px]"
			widthContainer="w-[350px]"
			change={handleDropdownChange}
			bgColor="grey"
			backgroundColorContainer="border border-backgroundButtonDark bg-backgroundApp"
		/>
	</div>
	<div class="flex justify-center space-x-[6px]">
		<button
			class="pagination-arrows material-symbols-outlined"
			disabled={currentPage === 1}
			on:click={async () => {
				await changePage(currentPage - 1);
			}}
		>
			arrow_back_ios
		</button>

		{#each pageNumbers as page}
			{#if typeof page === 'number'}
				<button
					class={`page-number ${page === currentPage ? activeButtonColor : 'bg-backgroundButtonDark text-backgroundApp '}`}
					disabled={page === currentPage}
					on:click={async () => {
						await changePage(page);
					}}
				>
					{page}
				</button>
			{:else}
				<span class="page-number {activeButtonColor} text-center border-0">
					{page}
				</span>
			{/if}
		{/each}

		<button
			class="pagination-arrows material-symbols-outlined"
			on:click={async () => {
				await changePage(currentPage + 1);
			}}
			disabled={currentPage === totalPages}
		>
			arrow_forward_ios
		</button>
	</div>
</div>

<style>
	.pagination-arrows,
	.page-number {
		width: 40px;
		height: 40px;
		line-height: 40px;
		align-items: center;
		text-align: center;
		cursor: pointer;
		border-radius: 10px;
	}

	.pagination-arrows {
		color: var(--pagination-arrow-color, theme('colors.textPrimary'));
	}

	.pagination-arrows:disabled {
		opacity: 0.5;
	}
</style>
