<script lang="ts">
	import DropdownMenu from '../common/DropdownMenu.svelte';

	export let currentPage = 1;
	export let totalPages = 5;
	export let activeButtonColor = 'text-white border border-white';
	export let itemsPerPage = 10;
	export let perPageOptions = [5, 10, 15, 20].map((value) => ({ value, label: value.toString() }));
	let selectedItem = perPageOptions.filter(({ value }) => value === itemsPerPage)[0];
	export let pageChange: (page: number) => void;
	export let itemsPerPageChange: (itemsPerPage: number) => void;

	$: pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

	let paginationContainer: HTMLElement | null = null;

	function changePage(page: number) {
		if (page > 0 && page <= totalPages && page !== currentPage) {
			pageChange(page);

			const scrollToContainer = paginationContainer?.closest('[data-pagination-scroll]');
			scrollToContainer?.scrollIntoView({ behavior: 'smooth' });
		}
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
			widthDropdown="w-20"
			widthContainer="w-20"
			change={handleDropdownChange}
			bgColor="lilac"
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
