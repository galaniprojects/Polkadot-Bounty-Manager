<script lang="ts">
	import InfoSvg from './InfoSVG.svelte';

	let bounty = {
		id: '#88',
		title: 'Community Event Activity Bounty'
	};

	function handleToggleClick(this: HTMLElement) {
		const accordion = this.closest('.accordion');
		if (!accordion) {
			console.error('Accordion not found!');
			return;
		}
		accordion.classList.toggle('expanded');
		this.textContent = accordion.classList.contains('expanded')
			? 'keyboard_arrow_up'
			: 'keyboard_arrow_down';
	}
</script>

<div class="accordion bg-secondary border-accent rounded-md p-3 my-6">
	<div
		class="accordion-header font-bold text-lg lg:hidden text-white flex justify-between items-center p-2 space-x-2"
	>
		<span class="bounty-id mb-7">{`${bounty.id}`}</span>
		<span class="bounty-title ml-3">{`${bounty.title}`}</span>
		<button
			class="accordion-toggle material-symbols-outlined border-white border-2 rounded-full p-3 w-8 h-8 text-2xl flex justify-center items-center ml-3"
			on:click={handleToggleClick}
		>
			keyboard_arrow_down
		</button>
	</div>

	<div class="actions lg:hidden grid gap-1 lg:justify-between lg:items-center">
		<div class="flex justify-between">
			<button class="curator-btn text-accent border-accent px-1 py-2 m-1 w-full">
				ACCEPT CURATOR
			</button>
			<button class="info-svg w-9 h-9"><InfoSvg /></button>
		</div>

		<div class="flex justify-between">
			<button class="optin-btn text-darkgray border-darkgray px-1 py-2 m-1 w-full"> OPT-IN </button>
			<button class="info-svg w-9 h-9"><InfoSvg /></button>
		</div>
	</div>

	<div class="temp lg:w-[960px] xl:w-[1200px] 2xl:w-[1280px] hidden lg:flex justify-between items-center max-h-20 pl-10 pr-6">
		<div class="accordion-header text-white flex">
			<span class="bounty-id text-2xl">#89</span>
			<span class="bounty-title text-2xl ml-3">Community Event Activities Bounty 02</span>
		</div>

		<div class="actions flex justify-between items-center">
			<button class="info-svg w-6 h-6"><InfoSvg /></button>
			<button class="curator-btn text-accent border-2 border-accent min-w-fit px-3 ml-2 mr-5"
				>ACCEPT CURATOR
			</button>

			<button class="info-svg w-6 h-6"><InfoSvg /></button>
			<button class="optin-btn text-darkgray border-2 border-darkgray min-w-fit px-9 ml-2 mr-6"
				>OPT-IN
			</button>
			<button
				class="accordion-toggle material-symbols-outlined border-white text-white border-2 rounded-full p-2 w-6 h-6 text-xl flex justify-center items-center"
				on:click={handleToggleClick}
			>
				keyboard_arrow_down
			</button>
		</div>
	</div>
</div>

<style>
	.accordion {
		@apply border;
	}

	@media (min-width: 500px) {
		.bounty-id {
			@apply mb-0;
		}
	}

	.curator-btn,
	.optin-btn {
		@apply rounded-md font-bold;
		border: 1px solid;
	}

	.material-symbols-outlined {
		font-family: 'Material Icons Outlined';
		font-variation-settings:
			'FILL' 0,
			'wght' 400,
			'GRAD' 0,
			'opsz' 24;
	}

	.info-svg{
		@apply m-2;
	}

	.info-svg {
		border: none;
	}
</style>
