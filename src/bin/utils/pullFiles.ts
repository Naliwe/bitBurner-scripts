import type {NS} from "Bitburner";
import {RepoInit, TermLogger} from "/lib/Helpers";

export async function main(ns: NS) {
    var logger = new TermLogger(ns);
    var initRepo = new RepoInit(ns, logger);

    await initRepo.getManifest();
    await initRepo.downloadAllFiles();
}
