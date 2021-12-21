import {NS} from "Bitburner";
import {SecurityAwareBot} from "/lib/bots/SecurityAwareBot";
import {Constants} from "/lib/Constants";

const farmers = Constants.level1Targets.concat(Constants.level2Targets).concat(Constants.level3Targets);

const target = "joesguns";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const bots = farmers.map(
        (farmer) => new SecurityAwareBot(ns, farmer, target)
    );

    for (let bot of bots) {
        ns.tprintf(`INFO   > Launching ${bot.toString()}`);
        if (await bot.hekk()) {
            ns.tprintf(`INFO   > Bot launch success \\o/`);
        } else {
            ns.tprintf(`ERROR  > Bot launch failure :(`);
        }
    }
}
