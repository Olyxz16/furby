import { User } from "../user/user.entity";
import { DiscordLinkInputDto, LoginDto, LogoutDto, SignInDto, SignInResponseDto } from "./dto/auth.dto";
import { CreateMagicLinkDto } from "./dto/magic-link.dto";
import { MagicLink } from "./magic-link.entity";
import { Session } from "./session.entity";
import { createSession, deleteSessionByToken, getSessionByToken } from "./session.repository";
import { create, getById, getByMail, save } from "../user/user.repository";
import { UserRole } from "./role.entity";
import bcrypt from "bcrypt";
import { createMagicLink, getMagicLinkByLink } from "./magic-link.repository";

const SALT_ROUNDS = 10;

export function getUserFromSessionToken(token: string): User {
  const session = getSessionByToken({token: token});
  if(!session) {
    throw new Error("Could not find session");
  }
  const user = getById({id: session.userId});
  if(!user) {
    deleteSessionByToken({token: token});
    throw new Error("Could not find user");
  }
  return user;
}

export function SignIn(input: SignInDto): SignInResponseDto {
  const hashedPassword = hash(input.password);
  const user = create({
    mail: input.mail,
    password: hashedPassword,
    role: UserRole.USER,
    discordUserId: null
  });

  const token = crypto.randomUUID();
  const session = createSession({userId: user.id, token});
  
  return {
    user: user,
    session: session
  };
}

export function Login(input: LoginDto): Session {
  const user = getByMail({mail: input.mail});
  if(!user) {
    throw new Error("Could not find user");
  }
  
  const matches = bcrypt.compareSync(user.password, input.password);
  if(!matches) {
    throw new Error("Passwords don't match");
  }
  
  const token = crypto.randomUUID();
  const session = createSession({userId: user.id, token: token});
  return session;
}

export function Logout(input: LogoutDto): void {
  deleteSessionByToken({token: input.token});
}

export function CreateMagicLink(input: CreateMagicLinkDto): MagicLink {
  const link = crypto.randomUUID();
  const magicLink = createMagicLink({userId: input.userId, link: link});
  return magicLink;
}

export function ConsumeMagicLink(input: DiscordLinkInputDto): void {
  const magicLink = getMagicLinkByLink({link: input.magicLinkCode});
  if(!magicLink) {
    throw new Error("Could not find magic link");
  }
  const user = getById({id: magicLink.userId});
  if(!user) {
    throw new Error("Could not find user");
  }
  user.discordUserId = input.discordUserId;
  save(user);
}

function hash(input: string): string {
  let result = "";
  bcrypt.hash(input, SALT_ROUNDS, function(err, hash) {
    if(!!err) {
      throw err;
    }
    result = hash;
  });
  if(result == "") {
    throw new Error("Error during password hashing");
  }
  return result;
}
