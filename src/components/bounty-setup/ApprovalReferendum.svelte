<script>
	import { ApiPromise, WsProvider } from '@polkadot/api';
	import {
		web3Accounts,
		web3FromAddress
	} from '@polkadot/extension-dapp';

	let success = false;
	let bounty = {
		id: '#88',
		title: 'Community Event Activity Bounty'
	};

	async function submit() {
		success = !success;

		const accounts = await web3Accounts();
		const wsProvider = new WsProvider('ws://localhost:8000');
		const injector = await web3FromAddress(accounts[0].address);

		const api = await ApiPromise.create({ provider: wsProvider });

		console.log('making preimage');
		let preimageTx = api.tx.bounties.approveBounty(60);

		let refernda = api.tx.referenda.submit(
			{
				Origins: 'BigSpender'
			},
			{ Inline: preimageTx.method.toHex() },
			{ After: 1 }
		);
		let encoded = refernda.method.toHex();
		console.log(encoded);

		const ref = await refernda.signAndSend(accounts[0].address, { signer: injector.signer });
		console.log(ref);
	}

</script>

<div>
	<div class="top-bar flex justify-between text-white">
		<p class="title text-2xl leading-7">{`${bounty.id} ${bounty.title}`}</p>
		<p class="text text-sm mt-1.5">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			<a href="#info">Tap here</a>
		</p>
	</div>

	{#if success}
		<div class="content">
			<p class="description">
				The Referendum for the approval of Bounty <br />
				{`${bounty.id} ${bounty.title}`} <br />
				has been created successfully!
				<br /><br />
				Please update the description on
				<a href="/bs" class="link underline underline-offset-2">Polkassembly</a>. The decision
				deposit needs to be placed within 7 days, for the referendum to be valid. (This deposit can
				be placed from another account).
				<br /> <br />
				You can now return to the home screen or proceed to the Curator Approval Referendum creation.
				It is strongly recommended to create the Curator Approval Referendum, after the Bounty has been
				funded and the Curator list has been informally accepted by the community in discussions on the
				platforms. Please read the information about the Curator Approval process on our
				<a href="/guide" class="link underline underline-offset-2">Guide</a>.
			</p>
			<div class="buttons mt-5 flex">
				<button class="button-cancel mr-5">RETURN HOME</button>
				<button on:click={submit} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else}
		<div class="content">
			<div>
				<div>
					<p class="text-xs mb-1">Treasury track</p>
					<select class="border w-1/4 rounded-md h-7 px-1 pt-1" name="spenders" id="spenders">
						<option value="small">Small Spender</option>
						<option value="medium">Medium Spender</option>
						<option value="big">Big Spender</option>
					</select>
					<p class="text-xs mt-1">(preselected based on Bounty value)</p>
				</div>

				<hr class="border-white mt-5 mb-3 w-96" />

				<p class="text-xs mb-1">Submit with account</p>
				<select class="border w-1/4 rounded-md h-7 px-1 pt-1" name="accounts" id="accounts">
					<option value="alice">Alice</option>
					<option value="bob">Bob</option>
				</select>

				<div class="mt-5 h-24 mb-10">
					<section class="mb-3">
						<p class="label text-xs">Deposit</p>
						<p class="value"><span>1,067.0000</span> DOT</p>
					</section>
					<section>
						<p class="label text-xs">Transaction fee</p>
						<p class="value"><span>0,000.0800</span> DOT</p>
					</section>
				</div>
			</div>
			<div class="buttons flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={submit} class="button-active">SUBMIT</button>
			</div>
		</div>
	{/if}
</div>
