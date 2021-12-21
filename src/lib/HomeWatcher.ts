import {NS, Server} from "Bitburner";
import {Constants} from "/lib/Constants";

class HomeWatcher {
    readonly ns: NS;
    readonly HomeLiteral = "home";
    readonly Home: Server;

    constructor(ns: NS) {
        this.ns = ns;
        this.Home = this.ns.getServer(this.HomeLiteral);
    }

    get maxSecurityLevel(): number {
        return (
            +this.ns.fileExists(Constants.PurchaseableProgram.BruteSSH, this.HomeLiteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.FTPCrack, this.HomeLiteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.RelaySMTP, this.HomeLiteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.HTTPWorm, this.HomeLiteral) +
            +this.ns.fileExists(Constants.PurchaseableProgram.SQLInject, this.HomeLiteral)
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
