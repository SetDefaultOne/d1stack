import { HttpAdapterHost, NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import appConfig, { AppConfiguration } from "./app.config";
import {
    ClassSerializerInterceptor,
    ValidationPipe,
    VersioningType,
} from "@nestjs/common";
import { generateValidationException } from "./utils/validation";
import { GlobalExceptionsFilter } from "./libs/filters/exception.filter";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = app.get<AppConfiguration>(appConfig.KEY);

    app.enableCors({
        origin: true,
        credentials: true,
    });

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
    });

    app.useGlobalPipes(
        new ValidationPipe({
            always: true,
            whitelist: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: generateValidationException,
        }),
    );

    app.useGlobalInterceptors(
        new ClassSerializerInterceptor(app.get(Reflector)),
    );

    app.useGlobalFilters(new GlobalExceptionsFilter(app.get(HttpAdapterHost)));

    await app.listen(config.deployment.port);
}

bootstrap();
