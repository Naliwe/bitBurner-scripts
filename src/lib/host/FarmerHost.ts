import {NS} from "Bitburner";
import {IHekkerHost} from "/lib/host/IHekkerHost";

class FarmerHost implements IHekkerHost {
    name: string;
    ns: NS;

    constructor(name: string, ns: NS) {
        this.name = name;
        this.ns = ns;
    }

    get hostData() {
        return this.ns.getServer(this.name);
    }
}
