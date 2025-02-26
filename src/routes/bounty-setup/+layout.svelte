<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate, disableScrollHandling, replaceState } from '$app/navigation';
	import { page } from '$app/state';

	import BountySetupTab from '../../components/bounty-setup/BountySetupTab.svelte';
	import { showErrorModal } from '../../components/ErrorModal/showErrorModal';
	import {
		hideLoadingModal,
		showLoadingModal
	} from '../../components/LoadingModal/loadingModalStores';
	import { dotApi } from '../../stores';
	import { bountyInfo } from './_bountyInfo';

	afterNavigate(() => {
		disableScrollHandling(); // when switching tabs

		if ($bountyInfo?.id) {
			const fullUrl = new URL(page.url);
			fullUrl.searchParams.set('bounty-id', String($bountyInfo.id));
			replaceState(fullUrl, {});
		}
	});

	onMount(async () => {
		const bountyId = page.url.searchParams.get('bounty-id');
		if (!bountyId) return;

		showLoadingModal('Loading bounty info…');
		try {
			const bountyDescription = await $dotApi.query.Bounties.BountyDescriptions.getValue(
				Number(bountyId)
			);
			if (!bountyDescription) {
				showErrorModal('Failed to load bounty info');
				return;
			}

			$bountyInfo = {
				id: Number(bountyId),
				description: bountyDescription.asText(),
				value: undefined
			};
			hideLoadingModal();
		} catch {
			showErrorModal('Failed to load bounty info');
		}
	});
</script>

<div class="main border-x-0 flex justify-center items-center md:py-20 lg:py-40">
	<div class="container setup-container max-w-screen-lg p-4 space-y-5">
		<h2 class="font-bold text-lg sm:text-2xl text-start">Bounty Setup</h2>
		<div class="overflow-clip">
			<div class="flex h-16 sm:h-20 px-2 md:px-8 bg-backgroundButtonDark rounded-t-md">
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

			<div class="rounded-b-md bg-backgroundChildBountyDetails flex-col p-4 sm:min-h-[500px]">
				<div class="rounded-t-md overflow-clip">
					<slot />
				</div>
			</div>
		</div>
	</div>
</div>
