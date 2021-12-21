interface IService {
    readonly name: string;
    readonly pid: number;
    readonly isRunning: boolean;

    start(): Promise<boolean>;

    stop(): Promise<boolean>;

    restart(): Promise<boolean>;

    status(): Promise<boolean>;
}
