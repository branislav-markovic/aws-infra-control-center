export interface AWSCommand {
    label?: string;
    description?: string;

    execute(): Promise<void>;
}