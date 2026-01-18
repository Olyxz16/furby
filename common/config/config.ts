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
if(!process.env.DB_USER || process.env.DB_USER == "") {
  throw "Missing env : DB_USER";
}
if(!process.env.DB_PASSWORD || process.env.DB_PASSWORD == "") {
  throw "Missing env : DB_PASSWORD";
}
if(!process.env.DB_NAME || process.env.DB_NAME == "") {
  throw "Missing env : DB_NAME";
}
if(!process.env.DB_HOST || process.env.DB_HOST == "") {
  throw "Missing env : DB_HOST";
}
if(!process.env.DB_PORT || process.env.DB_PORT == "") {
  throw "Missing env : DB_PORT";
}


export const config = {
  PORT: parseInt(process.env.PORT || "3000"),
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID!,
  DISCORD_GUILD_ID: process.env.DISCORD_GUILD_ID!,
  GOOGLE_AUTH_EMAIL: process.env.GOOGLE_AUTH_EMAIL,
  GOOGLE_AUTH_KEY: process.env.GOOGLE_AUTH_KEY,
  GOOGLE_SHEETS_DOC_ID: process.env.GOOGLE_SHEETS_DOC_ID,
  DB_USER: process.env.DB_USER!,
  DB_PASSWORD: process.env.DB_PASSWORD!,
  DB_NAME: process.env.DB_NAME!,
  DB_HOST: process.env.DB_HOST!,
  DB_PORT: parseInt(process.env.DB_PORT!),
};
