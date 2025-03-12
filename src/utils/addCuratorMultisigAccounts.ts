import { fetchAllProxies } from '../components/curator-actions/fetch-signatories';
import type { Bounty } from '../types/bounty';

export async function addCuratorMultisigAccounts(bounties: Bounty[]) {
	const proxies = await fetchAllProxies();

	bounties.forEach((bounty) => {
		if (bounty.curator) {
			bounty.curatorMultisigAccount = proxies.get(bounty.curator);
		}

		bounty.childBounties.forEach((childBounty) => {
			if (childBounty.curator) {
				childBounty.curatorMultisigAccount = proxies.get(childBounty.curator);
			}
		});
	});
}
