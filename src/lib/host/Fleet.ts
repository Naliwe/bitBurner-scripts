import {NS} from "Bitburner";
import {IHekkerHost} from "/lib/host/IHekkerHost";
import {ILog, TestLogger} from "/lib/logger/ILog";
import {FarmerHost} from "/lib/host/FarmerHost";
import {SecurityAwareBot} from "/lib/bots/SecurityAwareBot";

interface IFleet extends IService {
    readonly ns: NS;
    readonly hosts: IHekkerHost[];
    readonly targets: string[];
}

class DefaultFleet implements IFleet {
    readonly ns: NS;
    readonly name: string;
    readonly hosts: IHekkerHost[];
    readonly targets: string[];
    readonly logger: ILog;
    readonly pid: number = 0;

    isRunning: boolean = false;

    constructor(ns: NS, name: string, nbHosts: number, target: string, logger: ILog = new TestLogger(ns)) {
        this.ns = ns;
        this.name = name;
        this.hosts = [];
        this.targets = [target];
        this.logger = logger;

        for (let i = 0; i < nbHosts; ++i) {
            this.hosts.push(new FarmerHost(ns, `DF-${name}-${i}`, 512, target, SecurityAwareBot))
        }
    }

    async start(): Promise<boolean> {
        let success = 0;

        this.logger.info(`Starting service ${this.name} ...`);

        for (let host of this.hosts.map(h => h as FarmerHost<SecurityAwareBot>)) {
            this.logger.info(`Launching host ${host.name} -> ${host.target}`);

            if (!await host.farm()) {
                this.logger.err(`!!! Error with host ${host.name} -> ${host.target}`);
                continue;
            }

            this.logger.info(`+++ Host ${host.name} launched successfully`);
            ++success;
        }

        return success == this.hosts.length;
    }

    restart(): Promise<boolean> {
        return Promise.resolve(false);
    }

    status(): Promise<boolean> {
        return Promise.resolve(false);
    }

    stop(): Promise<boolean> {
        return Promise.resolve(false);
    }
}

export {IFleet, DefaultFleet};
