<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let currentPage = 1;
	export let totalPages = 5;
	export let arrowColor = 'white';
	export let activeButtonColor = 'bg-transparent text-white border border-white';

	export let itemsPerPage = 5;
	export let perPageOptions = [5, 10, 15, 20];

	$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	const dispatch = createEventDispatcher();

	const changePage = (page: number) => {
		if (page > 0 && page <= totalPages && page !== currentPage) {
			dispatch('pageChange', { page });
		}
	};

	const handleItemsPerPageChange = (selected: number) => {
		dispatch('itemsPerPageChange', { itemsPerPage: selected });
		currentPage = 1;
	};

	function handleDropdownChange(event: CustomEvent<number>) {
		handleItemsPerPageChange(event.detail);
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
	<div class="flex justify-center">
		<button
			class="pagination-arrows material-symbols-outlined ml-2"
			style="color: {arrowColor};"
			disabled={currentPage === 1}
			on:click={() => {
				changePage(currentPage - 1);
			}}
		>
			arrow_back_ios
		</button>

		{#each pageNumbers as page}
			<button
				class={`page-number 
        ${page === currentPage ? activeButtonColor : 'bg-accent text-white'} 
        ml-2`}
				on:click={() => {
					changePage(page);
				}}
			>
				{page}
			</button>
		{/each}

		<button
			class="pagination-arrows material-symbols-outlined ml-2"
			style="color: {arrowColor};"
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

	.pagination-arrows:disabled,
	.page-number:disabled {
		pointer-events: none;
		opacity: 0.5;
	}
</style>
