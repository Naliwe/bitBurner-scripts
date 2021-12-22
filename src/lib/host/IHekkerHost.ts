import {NS, Server} from "Bitburner";

interface IHekkerHost {
    readonly ns: NS;
    readonly name: string;
    readonly hostData: Server;
}

export {IHekkerHost};
