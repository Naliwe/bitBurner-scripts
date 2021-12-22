import {NS} from "Bitburner";
import {FarmerHost} from "/lib/host/FarmerHost";
import {SecurityAwareBot} from "/lib/bots/SecurityAwareBot";

/** @param {NS} ns **/
export async function main(ns: NS) {
    if (ns.args.length < 2) {
        ns.tprintf(`Usage: deploy_farmer host target`);
        ns.exit();
    }

    const name = ns.args[0] as string;
    const target = ns.args[1] as string;

    const host = new FarmerHost(ns, name, 256, target, SecurityAwareBot);

    await host.farm();
}
