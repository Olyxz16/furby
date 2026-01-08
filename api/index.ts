import "dotenv/config";
import { app } from './server';
import { config } from '@/config/config';

async function main() {
  app.listen(config.PORT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
