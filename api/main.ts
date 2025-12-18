// Purpose: application entry point
import "dotenv/config";

import { startApp } from "./app.module";

async function main() {
  await startApp();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
