declare const module: any;

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { name } from "@d1stack/sdk";

async function bootstrap() {
    console.log("sdk name", { name });

    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();
