import { User } from "@prisma/client";

export class UserEntity implements User {
    guid: bigint;

    constructor(partial: Partial<User | UserEntity>) {
        Object.assign(this, partial);
    }
}
