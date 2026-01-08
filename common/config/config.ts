// Purpose: global runtime configuration

if(!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN == "") {
  throw "Missing env : DISCORD_TOKEN";
}
if(!process.env.DISCORD_APPLICATION_ID || process.env.DISCORD_APPLICATION_ID == "") {
  throw "Missing env : DISCORD_APPLICATION_ID";
}
if(!process.env.DISCORD_GUILD_ID || process.env.DISCORD_GUILD_ID == "") {
  throw "Missing env : DISCORD_GUILD_ID";
}
if(!process.env.GOOGLE_AUTH_EMAIL || process.env.GOOGLE_AUTH_EMAIL == "") {
  throw "Missing env : GOOGLE_AUTH_EMAIL";
}
if(!process.env.GOOGLE_AUTH_KEY || process.env.GOOGLE_AUTH_KEY == "") {
  throw "Missing env : GOOGLE_AUTH_KEY";
}
if(!process.env.GOOGLE_SHEETS_DOC_ID || process.env.GOOGLE_SHEETS_DOC_ID == "") {
  throw "Missing env : GOOGLE_SHEETS_DOC_ID";
}

export const config = {
  PORT: process.env.PORT || 3000,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID!,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID!,
  GOOGLE_AUTH_EMAIL: process.env.GOOGLE_AUTH_EMAIL,
  GOOGLE_AUTH_KEY: process.env.GOOGLE_AUTH_KEY,
  GOOGLE_SHEETS_DOC_ID: process.env.GOOGLE_SHEETS_DOC_ID,
  DB_USER: process.env.DB_USER!,
  DB_HOST: process.env.DB_HOST!,
  DB_NAME: process.env.DB_NAME!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_PORT: process.env.DB_PORT!,
};
