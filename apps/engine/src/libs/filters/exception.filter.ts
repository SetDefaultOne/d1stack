import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Response } from "express";
import { Socket } from "socket.io";

@Catch()
export class GlobalExceptionsFilter implements ExceptionFilter {
    private readonly logger = new Logger(GlobalExceptionsFilter.name);

    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const { httpAdapter } = this.httpAdapterHost;

        switch (host.getType()) {
            case "http": {
                const context = host.switchToHttp();

                if (exception instanceof HttpException) {
                    httpAdapter.reply(
                        context.getResponse<Response>(),
                        exception.getResponse(),
                        exception.getStatus(),
                    );

                    return;
                }

                httpAdapter.reply(
                    context.getResponse<Response>(),
                    {
                        status: "error",
                        message: "Unknown error",
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );

                if (exception instanceof Error) {
                    this.logger.error(exception, exception.stack);
                } else {
                    this.logger.error(exception);
                }

                break;
            }
            case "ws": {
                const context = host.switchToWs();
                const client = context.getClient<Socket>();

                if (exception instanceof HttpException) {
                    client.emit("exception", {
                        status: "error",
                        message: exception.getResponse(),
                        code: exception.getStatus(),
                    });

                    return;
                }

                client.emit("error", {
                    status: "error",
                    message: "Unknown error",
                });

                if (exception instanceof Error) {
                    this.logger.error(exception, exception.stack);
                } else {
                    this.logger.error(exception);
                }

                break;
            }
            default: {
                this.logger.error(exception);
            }
        }
    }
}
