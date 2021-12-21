import {NS} from "Bitburner";
import {Constants} from "/lib/Constants";

interface ILog {
    readonly ns: NS

    info(msg: string, ...args: string[]);

    warn(msg: string, ...args: string[]);

    err(msg: string, ...args: string[]);

    log(msg: string, ...args: string[]);
}

class TestLogger implements ILog {
    ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    info(msg: string, ...args: string[]) {
        this.ns.tprintf(`${Constants.LogLevel.INFO} ${msg}`, ...args);
    }

    warn(msg: string, ...args: string[]) {
        this.ns.tprintf(`${Constants.LogLevel.WARN} ${msg}`, ...args);
    }

    err(msg: string, ...args: string[]) {
        this.ns.tprintf(`${Constants.LogLevel.ERROR} ${msg}`, ...args);
    }

    log(msg: string, ...args: string[]) {
        this.ns.tprintf(`${Constants.LogLevel.TRACE} ${msg}`, ...args);
    }
}

export {ILog, TestLogger};
