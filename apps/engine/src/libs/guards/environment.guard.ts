import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Environments } from "../decorators/environment.decorator";

@Injectable()
export class EnvironmentGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const environments = this.reflector.get(
            Environments,
            context.getHandler(),
        );

        if (!environments) {
            return true;
        }

        const available = environments.includes(process.env.NODE_ENV);

        if (!available) {
            throw new ForbiddenException({
                status: "error",
                message: "Forbidden resource",
            });
        }

        return true;
    }
}
