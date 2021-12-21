import {NS} from "Bitburner";
import {DefaultFleet} from "/lib/host/Fleet";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const fleet = new DefaultFleet(ns, "First", 5, "rho-construction");

    await fleet.start();
}
