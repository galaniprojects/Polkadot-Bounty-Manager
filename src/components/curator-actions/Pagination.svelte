<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let currentPage: number = 1;
	export let totalPages: number = 5;
	export let activeButtonColor: string = 'text-white border border-white';
	export let itemsPerPage: number = 10;
	export let perPageOptions: number[] = [3, 5, 10, 15, 20];
	export let scrollTarget: string;

	$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	const dispatch = createEventDispatcher();

	function changePage(page: number): void {
		if (page > 0 && page <= totalPages && page !== currentPage) {
			dispatch('pageChange', { page });
		}

		const scrollToContainer = findScrollContainer();
		if (scrollToContainer) {
			scrollToContainer.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function handleItemsPerPageChange(selected: number): void {
		dispatch('itemsPerPageChange', { itemsPerPage: selected });
		currentPage = 1;
	}

	function handleDropdownChange(event: CustomEvent<number>): void {
		handleItemsPerPageChange(event.detail);
	}

	function findScrollContainer(): HTMLElement | null {
		const container = document.querySelector(`[data-pagination-scroll="${scrollTarget}"]`);
		if (container instanceof HTMLElement) {
			return container;
		}

		return null;
	}
</script>

<div class="flex-col items-center space-y-[18px]">
	<div class="flex justify-center">
		<DropdownMenu
			items={perPageOptions}
			bind:selectedItem={itemsPerPage}
			width="w-48"
			on:change={handleDropdownChange}
		/>
	</div>
	<div class="flex justify-center space-x-2">
		<button
			class="pagination-arrows material-symbols-outlined"
			disabled={currentPage === 1}
			on:click={() => {
				changePage(currentPage - 1);
			}}
		>
			arrow_back_ios
		</button>

		{#each pageNumbers as page}
			<button
				class={`page-number ${page === currentPage ? activeButtonColor : 'bg-accent text-white '}`}
				on:click={() => {
					changePage(page);
				}}
			>
				{page}
			</button>
		{/each}

		<button
			class="pagination-arrows material-symbols-outlined"
			on:click={() => {
				changePage(currentPage + 1);
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
		align-items: center;
		text-align: center;
		cursor: pointer;
		border-radius: 0.375rem;
	}

	.pagination-arrows {
		color: var(--pagination-arrow-color, theme('colors.white'));
	}

	.pagination-arrows:disabled,
	.page-number:disabled {
		opacity: 0.5;
	}
</style>
