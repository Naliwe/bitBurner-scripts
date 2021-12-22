import {NS} from "Bitburner";
import {TestLogger} from "/lib/logger/ILog";
import {BasicSecurity} from "/lib/Helpers";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const logger = new TestLogger(ns);

    if (ns.args.length < 1) {
        logger.err(`Usage: breakHost target`);
        ns.exit();
    }

    const target = ns.args[0] as string;

    logger.info(`Trying to break target ${target}`);

    const thisLevel = BasicSecurity.maxSecurityLevel(ns);
    const targetLevel = ns.getServerNumPortsRequired(target);

    if (targetLevel > thisLevel) {
        logger.err(`\t!!! This target needs tool level ${targetLevel} and we only have ${thisLevel}`);
        ns.exit();
    } else {
        BasicSecurity.break(ns, target, thisLevel);
    }

    logger.info(`+++ Successfully broke target ${target}`);
}
