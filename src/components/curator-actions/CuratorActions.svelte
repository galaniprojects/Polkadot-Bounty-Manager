<script>
	import AccordionComponent from "./AccordionComponent.svelte";
	let isDesktop = false;

</script>

<div class="main flex justify-center items-center">
	<div class="rounded-md p-6">
		<div class="flex justify-between">
			<h2 class="mt-1 font-bold text-lg text-white">Curator Actions</h2>
			<button class="border-accent bg-accent rounded-md px-2 h-9 text-white font-bold text-base"
				>CREATE NEW BOUNTY</button
			>
		</div>

		<AccordionComponent/>
		<AccordionComponent/>
	</div>
</div>

<style>
	.main {
		@apply border border-y-accent border-x-0;
		background: linear-gradient(180deg, #311033 0%, #6c003d 100%);
	}
</style>
