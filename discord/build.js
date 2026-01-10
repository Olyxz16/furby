import esbuild from 'esbuild';
import path from 'path';

const ENTRY_FILE = './index.ts';
const OUTPUT_DIR = './dist';

const commonConfig = {
  bundle: true,
  platform: 'node',
  target: 'node22',
  sourcemap: false,
  minify: true,
  logLevel: 'info',
  packages: 'external',
};

async function build() {
  try {
    console.log('🚀 Starting build process...');

    await esbuild.build({
      ...commonConfig,
      entryPoints: [ENTRY_FILE],
      outfile: path.join(OUTPUT_DIR, 'bot.js'),
    });
    console.log('✅ Bot bundled successfully -> dist/bot.js');

  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
