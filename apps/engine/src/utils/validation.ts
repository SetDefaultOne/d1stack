import { BadRequestException, ValidationError } from "@nestjs/common";

export function generateValidationException(
    errors: ValidationError[],
): BadRequestException {
    const messages: Record<string, string | string[]> = {};

    for (const error of errors) {
        const constraints = Object.values(error.constraints || []);

        if (constraints.length > 1) {
            messages[error.property] = [];

            for (const constraint of constraints) {
                (messages[error.property] as string[]).push(constraint);
            }
        } else {
            messages[error.property] = constraints[0] as string;
        }
    }

    return new BadRequestException({
        status: "fail",
        message: "Input validation failed",
        data: messages,
    });
}
