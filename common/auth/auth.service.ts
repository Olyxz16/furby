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

export async function getUserFromSessionToken(token: string): Promise<User> {
  const session = await getSessionByToken({token: token});
  if(!session) {
    throw new Error("Could not find session");
  }
  const user = await getById({id: session.userId});
  if(!user) {
    await deleteSessionByToken({token: token});
    throw new Error("Could not find user");
  }
  return user;
}

export async function SignIn(input: SignInDto): Promise<SignInResponseDto> {
  const hashedPassword = hash(input.password);
  const user = await create({
    mail: input.mail,
    password: hashedPassword,
    role: UserRole.USER,
    discordUserId: null
  });

  const token = crypto.randomUUID();
  const session = await createSession({userId: user.id, token});
  
  return {
    user: user,
    session: session
  };
}

export async function Login(input: LoginDto): Promise<Session> {
  const user = await getByMail({mail: input.mail});
  if(!user) {
    throw new Error("Could not find user");
  }
  
  const matches = bcrypt.compareSync(input.password, user.password);
  if(!matches) {
    throw new Error("Passwords don't match");
  }
  
  const token = crypto.randomUUID();
  const session = await createSession({userId: user.id, token: token});
  return session;
}

export async function Logout(input: LogoutDto): Promise<void> {
  await deleteSessionByToken({token: input.token});
}

export async function CreateMagicLink(input: CreateMagicLinkDto): Promise<MagicLink> {
  const link = input.link;
  const magicLink = await createMagicLink({userId: input.userId, link: link});
  return magicLink;
}

export async function ConsumeMagicLink(input: DiscordLinkInputDto): Promise<void> {
  const magicLink = await getMagicLinkByLink({link: input.magicLinkCode});
  if(!magicLink) {
    throw new Error("Could not find magic link");
  }
  const user = await getById({id: magicLink.userId});
  if(!user) {
    throw new Error("Could not find user");
  }
  user.discordUserId = input.discordUserId;
  await save(user);
}

function hash(input: string): string {
  return bcrypt.hashSync(input, SALT_ROUNDS);
}