import {NS} from "Bitburner";
import {TestLogger} from "/lib/logger/ILog";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const logger = new TestLogger(ns);

    logger.info(`Deploying fleet to attack rho-construction`);

    if (!ns.exec("/bin/deployFleet.ns", "home", 1, "Rho", "rho-construction", 5)) {
        logger.info(`+++ Fleet launch success!`);
    } else {
        logger.err(`!!! Failed launching fleet!`);
    }
}
