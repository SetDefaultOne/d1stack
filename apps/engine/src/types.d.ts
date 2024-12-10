import { EnvironmentVariablesType } from "./utils/environment";

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvironmentVariablesType {
            [key: string]: string | undefined;
        }
    }
}
