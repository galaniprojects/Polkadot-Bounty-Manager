<script>
	let step = 1;
	let bounty = {
		id: '#88',
		title: 'Community Event Activity Bounty'
	};

	function submit() {
		step = (step % 3) + 1;
	}
</script>

<div>
	<div class="top-bar flex justify-between text-white">
		<p class="title text-2xl leading-7">{`${bounty.id} ${bounty.title}`}</p>
		<p class="text text-sm mt-1.5">
			<span class="opacity-50">Need more information about the Bounty Setup process? </span>
			Tap here
		</p>
	</div>

	{#if step === 1}
		<div class="content">
			<p class="description">
				As standard practice, this action is performed after the Bounty has been funded.
				<br /><br />
				However if you want to proceed and already have a list of curators to propose, it is possible
				to do so.
				<br />
			</p>

			<div class="mt-5 flex">
				<button class="button-cancel mr-5">LIST</button>
				<button on:click={() => submit()} class="button-active">PROCEED</button>
			</div>
		</div>
	{:else if step === 2}
		<div class="content">
			<div>
				<div>
					<p class="description mb-2">
						It is highly recommended to use a pure proxy multisig address for the curators!
					</p>
					<p class="text-xs my-1">Curator Address</p>
					<input
						class="border w-1/2 pt-1 pl-2 rounded-md bg-white mr-2"
						placeholder="5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
					/>
					<p class="text-xs my-1">Curator Fee</p>
					<input class="border pt-1 pl-2 rounded-md bg-white mr-2 w-1/3" placeholder="100.0000" />
					<p class="text-xs mt-1">(total Bounty value: 100.000.0000 DOT)</p>
				</div>

				<hr class="border-white w-1/2 mt-5 mb-3" />

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
			<div class="flex">
				<button class="button-cancel mr-5">CANCEL</button>
				<button on:click={() => submit()} class="button-active">SUBMIT</button>
			</div>
		</div>
	{:else}
		<div class="content">
			<p class="description">
				A Curator Proposal Referendum for <br />
				{`${bounty.id} ${bounty.title}`} <br />
				created successfully!
				<br /><br />
				Check the Referendum on
				<a href="/bs" class="link underline underline-offset-2">Polkassembly</a>. Please update the
				description if necessary and place the decision deposit within 7 days for the referendum to
				be valid.
				<br /> <br />
				You can go back to the list of all bounties.
			</p>
			<div class="buttons mt-5 flex">
				<button class="button-cancel mr-5">RETURN HOME</button>
				<button on:click={() => submit()} class="button-active">PROCEED</button>
			</div>
		</div>
	{/if}
</div>
