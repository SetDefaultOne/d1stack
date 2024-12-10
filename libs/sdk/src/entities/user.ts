import { Exclude, Transform } from "class-transformer";

export class UserEntity {
    @Exclude()
    static _entityName = "UserEntity";

    @Transform(({ value }) => BigInt(value))
    guid: bigint;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}
