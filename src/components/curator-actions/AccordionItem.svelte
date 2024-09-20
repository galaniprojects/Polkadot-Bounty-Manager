<script lang="ts">
	import ChildBountyCard from './ChildBountyCard.svelte';
	import CuratorItem from './CuratorItem.svelte';
	import InfoSvg from '../svg/InfoIcon.svelte';
	import LogoPolkassembly from '../svg/LogoPolkassembly.svelte';
	import LogoTreasuryIcon from '../svg/LogoTreasuryIcon.svelte';
	import LogoSubscan from '../svg/LogoSubscan.svelte';
	import type { Bounty } from '../../types/bounty';
	import { onMount } from 'svelte';
	import { WsProvider, ApiPromise } from '@polkadot/api';
	import AcceptCuratorRule from './AcceptCuratorRule.svelte';

	let bountyDetails = {
		title: 'Community Event Activity Bounty'
	};

	export let bounty: Bounty;
	let acceptCuratorRuleDialogOpened = false;

	onMount(async () => {
		// Query all bounties.
		const wsProvider = new WsProvider('ws://localhost:8000');
		const api = await ApiPromise.create({ provider: wsProvider });
		let bountyDescription = (
			await api.query.bounties.bountyDescriptions(bounty.id)
		).toHuman() as string;
		bountyDetails.title = bountyDescription;
		bounty.description = bountyDescription;
	});

	let curators = [
		{ name: '13iTojfEzgwRKzvEkuAm2xrtm' },
		{ name: 'Nick_dot_play' },
		{ name: '12BJP1geE8wAq1wjUtdvNdNz' },
		{ name: '13mscy5gwheBhwgPJApclOKw' },
		{ name: 'AppliedBC Labs' },
		{ name: '13msAmDwBgwhjLePJApctfQoi' },
		{ name: 'Rekt Street Capital' },
		{ name: '13mYAmgswnDc3GpR1ApctW9Gy' },
		{ name: 'Khastor' },
		{ name: '13mscyw5fekWGwpR1ApctqOP8' },
		{ name: 'AppliedBC Labs' },
		{ name: '13mscy5wffy43rkWRApctMW89' }
	];

	let curatorsExpended = false;
	let expanded = false;

	function handleCuratorsToggleClick() {
		curatorsExpended = !curatorsExpended;
	}

	function handleToggleClick() {
		expanded = !expanded;
	}
</script>

<div class="bg-curatorMainBackground rounded-md my-6">
	<!-- Mobile design-->
	<div class="lg:hidden">
		<div
			class="flex overflow-hidden max-w-96 justify-between items-center text-lg text-white font-bold m-3 p-2 space-x-2"
		>
			<span class="mb-7 min-[458px]:mb-0">{`${bounty.id}`}</span>
			<p class="ml-3 text-clip">{`${bountyDetails.title}`}</p>
			<button
				class="material-symbols-outlined flex justify-center items-center border-white border-2 rounded-full p-3 w-8 h-8 text-2xl ml-3"
				on:click={handleToggleClick}
			>
				{#if expanded}
					keyboard_arrow_up
				{:else}
					keyboard_arrow_down
				{/if}
			</button>
		</div>

		{#if !expanded}
			<div class="grid gap-1 lg:justify-between lg:items-center m-3">
				<div class="flex justify-between">
					<button
						class="border border-accent rounded-md text-accent font-bold px-1 py-2 m-1 w-full"
						on:click={() => {
							acceptCuratorRuleDialogOpened = true;
						}}
					>
						ACCEPT CURATOR
					</button>
					<button class="info-svg w-9 h-9 m-2"><InfoSvg /></button>
				</div>

				<div class="flex justify-between">
					<button
						class=" border border-darkgray rounded-md text-darkgray font-bold px-1 py-2 m-1 w-full"
					>
						OPT-IN
					</button>
					<button class="info-svg w-9 h-9 m-2"><InfoSvg /></button>
				</div>
			</div>
		{:else}
			<div class="bg-backgroundContentWrapper opacity-90 p-3 pt-1">
				<section class="my-3">
					<p class="text-xs">Proposer</p>
					<p class="proposer-name">JDoe_Chain</p>
				</section>

				<div class="flex justify-between">
					<div class="grid max-w-52">
						<section>
							<p class="text-xs">Remaining balance</p>
							<p><span>1,230.9800</span> DOT</p>
						</section>
						<section>
							<p class="text-xs">Bounty description</p>
							<p>
								<a href="/bs" class="link underline underline-offset-2">See/edit description</a>
							</p>
						</section>
					</div>

					<div class="grid gap-3">
						<section>
							<p class="text-xs">Value</p>
							<p><span>100,000.0000</span></p>
						</section>
						<section>
							<p class="text-xs">External Links</p>
							<div class="flex gap-2">
								<button class="w-9 h-9 mt-1"><LogoTreasuryIcon /></button>
								<button class="w-9 h-9 m-1"><LogoPolkassembly /></button>
								<button class="w-9 h-9 m-1"><LogoSubscan /></button>
							</div>
						</section>
					</div>
				</div>
				<hr class="border-white opacity-30 mt-6 mb-3" />
				<section class="flex justify-between items-center w-64">
					<p class="text-xs">Curator ({curators.length})</p>
					<button
						class="material-symbols-outlined flex justify-center items-center bg-accent text-white rounded-full w-6 h-6 text-lg ml-3"
						on:click={handleCuratorsToggleClick}
					>
						{#if curatorsExpended}
							keyboard_arrow_up
						{:else}
							keyboard_arrow_down
						{/if}
					</button>
				</section>
				<div class="flex justify-between my-3 w-64">
					<p class="main-curator">13iTojfEzgwrKzvEkuAmxrtm</p>
					<button class="material-symbols-outlined text-accent w-6 h-6">content_copy</button>
				</div>
				{#if curatorsExpended}
					<div class="mt-1">
						{#each curators as curator, index}
							<CuratorItem {index} {curator} />
						{/each}
					</div>
				{/if}
				<hr class="border-white opacity-30 mt-6 mb-3" />
				<section>
					<div class="flex justify-end items-center py-3">
						<p class="mr-3 text-sm">Expires in 10 days</p>
						<button class="bg-notifications text-white rounded-md font-bold py-2 px-8 mr-3"
							>EXTEND</button
						>
					</div>
					<div class="flex justify-end items-center">
						<p>
							<a href="/bs" class="link underline underline-offset-2 text-sm"
								>Beneficiary Claim Form</a
							>
						</p>
						<button class="info-svg w-6 h-6 mx-3"><InfoSvg /></button>
						<button class="bg-accent text-white rounded-md font-bold py-2 px-8 mr-3">UPDATE</button>
					</div>
					<div class="flex justify-end items-center py-3">
						<p class="mr-3 text-sm">Award Bounty</p>
						<button class="bg-darkgray text-white rounded-md font-bold py-2 px-4 mr-3"
							>READ FIRST</button
						>
					</div>
				</section>
			</div>
			<div class="bg-backgroundContent p-3">
				<p>3 Child Bounties</p>
				<div class="relative w-full">
					<input
						class="border border-borderColor pt-1 pl-2 w-full rounded-md bg-white"
						placeholder="Bounty Search"
					/>
					<div
						class="border border-accent absolute right-8 top-1/2 transform -translate-y-1/2 h-5"
					></div>

					<svg
						class="w-3 h-3 text-accent absolute right-3 top-1/2 transform -translate-y-1/2"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 20 20"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
						/>
					</svg>
				</div>
				<div class="flex justify-end items-center py-3">
					<p class="mr-3 text-sm">Salary Child Bounties</p>
					<button class="bg-accent text-white rounded-md font-bold py-2 px-11 mr-3">ADD</button>
				</div>
				<div class="flex justify-end items-center pb-3">
					<p class="mr-3 text-sm">Assign Sub-Curator</p>
					<button class="bg-accent text-white rounded-md font-bold py-2 px-11 mr-3">ADD</button>
				</div>
				<ChildBountyCard
					id="8887"
					title="Marketing Allocation"
					status="claimed"
					value="47,370.0000 DOT"
					curatorFee="1.9857 DOT"
					subCurator="7H1RjCf3...Ngcq"
					beneficiary="Nodal_point_12"
					dateCreated="MAY 09, 2024"
					dateOfPayout="AUG 21, 2024"
					timeUntilPayout="1d : 8h : 42min : 18sec"
				/>
			</div>
		{/if}
	</div>

	<!-- Desktop design -->
	<div class="lg:w-[960px] xl:w-[1300px] 2xl:w-[1280px] hidden lg:grid">
		<!-- Header Section -->
		<section class="text-white max-h-20 px-10 my-4">
			<div class="flex justify-between">
				<span class="text-2xl">#{`${bounty.id}`} {`${bountyDetails.title}`}</span>
				<div class="flex gap-2">
					<button class="w-6 h-6"><LogoTreasuryIcon /></button>
					<button class="w-6 h-6"><LogoPolkassembly /></button>
					<button class="w-6 h-6"><LogoSubscan /></button>
				</div>
			</div>
			<div class="flex justify-start text-xs pl-12">
				<section class="flex space-x-1 mr-1">
					<p>Proposer:</p>
					<p>JDoe_Chain</p>
				</section>
				<section class="flex space-x-1 ml-16">
					<p>Created:</p>
					<p>8th August 2024</p>
				</section>
				<section class="flex space-x-1 ml-40">
					<p>Expiration date:</p>
					<p>27th September 2024</p>
				</section>
			</div>
		</section>

		<!-- Content Section -->

		{#if !expanded}
			<div class="p-3 pt-6 flex justify-start text-white">
				<div class="flex justify-start ml-7">
					<div class="grid gap-2">
						<section class="flex">
							<div>
								<p class="text-xs">Remaining balance</p>
								<p class="text-2xl"><span>1,230.9800</span> DOT</p>
							</div>
							<div>
								<section class="ml-16 w-72">
									<p class="text-xs">Curator ({curators.length})</p>
									<div class="flex items-center space-x-2">
										<p class="main-curator">13iTojfEzgwrKzvEkuAmxrtm</p>
										<button class="material-symbols-outlined w-6 h-6"
											>content_copy</button
										>

										<button
											class="material-symbols-outlined flex justify-center items-center border border-white text-white rounded-full w-6 h-6 text-lg ml-3"
											on:click={handleCuratorsToggleClick}
										>
											{#if curatorsExpended}
												keyboard_arrow_up
											{:else}
												keyboard_arrow_down
											{/if}
										</button>
									</div>
									{#if curatorsExpended}
										<div class="mt-1">
											{#each curators as curator, index}
												<CuratorItem {index} {curator} />
											{/each}
										</div>
									{/if}
								</section>
							</div>
							<div class="ml-2">
								<p class="text-xs">Curator Fee</p>
								<p class="text-md"><span>4.0057</span> DOT</p>
							</div>
						</section>
						<section class="text-xs max-w-52">
							<p>Description</p>
							<p> This proposal stems from the need to enhance system upgrade testing procedures,
								minimizing feature regression. Recent discussions in various channels, spurred by …
							</p>
						</section>
					</div>
				</div>
				<section class="space-y-3 ml-44 ">
					<div class="flex justify-end items-center">
						<p class="mr-3 text-sm">Beneficiary Claim Form</p>
						<button class="bg-accent rounded-md font-bold min-w-32 pt-1">ADD</button>
						<button class="w-6 h-6 ml-2"><InfoSvg /></button>
					</div>
					<div class="flex justify-end items-center mr-8">
						<p class="mr-3 text-sm">Award Bounty</p>
						<button class="bg-accent rounded-md font-bold min-w-32 pt-1">READ FIRST</button>
					</div>
				</section>
			</div>
				<div class="bg-childBountyBackground p-3 m-3">
					<section class="flex justify-start px-5 pb-6">
						<div class="grid gap-2 w-[500px]">
							<p class="text-xs">Child Bounties</p>
							<p class="text-2xl">Child Bounties</p>
							<div class="relative w-full h-10">
								<input
									class="border border-borderColor pt-1 w-full rounded-md bg-white pl-2"
									placeholder="Bounty Search"
								/>
								<div
									class="border border-accent absolute right-8 top-4 transform -translate-y-1/2 h-5"
								></div> 

								<svg
									class="w-3 h-3 text-accent absolute right-3 top-4 transform -translate-y-1/2"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 20"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
									/>
								</svg>
							</div>
						</div>
						<div class="grid space-y-3 ml-72">
							<div class="flex justify-end items-center py-3">
								<p class="mr-3 text-md">New Child Bounty</p>
								<button class="bg-accent text-white rounded-md font-bold pt-1 min-w-32 mr-3"
									>ADD</button
								>
							</div>
							<div class="flex justify-end items-center pb-3">
								<p class="mr-3 text-md">Salary Child Bounties</p>
								<button class="bg-accent text-white rounded-md font-bold pt-1 min-w-32 mr-3"
									>ADD</button
								>
							</div>
						</div>
					</section>

					<ChildBountyCard
						id="8887"
						title="Marketing Allocation"
						status="created"
						value="47,370.0000 DOT"
						curatorFee="1.9857 DOT"
						subCurator="7H1RjCf3...Ngcq"
						beneficiary="Nodal_point_12"
						dateCreated="MAY 09, 2024"
						dateOfPayout="AUG 21, 2024"
						timeUntilPayout="1d : 8h : 42min : 18sec"
					/>
					<ChildBountyCard
						id="8887"
						title="Marketing Allocation"
						status="sub-curator proposed"
						value="47,370.0000 DOT"
						curatorFee="1.9857 DOT"
						subCurator="7H1RjCf3...Ngcq"
						beneficiary="Nodal_point_12"
						dateCreated="MAY 09, 2024"
						dateOfPayout="AUG 21, 2024"
						timeUntilPayout="1d : 8h : 42min : 18sec"
					/>
					<ChildBountyCard
						id="8887"
						title="Bounty 2"
						status="active"
						value="47,370.0000 DOT"
						curatorFee="1.9857 DOT"
						subCurator="7H1RjCf3...Ngcq"
						beneficiary="Nodal_point_12"
						dateCreated="MAY 09, 2024"
						dateOfPayout="AUG 21, 2024"
						timeUntilPayout="1d : 8h : 42min : 18sec"
					/>
					<ChildBountyCard
						id="8887"
						title="Bounty 3"
						status="awarded"
						value="47,370.0000 DOT"
						curatorFee="1.9857 DOT"
						subCurator="7H1RjCf3...Ngcq"
						beneficiary="Nodal_point_12"
						dateCreated="MAY 09, 2024"
						dateOfPayout="AUG 21, 2024"
						timeUntilPayout="1d : 8h : 42min : 18sec"
					/>
					<ChildBountyCard
						id="8887"
						title="Bounty 4 very long title name for testing it"
						status="claimed"
						value="47,370.0000 DOT"
						curatorFee="1.9857 DOT"
						subCurator="7H1RjCf3...Ngcq"
						beneficiary="Nodal_point_12"
						dateCreated="MAY 09, 2024"
						dateOfPayout="AUG 21, 2024"
						timeUntilPayout="1d : 8h : 42min : 18sec"
					/>
				</div>
		{/if}
	</div>
</div>
{#if acceptCuratorRuleDialogOpened}
	<AcceptCuratorRule bind:opened={acceptCuratorRuleDialogOpened} {bounty} />
{/if}

<style>
	hr {
		box-shadow: 0 -1px 0 0 gray;
	}
</style>
