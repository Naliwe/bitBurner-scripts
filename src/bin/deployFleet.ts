import {NS} from "Bitburner";
import {DefaultFleet} from "/lib/host/Fleet";

/** @param {NS} ns **/
export async function main(ns: NS) {
    if (ns.args.length < 3) {
        ns.tprintf(`ERROR\t> Usage: deployFleet hostBaseName target nbHosts`);
        ns.exit();
    }

    const hostBaseName = ns.args[0] as string;
    const target = ns.args[1] as string;
    const nbHosts = ns.args[2] as number;

    const fleet = new DefaultFleet(
        ns,
        hostBaseName,
        nbHosts,
        target
    );

    await fleet.start();
}
