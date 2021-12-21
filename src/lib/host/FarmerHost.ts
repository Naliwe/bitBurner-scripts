import {NS} from "Bitburner";
import {IHekkerHost} from "/lib/host/IHekkerHost";
import {HekkerBot} from "/lib/bots/HekkerBot";

class FarmerHost<TBot extends HekkerBot> implements IHekkerHost {
    readonly ns: NS;
    readonly name: string;
    readonly ram: number;
    readonly target: string;
    readonly bot: TBot;

    constructor(ns: NS, name: string, ram: number, target: string, c: new (ns: NS, host: string, target: string) => TBot) {
        this.ns = ns;
        this.name = name;
        this.ram = ram;
        this.target = target;
        this.bot = new c(ns, this.name, target);
    }

    get hostData() {
        return this.ns.getServer(this.name);
    }

    public async farm(): Promise<boolean> {
        if (!this.buyHost())
            return false;

        return await this.bot.hekk();
    }

    private buyHost(): boolean {
        if (this.ns.serverExists(this.name))
            return true;
        return this.ns.purchaseServer(this.name, this.ram) != "";
    }
}

export {FarmerHost};
