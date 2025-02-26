import type { AccountInfo, MultisigInfo } from "../types/account";
import type { Bounty } from "../types/bounty";

export function getRelevantMultisig(bounty: Bounty, account: AccountInfo): MultisigInfo | undefined {
    const multisigs =  account.multisigs?.filter((multisig)=> multisig.address === bounty.curatorMultisigAccount )
    if(multisigs?.length !== 1){
        return undefined
    }
    return multisigs[0]
}