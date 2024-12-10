import { plainToInstance } from "class-transformer";
import {
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Max,
    Min,
    validateSync,
    ValidationError,
} from "class-validator";

export enum DeploymentEnvironment {
    Development = "development",
    Production = "production",
    Test = "test",
}

class EnvironmentVariables {
    @IsOptional()
    @IsEnum(DeploymentEnvironment)
    @IsNotEmpty()
    NODE_ENV: DeploymentEnvironment;

    @IsString()
    @IsNotEmpty()
    HOST: string;

    @IsNumber()
    @Min(0)
    @Max(65535)
    @IsNotEmpty()
    PORT: number;
}

export type EnvironmentVariablesType = EnvironmentVariables;

export function validateEnvironment(config: Record<string, unknown>) {
    const validated = plainToInstance(EnvironmentVariables, config, {
        enableImplicitConversion: true,
    });

    const errors = validateSync(validated, {
        skipMissingProperties: false,
    });

    if (errors.length > 0) {
        throw new EnvironmentValidationException(errors);
    }

    return validated;
}

class EnvironmentValidationException extends Error {
    constructor(errors: ValidationError[]) {
        super();

        this.name = "Environment Validation Exception";
        this.message =
            "Environment variables could not be validated.\n\n" +
            errors.toString();
    }
}
