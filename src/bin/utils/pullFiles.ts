import type {NS} from "Bitburner";
import {RepoInit, TermLogger} from "/lib/Helpers";

/** @param {NS} ns **/
export async function main(ns: NS) {
    const logger = new TermLogger(ns);
    const initRepo = new RepoInit(ns, logger);

    await initRepo.getManifest();
    await initRepo.downloadAllFiles();
}
