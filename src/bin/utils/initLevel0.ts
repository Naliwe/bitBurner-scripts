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

export async function main(ns: NS) {
    for (let target of level0Targets) {
        const bot = new SimpleBot(ns, target);

        if (await bot.hekk()) {
            ns.tprintf(`INFO   > Bot launch success \\o/`);
        } else {
            ns.tprintf(`ERROR  > Bot launch failure :(`);
        }
    }
}
