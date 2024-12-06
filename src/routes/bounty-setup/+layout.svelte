<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, disableScrollHandling, replaceState } from '$app/navigation';
	import { page } from '$app/stores';

	import BountySetupTab from '../../components/bounty-setup/BountySetupTab.svelte';
	import {
		hideLoadingDialog,
		showErrorDialog,
		showLoadingDialog
	} from '../../utils/loading-screen';
	import { dotApi } from '../../stores';
	import { bountyInfo } from './_bountyInfo';

	afterNavigate(() => {
		disableScrollHandling(); // when switching tabs

		if ($bountyInfo && $bountyInfo.id) {
			const fullUrl = new URL($page.url);
			fullUrl.searchParams.set('bounty-id', String($bountyInfo.id));
			replaceState(fullUrl, {});
		}
	});

	onMount(async () => {
		const bountyId = $page.url.searchParams.get('bounty-id');
		if (!bountyId) return;

		showLoadingDialog('Loading bounty info');
		try {
			const bountyDescription = await $dotApi.query.Bounties.BountyDescriptions.getValue(
				Number(bountyId)
			);
			if (!bountyDescription) {
				showErrorDialog('Failed to load bounty info');
				return;
			}

			$bountyInfo = {
				id: Number(bountyId),
				description: bountyDescription.asText(),
				value: undefined
			};
			hideLoadingDialog();
		} catch {
			showErrorDialog('Failed to load bounty info');
		}
	});
</script>

<div
	class="main border border-y-accent border-x-0 flex justify-center items-center md:py-20 lg:py-40"
>
	<div class="container setup-container max-w-screen-lg rounded-md p-4 space-y-5">
		<h2 class="font-bold text-lg sm:text-2xl text-white text-start">Bounty Setup</h2>
		<div class="border border-accent rounded-md overflow-clip">
			<div class="flex relative h-16 sm:h-20 px-2 md:px-8 bg-primary rounded-md">
				<div class="w-1/3 md:w-1/6">
					<BountySetupTab href="/bounty-setup">Creation</BountySetupTab>
				</div>
				<div class="w-1/3 md:w-1/6">
					<BountySetupTab href="/bounty-setup/approval">Approval</BountySetupTab>
				</div>
				<div class="w-1/3 md:w-1/4">
					<BountySetupTab href="/bounty-setup/curator-proposal">Curator Proposal</BountySetupTab>
				</div>
			</div>

			<div class="rounded-md bg-backgroundContentWrapper flex-col p-4 sm:min-h-[500px]">
				<div class="rounded-t-md overflow-clip">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.main {
		background: linear-gradient(180deg, #311033 0%, #6c003d 100%);
	}
</style>
