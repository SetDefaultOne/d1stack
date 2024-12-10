import "reflect-metadata";
import { UsersCollection } from "./collections/users";

export class Sdk {
    readonly users = new UsersCollection({ endpoint: "users" }, this);

    constructor(public readonly options: SdkInitOptions) {}
}

export interface SdkInitOptions {
    apiUrl: `${"http" | "https"}://${string}/`;
    apiVersion: number;
}
