import { ClassConstructor, plainToInstance } from "class-transformer";
import { UserEntity } from "../entities/user";

export const entities = {
    [UserEntity._entityName]: UserEntity,
};

export function isSerializedEntity(
    object: unknown,
): object is { _entityName: string } & object {
    return (
        object !== null &&
        typeof object === "object" &&
        "_entityName" in object &&
        typeof object._entityName === "string" &&
        object._entityName in entities
    );
}

export function deserializeEntity(object: unknown) {
    if (!isSerializedEntity(object)) return object;

    const entity = entities[object._entityName];

    if (entity) {
        return plainToInstance(entity as ClassConstructor<unknown>, object);
    }

    return object;
}
