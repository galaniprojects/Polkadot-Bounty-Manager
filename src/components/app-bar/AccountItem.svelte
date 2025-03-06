<script lang="ts">
	import { truncateString } from '../../utils/common';
	import PolkadotIcon from '../common/PolkadotIcon.svelte';
	import PeopleChainName from '../PeopleChainName.svelte';

	export let name;
	export let address: string;
</script>

<!-- Account Identicon and Name -->
<div class="accountInfo">
	<div class="identicon">
		<PolkadotIcon {address} />
	</div>
	<div class="accountDetails">
		<span>{name}</span>
		<span class="accountAddress">
			<PeopleChainName {address}>{truncateString(address, 20)}</PeopleChainName>
		</span>
	</div>
</div>

<style>
	.accountInfo {
		display: flex;
		align-items: center;
		cursor: pointer;
		background-color: theme('colors.backgroundButtonLight');
		gap: 12px;
		padding: 8px;
		border-radius: 8px;
		margin-top: 8px;
	}

	.identicon {
		width: 40px;
		height: 40px;
	}

	.accountDetails {
		display: flex;
		flex-direction: column;
		align-items: start;
	}
	.accountAddress {
		font-size: 14px;
	}
</style>
