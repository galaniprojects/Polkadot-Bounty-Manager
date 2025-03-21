<script lang="ts">
	import {
		activeAccount,
		activeAccountBounties,
		walletConnect as wcConnection
	} from '../../stores';
	import modalStyles from '../Modal/Modal.module.css';

	let open = false;
	let container: HTMLDivElement | null = null;

	async function logOut() {
		activeAccount.set(undefined);
		sessionStorage.removeItem('account');
		activeAccountBounties.set([]);
		if ($wcConnection) {
			await $wcConnection.disconnect();
		}
		open = false;
	}

	function clickAway({ target, currentTarget }: MouseEvent) {
		if (target === currentTarget && target instanceof HTMLDivElement) {
			open = false;
		}
	}
</script>

<div bind:this={container} class="relative">
	<!-- Burger Menu Icon -->
	<button class="h-[42px]" onclick={() => (open = !open)}>
		<span
			class="material-symbols-rounded items-center rounded-[10px] bg-backgroundButtonLight px-[23px] py-[13px] text-textPrimary"
		>
			menu
		</span>
	</button>

	<!-- Menu Overlay -->
	{#if open}
		<div class={modalStyles.backdrop} onclick={clickAway} role="presentation"></div>
		<div
			class="absolute top-0 right-0 -mt-[11px] flex flex-col items-start z-20 bg-lightGray border shadow-lg p-[5px] rounded-[10px] w-[210px]"
		>
			<button
				onclick={() => {
					open = false;
				}}
				class="self-end mt-[5px] mb-[13px]"
			>
				<span
					class="material-symbols-rounded text-textPrimary rounded-md border border-cloudGray px-[17px] py-2"
				>
					close
				</span>
			</button>
			<a
				onclick={() => {
					open = false;
				}}
				href="/bounty-setup"
				class="bg-accent text-white p-3 mb-3 rounded-[10px] flex w-full justify-between items-center"
			>
				<span class="mt-1">CREATE NEW BOUNTY</span>
			</a>

			<hr class="border-cloudGray mb-3 w-full" />

			<a
				onclick={() => {
					open = false;
				}}
				href="/user-manual"
				class="rounded-md flex space-x-2 items-center mb-2"
			>
				<span class="material-symbols-rounded bg-accent rounded-full p-2 text-white">
					lightbulb_2
				</span>
				<span class="mt-1">User manual</span>
			</a>

			{#if $activeAccount}
				<hr class="border-cloudGray mb-3 w-full" />

				<button onclick={logOut} class="rounded-md flex space-x-2 items-center mb-2">
					<span class="material-symbols-rounded bg-accent rounded-full p-2 text-white">
						logout
					</span>
					<span class="mt-1">Log out</span>
				</button>
			{/if}
		</div>
	{/if}
</div>
