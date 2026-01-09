import { User } from "../../user/user.entity";
import { Session } from "../session.entity";

export interface SignInDto {
  mail: string;
  password: string;
}

export interface SignInResponseDto {
  user: User,
  session: Session
}

export interface LoginDto {
  mail: string;
  password: string;
}

export interface LogoutDto {
  token: string;
}

export interface DiscordLinkInputDto {
  magicLinkCode: string;
  discordUserId: string;
}
