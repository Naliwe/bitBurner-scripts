import {NS} from "Bitburner";
import {TermLogger} from "/lib/Helpers";

interface HekkerBot {
    readonly ns: NS;
    readonly host: string;
    readonly target: string;
    readonly hekScript: string;

    hekk(): Promise<boolean>;
}

class SimpleBot implements HekkerBot {
    readonly ns: NS;
    readonly host: string;
    readonly target: string;
    readonly hekScript: string;
    readonly logger: TermLogger;

    constructor(ns: NS, target: string, logger: TermLogger = new TermLogger(ns)) {
        this.ns = ns;
        this.hekScript = "/heks/hgw_target.ns";
        this.host = target;
        this.target = target;
        this.logger = logger;
    }

    async hekk(): Promise<boolean> {
        this.logger.info(
            `Starting heks from script ${this.hekScript} on ${this.target}`
        );

        this.logger.info(`\tTrying to nuke ${this.target} ...`);

        this.checkRoot();

        if (!(await this.uploadHek())) {
            this.logger.err(`Bot failed during upload.`);
            return false;
        }

        if (!(await this.execHek())) {
            this.logger.err(`Bot failed during execution.`);
            return false;
        }

        return true;
    }

    private checkRoot() {
        if (this.ns.hasRootAccess(this.target)) {
            this.logger.warn(`\t>>> Already root on ${this.target}`);
            return;
        }

        this.ns.nuke(this.target);
    }

    private async uploadHek(): Promise<boolean> {
        this.logger.info(`\tUploading ${this.hekScript} to ${this.host}`);

        if (!(await this.ns.scp(this.hekScript, "home", this.target))) {
            this.logger.err(
                `\t!!! Could not upload ${this.hekScript} to ${this.host}`
            );
            return false;
        }

        return true;
    }

    private async execHek(): Promise<boolean> {
        const nbThreads = Math.floor(
            this.ns.getServerMaxRam(this.host) / this.ns.getScriptRam(this.hekScript)
        );

        this.logger.info(
            `\tTrying to run ${this.hekScript}: ${this.host} -> ${this.target} -t ${nbThreads}`
        );

        if (this.ns.killall(this.host)) {
            this.logger.info(`\tKilled all on ${this.host}`);
        } else {
            this.logger.err(`\tNothing running on ${this.host}`);
        }

        if (this.ns.exec(this.hekScript, this.host, nbThreads, this.target) == 0) {
            this.logger.err(
                `\t!!! Failed to run ${this.hekScript}: ${this.host} -> ${this.target}`
            );
            return false;
        }

        return true;
    }
}

export {HekkerBot, SimpleBot};
