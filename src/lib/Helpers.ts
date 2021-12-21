import {NS} from "Bitburner";
import {Constants} from "/lib/Constants";

const ReadText = {
    readLines(ns: NS, file: string): string[] {
        return (ns.read(file) as string).split(/\r?\n/);
    },

    readNonEmptyLines(ns: NS, file: string): string[] {
        return ReadText.readLines(ns, file).filter(
            (x) => x.trim() != ""
        );
    },
};

const DownloadFiles = {
    async getfileToHome(ns: NS, source: string, dest: string) {
        const logger = new TermLogger(ns);
        logger.info(`Downloading ${source} -> ${dest}`);

        if (!(await ns.wget(source, dest, "home"))) {
            logger.err(`\tFailed retrieving ${source} -> ${dest}`);
        }
    },
};

const BasicSecurity = {
    HomeLiteral: "home",
    maxSecurityLevel(ns: NS): number {
        return (
            +ns.fileExists(
                Constants.PurchasableProgram.BruteSSH,
                BasicSecurity.HomeLiteral
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.FTPCrack,
                BasicSecurity.HomeLiteral
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.RelaySMTP,
                BasicSecurity.HomeLiteral
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.HTTPWorm,
                BasicSecurity.HomeLiteral
            ) +
            +ns.fileExists(
                Constants.PurchasableProgram.SQLInject,
                BasicSecurity.HomeLiteral
            )
        );
    },
    break(ns: NS, target: string, level: number) {
        if (level > 4) BasicSecurity.breakSQL(ns, target);
        if (level > 3) BasicSecurity.breakHTTP(ns, target);
        if (level > 2) BasicSecurity.breakSMTP(ns, target);
        if (level > 1) BasicSecurity.breakFTP(ns, target);
        if (level > 0) BasicSecurity.breakSSH(ns, target);

        ns.nuke(target);
    },
    breakSSH(ns: NS, target: string) {
        ns.brutessh(target);
    },
    breakFTP(ns: NS, target: string) {
        ns.ftpcrack(target);
    },
    breakSMTP(ns: NS, target: string) {
        ns.relaysmtp(target);
    },
    breakHTTP(ns: NS, target: string) {
        ns.httpworm(target);
    },
    breakSQL(ns: NS, target: string) {
        ns.sqlinject(target);
    },
};

class TermLogger {
    static readonly INFO_LITERAL = "INFO\t>";
    static readonly WARN_LITERAL = "WARN\t>";
    static readonly ERR_LITERAL = "ERROR\t>";
    static readonly TRACE_LITERAL = "TRACE\t>";

    readonly ns: NS;

    constructor(ns: NS) {
        this.ns = ns;
    }

    info(msg: string, ...args: string[]) {
        this.ns.tprintf(`${TermLogger.INFO_LITERAL} ${msg}`, ...args);
    }

    warn(msg: string, ...args: string[]) {
        this.ns.tprintf(`${TermLogger.WARN_LITERAL} ${msg}`, ...args);
    }

    err(msg: string, ...args: string[]) {
        this.ns.tprintf(`${TermLogger.ERR_LITERAL} ${msg}`, ...args);
    }

    log(msg: string, ...args: string[]) {
        this.ns.tprintf(`${TermLogger.TRACE_LITERAL} ${msg}`, ...args);
    }
}

interface RepoSettings {
    readonly baseUrl: string;
    readonly manifestPath: string;
}

const repoSettings: RepoSettings = {
    baseUrl: "http://localhost:9182",
    manifestPath: "/resources/manifest.txt",
};

class RepoInit {
    readonly ns: NS;
    readonly logger: TermLogger;

    constructor(ns: NS, logger: TermLogger) {
        this.ns = ns;
        this.logger = logger;
    }

    async getManifest() {
        const manifestUrl = `${repoSettings.baseUrl}${repoSettings.manifestPath}`;

        this.logger.info(`Getting manifest...`);

        await DownloadFiles.getfileToHome(
            this.ns,
            manifestUrl,
            repoSettings.manifestPath
        );
    }

    async downloadAllFiles() {
        const files = ReadText.readNonEmptyLines(
            this.ns,
            repoSettings.manifestPath
        );

        this.logger.info(`Contents of manifest:`);
        this.logger.info(`\t${files}`);

        for (let file of files) {
            const pair = RepoInit.getSourceDestPair(file);

            if (!pair) {
                this.logger.err(`Could not read line ${file}`);
            } else {
                await DownloadFiles.getfileToHome(this.ns, pair.source, pair.dest);
            }
        }
    }

    private static getSourceDestPair(line: string): { source: string; dest: string } | null {
        return line.startsWith("./")
            ? {
                source: `${repoSettings.baseUrl}${line.substring(1)}`,
                dest: line.substring(1),
            }
            : null;
    }
}

export {ReadText, TermLogger, RepoInit, DownloadFiles, BasicSecurity};
