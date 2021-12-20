import {NS, Server} from "Bitburner";
import {Constants} from "/lib/Constants";

class HomeWatcher {
    readonly ns: NS;
    readonly HomeLitteral = "home";
    readonly Home: Server;

    constructor(ns: NS) {
        this.ns = ns;
        this.Home = this.ns.getServer(this.HomeLitteral);
    }

    get maxSecurityLevel(): number {
        return (
            +this.ns.fileExists(Constants.PurchaseableProgram.BruteSSH, this.HomeLitteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.FTPCrack, this.HomeLitteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.RelaySMTP, this.HomeLitteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.HTTPWorm, this.HomeLitteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.SQLInject, this.HomeLitteral)
        );
    }

    public toString(): string {
        return `HomeWatcher {
          maxRAM            = ${this.Home.maxRam}
          maxSecurityLevel  = ${this.maxSecurityLevel}
      }`
    }
}

export {HomeWatcher};
