import { registerAs } from "@nestjs/config";
import { DeploymentEnvironment } from "./utils/environment";

export const APP_CONFIG_NAMESPACE = "app";

export type AppConfiguration = {
    deployment: {
        environment: DeploymentEnvironment;
        host: string;
        port: number;
    };
};

export default registerAs(APP_CONFIG_NAMESPACE, () => {
    return {
        deployment: {
            environment: process.env.NODE_ENV,
            host: process.env.HOST,
            port: process.env.PORT,
        },
    } satisfies AppConfiguration;
});
