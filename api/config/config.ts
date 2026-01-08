// Purpose: global runtime configuration

if(!process.env.DISCORD_TOKEN || process.env.DISCORD_TOKEN == "") {
  throw "Missing env : DISCORD_TOKEN";
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
  GOOGLE_AUTH_EMAIL: process.env.GOOGLE_AUTH_EMAIL,
  GOOGLE_AUTH_KEY: process.env.GOOGLE_AUTH_KEY,
  GOOGLE_SHEETS_DOC_ID: process.env.GOOGLE_SHEETS_DOC_ID,
};
