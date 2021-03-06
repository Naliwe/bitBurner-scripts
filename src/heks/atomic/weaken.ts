import {NS} from "Bitburner";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const target = ns.args[0] as string;

    await ns.weaken(target);
}
