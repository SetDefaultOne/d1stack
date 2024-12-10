import { plainToClass } from "class-transformer";
import { IsString, Length } from "class-validator";

import { UserEntity } from "../entities/user";
import { Collection } from "../collection";

export class UsersCollection extends Collection {
    async getUsers(dto: UsersGetUsersDto) {
        return await this.queryClient.query<UsersGetUsersSuccessData>("/", {
            method: "GET",
            query: plainToClass(UsersGetUsersDto, dto),
        });
    }
}

export class UsersGetUsersDto {
    @IsString()
    @Length(5, 36)
    username: string;
}

export interface UsersGetUsersSuccessData {
    users: UserEntity[];
}
