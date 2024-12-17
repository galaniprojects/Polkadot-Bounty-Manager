<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let currentPage = 1;
	export let totalPages = 5;
	export let activeButtonColor = 'text-white border border-white';
	export let itemsPerPage = 10;
	export let perPageOptions = [3, 5, 10, 15, 20];
	export let scrollTarget: string;

	$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	const dispatch = createEventDispatcher();

	function changePage(page: number, event: Event) {
		if (page > 0 && page <= totalPages && page !== currentPage) {
			dispatch('pageChange', { page });

			const scrollToContainer = (event.currentTarget as HTMLElement).closest(
				`[data-pagination-scroll="${scrollTarget}"]`
			);
			scrollToContainer?.scrollIntoView({ behavior: 'smooth' });
		}
	}

	function handleDropdownChange(event: CustomEvent<number>) {
		dispatch('itemsPerPageChange', { itemsPerPage: event.detail });
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
			on:click={(e) => {
				changePage(currentPage - 1, e);
			}}
		>
			arrow_back_ios
		</button>

		{#each pageNumbers as page}
			<button
				class={`page-number ${page === currentPage ? activeButtonColor : 'bg-accent text-white '}`}
				on:click={(e) => {
					changePage(page, e);
				}}
			>
				{page}
			</button>
		{/each}

		<button
			class="pagination-arrows material-symbols-outlined"
			on:click={(e) => {
				changePage(currentPage + 1, e);
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
