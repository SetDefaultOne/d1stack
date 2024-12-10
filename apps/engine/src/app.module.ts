import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { EnvironmentGuard } from "./libs/guards/environment.guard";
import { ConfigModule } from "@nestjs/config";
import { validateEnvironment } from "./utils/environment";
import appConfig from "./app.config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
            expandVariables: true,
            validate: validateEnvironment,
            load: [appConfig],
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: EnvironmentGuard,
        },
    ],
})
export class AppModule {}
