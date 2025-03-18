<script lang="ts">
	import Dropdown from '../../components/common/DropdownMenu.svelte';
	import type { Labeled } from '../../components/common/labeled';

	const headings: Labeled[] = [
		{ label: 'Logging in', targetId: 'login' },
		{ label: 'Curator Interface', targetId: 'curatorInterface' },
		{ label: 'Bounty Setup', targetId: 'bountySetup' },
		{ label: 'Miscellaneous', targetId: 'miscellaneous' }
	];

	function scrollToSection(item: Labeled) {
		if (item.targetId) {
			const section = document.getElementById(item.targetId);
			if (section) {
				section.scrollIntoView({ behavior: 'smooth' });
			}
		}
	}
</script>

<div class="container">
	<Dropdown
		items={headings}
		selectedItem={headings[0]}
		change={scrollToSection}
		widthContainer="w-[353px]"
		widthDropdown="w-[353px]"
		textAlign="text-start"
		useLogos={false}
		bgColor="pink"
		backgroundColorContainer="bg-backgroundButtonLight"
		height="h-[50px]"
		positionOverlay="-mt-[50px]"
	/>

	<section class="manual">
		<h2 class="heading" id="login">Logging in</h2>
		<h3 class="subheading">Login and displayed information</h3>
		<p>
			Users can log into Bounty Manager using various wallets and will see information relevant to
			the logged in address. <br />
			The currently supported methods of logging in with curator pure-proxy addresses are Multix, Mimir
			and Talisman Signet. <br />
			Logging in with a private wallet allows the user to create a bounty and its approval referenda.
			WalletConnect can be used to connect with any wallet, also from a different device, by scanning
			the QR code with your camera. <br />
			<br />
			You can log out by clicking the burger menu, next to your username on the top right corner.
			<br />
			<br />
			We are currently working on a solution that allows curators to log in directly with their private
			accounts. The tool will automatically recognize their curator-multisig affiliation, further simplifying
			the login process.
		</p>

		<h3 class="subheading">Multix login</h3>
		<p>To connect with Multix:</p>
		<ol class="list">
			<li>Click on "Connect Wallet" in the top-right corner of this page.</li>
			<li>Select "WalletConnect".</li>
			<li>
				Copy the key by clicking the button next to "Connect your wallet" at the top of the pop-up.
			</li>
			<li>
				<a
					href="https://multix.chainsafe.io/settings"
					target="_blank"
					rel="noreferrer"
					class="link"
				>
					Open Multix in a new tab
				</a> in a new tab and ensure you have selected the correct Pure Proxy account from the dropdown.
			</li>
			<li>
				Navigate to the settings tab on Multix, expand the WalletConnect line and paste the key.
			</li>
			<li>Approve the connection request.</li>
			<li>Switch back to Bounty Manager.</li>
			<li>
				Identify the correct Pure Proxy account from the two available and select it to sign in.
			</li>
		</ol>
		<p>
			Please pay attention to step 4 if multiple multisig accounts are available in your Multix
			wallet. Additionally, WalletConnect does not provide the account names to the connection, so
			if your curator proxy does not have a confirmed identity on People Chain (the green tick
			before the name), only the addresses will be displayed.
		</p>

		<h3 class="subheading">Mimir login</h3>
		<p>To connect with Mimir:</p>
		<ol class="list">
			<li>
				Navigate to the <a
					href="https://app.mimir.global/"
					target="_blank"
					rel="noreferrer"
					class="link"
				>
					Mimir
				</a> website.
			</li>
			<li>
				Connect your wallet and select the correct curator address by clicking on the username on
				the upper left corner.
			</li>
			<li>Navigate to the apps category on the left sidebar and select Bounty Manager.</li>
			<li>Click on Connect Wallet, select Mimir and select your account from the dialog.</li>
		</ol>

		<h3 class="subheading">Talisman Signet login</h3>
		<p>To connect with Talisman Signet:</p>
		<ol class="list">
			<li>
				Follow the <a
					href="https://guide.polkadotmultisig.com/en/category/connecting-to-dapps/article/signing-into-a-dapp-using-polkadot-multisig"
					target="_blank"
					rel="noreferrer"
					class="link"
				>
					instructions
				</a> on how to add the proxied account into your Talisman extension.
			</li>
			<li>
				On Bounty Manager, select Talisman from the wallet selector and choose the proxied account.
			</li>
		</ol>

		<h3 class="subheading">Other Polkadot wallets</h3>
		<p>
			Currently, most wallets do not support multisig and proxy accounts, so logging in with them
			would only allow the user to start the creation of a new bounty and its respective referenda. <br
			/>
			<br />
			To sign in with a private account, select your wallet from the list and give Bounty Manager permission
			to access accounts from it. <br />
			<br />
			Using the WalletConnect functionality, you can also connect with any other wallet that supports
			it.
		</p>

		<h3>Single signer accounts</h3>
		<p>
			The bounty manager also supports functionality for single signer accounts that are part of a
			multisig.
		</p>

		<h2 class="heading" id="curatorInterface">Curator Interface</h2>
		<p>
			Having logged in with a curator account, you will automatically see the bounty associated with
			the account, information and actions presented as buttons.
		</p>

		<h3 class="subheading">UI breakdown</h3>
		<p>
			The upper part of the UI is dedicated to parent bounty information. <br />
			Here you will see the remaining balance of the parent bounty, the expiration date, the curators
			information, as well as links to view the bounty on external platforms and the extend bounty button.
			<br />
			<br />
			The lower part is dedicated to child bounties and their respective actions. <br />
			Depending on child bounty status, different information and buttons will be present. <br />
			You will find links to external platforms for each child bounty and you can filter on status.
			<br />
		</p>

		<h3 class="subheading">Child Bounty creation</h3>

		<h4 class="sectionTitle">Creating complete payouts</h4>
		<p>
			You can create a complete payout in a single transaction, by having the calls to create the
			child bounty, assign the logged in address as sub-curator, accept the role, award it and claim
			it batched into one. <br />
			<br />
			Clicking on the “BATCH” button will open a dialog box where you can enter the title, value, sub-curator
			fee and beneficiary address for the child bounty. <br />
			<br />
			You can create multiple payouts in one transaction by clicking on the “Run several in one transaction”
			button. <br />
			<br />
			Once the transaction is complete, the child bounties will be created, claimed, and displayed as
			"claimed" in the UI. <br />
		</p>
		<p class="note">
			Please note: Currently, the child bounty’s index is estimated by using the highest available
			on the blockchain, which you can see in the first field. <br />
			The index will update automatically any time a new child bounty is created but we still give users
			the option to manually increment it if they expect a long waiting time between creation of transaction
			and execution. <br />
			If another bounty creates a child bounty between this transaction’s creation and execution after
			the signatories sign it, this transaction will fail and the child bounty will not be created. For
			the highest likelihood of success, ensure that the signatories confirm the transaction as soon
			as possible after its creation. <br />
			<br />
			An upcoming Polkadot runtime upgrade will link child bounty indexing to their parent bounties,
			simplifying the process and thus reducing the risk of failure.
		</p>

		<h4 class="sectionTitle">Adding Child Bounties</h4>
		<p>
			Clicking on the “ADD” button will open a dialog box, where you can enter the title and value
			for the child bounty to be created. <br />
			<br />
			To create multiple child bounties in one transaction, click “Add several in one transaction".
			<br />
			<br />
			After the transaction is complete (when it is signed by the other signatories and executed) you
			will see the newly created child bounties in the UI with status “added”.
		</p>

		<h3 class="subheading">Child Bounty actions</h3>
		<h4 class="sectionTitle">Batch call (Add Child Bounty)</h4>
		<p>
			Clicking on the “BATCH” button in child bounties with the “added” status will open a dialog
			box, where you can enter the sub-curator fee and beneficiary address. <br />
			<br />
			This will combine assigning the proxy address as sub-curator, accepting the role, awarding to the
			beneficiary address and claiming the child bounty in one transaction. <br />
			You can optionally leave the claim transaction out, if you expect the beneficiary to claim the
			payout themselves. <br />
			<br />
			After the transaction is completed, the child bounty will have been claimed, or be ready to claim.
		</p>

		<h4 class="sectionTitle">Status based actions</h4>
		<h5 class="subsectionTitle">Propose Sub-curator</h5>
		<p>
			On child bounties with the status “added”, clicking on the “ASSIGN” will bring up a dialog
			box, with an input field for the address of the sub-curator. <br />
			It’s possible to assign the parent bounty proxy, or any other account for this role. <br />
			<br />
			After the transaction is completed, the child bounty will be updated to status “sub-curator proposed”.
		</p>

		<h5 class="subsectionTitle">Accept Sub-curator role</h5>
		<p>
			If the logged in account has been proposed as a sub-curator for a child bounty, the “ACCEPT”
			button will be presented in the child bounty card. <br />
			Clicking the button will open a dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the child bounty will be updated to status “active”.
		</p>

		<h5 class="subsectionTitle">Award Child Bounty</h5>
		<p>
			If the logged in account is the sub-curator for a child bounty and it is in status “active”,
			the “AWARD” button will be presented in the child bounty card. <br />
			Clicking the button will open a dialog box with an input field for the beneficiary’s address.
			<br />
			<br />
			After the transaction is completed, the child bounty will be updated to status “awarded”.
		</p>

		<h5 class="subsectionTitle">Claim Child Bounty</h5>
		<p>
			On child bounties with the status “awarded”, clicking on the “CLAIM” button will bring up a
			dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the child bounty will be updated to status “claimed” and its
			value will be transferred to the beneficiary’s account. <br />
		</p>

		<h4 class="sectionTitle">Additional actions</h4>
		<h5 class="subsectionTitle">Reassign Sub-curator</h5>
		<p>
			On child bounties with the status “sub-curator proposed”, clicking on the “REASSIGN” button
			will bring up a dialog box, with an input field for the address of the sub-curator. <br />
			<br />
			After the transaction is completed, the child bounty will remain in status “sub-curator proposed”,
			and the newly entered address will replace the previously proposed one.
		</p>

		<h5 class="subsectionTitle">Unassign Sub-curator</h5>
		<p>
			On child bounties with the status “active”, clicking on the “UNASSIGN” button will bring up a
			dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the child bounty will return to status “added” and a new sub-curator
			can be proposed.
		</p>

		<h5 class="subsectionTitle">Close Child Bounty</h5>
		<p>
			On child bounties that have not yet been awarded, the “CLOSEDOWN” button can be found in the
			expandable bar at the bottom of the card. <br />
			Clicking on the button will bring up a dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the child bounty will be closed and its value returned to the
			parent bounty.
		</p>

		<h3 class="subheading">Parent Bounty actions</h3>
		<h4 class="sectionTitle">Extend Bounty</h4>
		<p>
			Clicking on the EXTEND button in the parent bounty area will bring up a dialog box with a
			confirmation toggle and information on the current and projected new expiration date. <br />
			<br />
			You will also find an additional toggle in most dialog boxes to batch the bounty extension extrinsic
			in your transaction. <br />
			<br />
			After the transaction is completed, the bounty’s expiration date will be extended by 90 days.
		</p>

		<h4 class="sectionTitle">Show Curators & Pay Salaries</h4>
		<p>
			Clicking on the “SHOW & PAY CURATORS” button will bring up a dialog box showing the curator
			proxy address and the signatories. <br />
			Clicking on the “SALARY PAYOUTS” button within the dialog box will bring up a new dialog box to
			construct the payments. <br />

			<br />
			The input in the title field will be used for each child bounty created appended by the address
			(or name if existing) of each signatory. <br />
			<br />
			You can enter the total sum in the input field to split evenly among the curators, or edit amounts
			individually for each. <br />
			<br />
			After the transaction is completed, a child bounty will be created for each curator signatory that
			was assigned a payment, with the given title appended by the respective curator.
		</p>

		<h4 class="sectionTitle">Accept Curator role</h4>
		<p>
			On a bounty with status “curator proposed”, the “ACCEPT” button will be presented if you are
			logged in with the curator address. <br />
			Clicking on the button will bring up a dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the bounty will move to “active” status and the UI will update
			to show action buttons.
		</p>

		<h4 class="sectionTitle">Additional actions</h4>
		<h5 class="subsectionTitle">Award Bounty</h5>
		<p>
			If a bounty currently has no active child bounties, the possibility to award it is presented
			with a “READ FIRST” button at the bottom. <br />
			Clicking the button will bring up a dialog box with a warning and an input field for the beneficiary
			address. <br />
			<br />
			After the transaction is completed, the bounty will move to “payout pending” status and will be
			ready to be claimed.
		</p>

		<h5 class="subsectionTitle">Claim Bounty</h5>
		<p>
			On a bounty with “payout pending” status, the “CLAIM” button will be presented. <br />
			Clicking the button will bring up a dialog box with a confirmation toggle. <br />
			<br />
			After the transaction is completed, the bounty will move to “claimed status” and the balance transferred
			to the beneficiary’s account.
		</p>

		<h2 class="heading" id="bountySetup">Bounty Setup</h2>
		<p>
			Users can create a new bounty and start the referenda for its approval and curator proposal
			through this process. <br />
			Click on the Create New Bounty button inside the burger menu next to your username to begin.
			<br />
			<br />
			Note: The bounty setup process transactions will be executed directly with the logged in account,
			as no association to a multisig or proxy is possible, if logged in with your private account.
			<br />
			To use a proxy or multisig, please use either Multix or Mimir to sign in.
		</p>

		<h4 class="sectionTitle">Creation</h4>
		<p>
			Fill in the input fields for Title and Value of the bounty. Submitting the transaction will
			note the new Bounty on the chain and it will show up on the UI.
		</p>

		<h4 class="sectionTitle">Approval</h4>
		<p>
			Once the bounty is created, you can proceed to the “Approval” tab in the UI. <br />
			You can also land here at a later point by clicking the referendum button on the bounty card. The
			spending track will be automatically selected according to the value of the bounty, however you
			can still select a higher one in the rare case the track is currently congested and doesn’t allow
			additional referenda. <br />
			<br />
			After successfully submitting the referendum, please navigate to one of the social platforms through
			the included links (Subsquare/ Polkassembly) to update the proposal description according to the
			community guidelines and place the decision deposit.
		</p>

		<h4 class="sectionTitle">Curator Proposal</h4>
		<p>
			After the bounty has been approved and funded, the button to start the curator proposal
			referendum will appear on the bounty card. <br />
			Clicking on it will redirect you to the form with input fields for the curator address and curator
			fee. <br />
			Please make sure to enter a valid pure proxy address for the curator. <br />
			The spending track will be preselected according to the spending track of the approval referendum,
			however you can still select a higher one in the rare case the track is currently congested and
			doesn’t allow additional referenda. <br />
			<br />
			After successfully submitting the referendum, please navigate to one of the social platforms through
			the included links (Subsquare/ Polkassembly) to update the proposal description according to the
			community guidelines and place the decision deposit.
		</p>

		<h2 class="heading" id="miscellaneous">Miscellaneous</h2>
		<h4 class="sectionTitle">Serverless architecture</h4>
		<p>
			Bounty Manager is designed as a 100% front-end application, relying directly on the Polkadot
			blockchain itself to fetch most of the information. <br />
			The
			<a href="https://github.com/opensquare-network" target="_blank" rel="noreferrer" class="link">
				OpenSquare
			</a> indexers are used to display data that is not available on the state storage.
		</p>

		<h4 class="sectionTitle">Responsive design</h4>
		<p>
			Built with responsive design from the start, you can explore the website on any device and log
			in through mobile wallets.
		</p>

		<h4 class="sectionTitle">GitHub</h4>
		<p>
			You can find the project repository <a
				href="https://github.com/galaniprojects/Polkadot-Bounty-Manager"
				target="_blank"
				rel="noreferrer"
				class="link"
			>
				here
			</a>.
		</p>

		<h4 class="sectionTitle">Contact</h4>
		<p>
			You can contact us through <a
				href="https://t.me/bounty_manager_feedback"
				target="_blank"
				rel="noreferrer"
				class="link"
			>
				Telegram
			</a>
			or
			<a href="bountymanager@galaniprojects.com" class="link"> Email </a>.
		</p>
	</section>
</div>

<style>
	.container {
		width: 756px;
		margin: auto;
		padding: 25px 0px;
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.manual {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.heading {
		font-size: 40px;
		font-weight: 800;
	}

	.subheading {
		font-size: 24px;
		font-weight: 700;
	}

	.sectionTitle {
		font-size: 20px;
		font-weight: 600;
	}

	.subsectionTitle {
		font-size: 18px;
		font-weight: 500;
	}

	.list {
		list-style-type: decimal;
		list-style-position: inside;
	}

	.link {
		text-decoration-line: underline;
	}

	.note {
		font-style: italic;
	}
</style>
