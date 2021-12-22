import {NS} from "Bitburner";
import {SimpleBot} from "/lib/bots/HekkerBot";

const level0Targets = [
    "n00dles",
    "foodnstuff",
    "sigma-cosmetics",
    "joesguns",
    "hong-fang-tea",
    "harakiri-sushi",
];

/** @param {NS} ns **/
export async function main(ns: NS) {
    for (let bot of level0Targets.map(t => new SimpleBot(ns, t))) {
        if (await bot.hekk()) {
            ns.tprintf(`INFO   > Bot launch success \\o/`);
        } else {
            ns.tprintf(`ERROR  > Bot launch failure :(`);
        }
    }
}
