import {NS} from "Bitburner";
import {BasicSecurity, TermLogger} from "/lib/Helpers";
import {HekkerBot} from "/lib/bots/HekkerBot";

class SecurityAwareBot implements HekkerBot {
    ns: NS;
    host: string;
    target: string;
    hekScript: string;
    logger: TermLogger;

    constructor(ns: NS, host: string, target: string) {
        this.ns = ns;
        this.hekScript = "/heks/hek_target.ns";
        this.host = host;
        this.target = target;
        this.logger = new TermLogger(ns);
    }

    async hekk(): Promise<boolean> {
        if (!(await this.uploadHek())) {
            this.logger.err(`\tFailed during upload.`);
            return false;
        }

        if (!this.prepare(this.host)) return false;

        if (this.host != this.target && !this.prepare(this.target)) return false;

        if (!(await this.execHek())) {
            this.logger.err(`Bot failed during execution.`);
            return false;
        }

        return true;
    }

    public toString() {
        return `Bot { ${this.hekScript}: ${this.host} -> ${this.target} }`;
    }

    private prepare(target: string): boolean {
        if (this.checkRoot(target)) {
            this.logger.warn(`\t>>> Already root on ${target}`);
            return true;
        }

        const targetNbPortsReq = this.ns.getServerNumPortsRequired(target);
        const maxSecLvl = BasicSecurity.maxSecurityLevel(this.ns);

        if (maxSecLvl < targetNbPortsReq) {
            this.logger.err(`\t!!! Tooling too low level to hack target ${target}`);
            return false;
        }

        this.logger.info(`\tGaining root access on ${target}`);
        BasicSecurity.break(this.ns, target, maxSecLvl);

        return true;
    }

    private checkRoot(target: string) {
        return this.ns.hasRootAccess(target);
    }

    private async uploadHek(): Promise<boolean> {
        this.logger.info(`\tUploading ${this.hekScript} to ${this.host}`);

        if (!(await this.ns.scp(this.hekScript, "home", this.host))) {
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

        this.logger.info(`\tTrying to run ${this.toString()} -t ${nbThreads}`);

        if (this.ns.killall(this.host)) {
            this.logger.info(`\tKilled all on ${this.host}`);
        } else {
            this.logger.warn(`\tNothing running on ${this.host}`);
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

export {SecurityAwareBot};
