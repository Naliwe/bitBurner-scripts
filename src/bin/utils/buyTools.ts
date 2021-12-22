import {NS} from "Bitburner";
import {TermLogger} from "/lib/Helpers";
import {Constants} from "/lib/Constants";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const logger = new TermLogger(ns);

    logger.info("Trying to buy all tools");

    const programs = Object.keys(Constants.PurchasableProgram);

    for (let program of programs) {
        logger.info(`\tTrying to buy ${program}`);
        if (ns.fileExists(program)) {
            logger.warn(`\t> Already own ${program}`);
            continue;
        }
        if (ns.purchaseProgram(program)) {
            logger.info(`\tPurchased ${program}`);
        } else {
            logger.info(`\tFailed purchasing ${program}. Not enough money?`);
        }
    }
}
