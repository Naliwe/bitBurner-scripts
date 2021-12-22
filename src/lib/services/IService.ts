interface IService {
    readonly name: string;
    readonly pid: number;
    readonly isRunning: boolean;
    readonly portNumber: number;

    start(): Promise<boolean>;

    stop(): Promise<boolean>;

    restart(): Promise<boolean>;

    status(): Promise<boolean>;
}

export {IService};
