import { UserRole } from "../../auth/role.entity";
import { User } from "../user.entity";

export interface UserCreateDto {
  mail: string;
  password: string;
  role: UserRole;
  discordUserId: string | null;
}

export interface GetUserByIdDto {
  id: number;
}

export interface GetUserByMailDto {
  mail: string;
}

export interface SetDiscordIdDto {
  userId: number;
  discordUserId: string;
}

export interface RemoveDiscordIdDto {
  userId: number;
}

export interface UserResponseDto {
  id: number;
  mail: string;
  isDiscordLinked: boolean;
}

export function toUserDto(user: User): UserResponseDto {
  return {
    id: user.id,
    mail: user.mail,
    isDiscordLinked: user.discordUserId !== null
  }
}
