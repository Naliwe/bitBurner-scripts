import {NS} from "Bitburner";
import {IHekkerHost} from "/lib/host/IHekkerHost";
import {ILog, TestLogger} from "/lib/logger/ILog";
import {FarmerHost} from "/lib/host/FarmerHost";
import {SecurityAwareBot} from "/lib/bots/SecurityAwareBot";
import {Constants} from "/lib/Constants";
import {IService} from "/lib/services/IService";

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
    readonly portNumber: number = 10;

    isRunning: boolean = false;

    private readonly serviceScript = `export async function main(ns) {
      while (true) {
        ns.tprint("Pouet");
      }
    }`;

    constructor(ns: NS, name: string, nbHosts: number, target: string, logger: ILog = new TestLogger(ns)) {
        this.ns = ns;
        this.name = name;
        this.hosts = [];
        this.targets = [target];
        this.logger = logger;

        for (let i = 0; i < nbHosts; ++i) {
            this.hosts.push(new FarmerHost(
                ns,
                `DF-${name}-${i}`,
                Constants.ServerSize.G512,
                target,
                SecurityAwareBot
            ))
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

        this.logger.info(`Service ${this.name} started`);

        this.isRunning = true;

        return success == this.hosts.length;
    }

    async restart(): Promise<boolean> {
        return (
            await this.stop() &&
            await this.start()
        );
    }

    async status(): Promise<boolean> {
        return true;
    }

    async stop(): Promise<boolean> {
        this.logger.info(`Stopping service ${this.name} ...`);

        for (let host of this.hosts) {
            if (this.ns.killall(host.name)) {
                this.logger.info(`\t> Killed all on ${host.name}`);
            } else {
                this.logger.warn(`\t> Nothing running on ${host.name}`);
            }
        }

        this.logger.info(`+++ Service ${this.name} stopped`);

        this.isRunning = false;

        return true;
    }
}

export {IFleet, DefaultFleet};
