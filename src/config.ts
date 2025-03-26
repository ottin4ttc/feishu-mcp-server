import { maskApiKey } from '@/common.js';
import type { ServerConfig } from '@/typings/index.js';
/**
 * Configuration Management Module
 *
 * Handles server configuration loading from multiple sources:
 * 1. Environment variables (.env file)
 * 2. Command-line arguments
 * 3. Default values
 *
 * Validates required configuration and provides configuration source tracking.
 */
import { config } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

// Load environment variables from .env file
config();

// Default port for the server
const DEFAULT_PORT = 3344;

/**
 * Configuration source types
 */
type ConfigSource = 'env' | 'cli' | 'default';

/**
 * Command line arguments interface
 */
interface CommandLineArgs {
  'feishu-app-id'?: string;
  'feishu-app-secret'?: string;
  port?: number;
  [key: string]: unknown;
}

/**
 * Retrieve and build server configuration
 *
 * Constructs server configuration by consolidating values from
 * environment variables, command-line arguments, and default values.
 * Performs validation of required parameters and logs configuration sources.
 *
 * @param isStdioMode - Whether the server is running in stdio mode
 * @returns Complete server configuration object
 */
export function getServerConfig(isStdioMode: boolean): ServerConfig {
  // Parse command line arguments with yargs
  const argv = parseCommandLineArgs();

  // Build configuration with priority: CLI args > env vars > defaults
  const config = buildConfiguration(argv);

  // Validate essential configuration
  validateConfiguration(config);

  // Log configuration in non-stdio mode
  if (!isStdioMode) {
    logConfiguration(config);
  }

  return config;
}

/**
 * Parse command line arguments
 * @returns Parsed arguments
 */
function parseCommandLineArgs(): CommandLineArgs {
  return yargs(hideBin(process.argv))
    .options({
      'feishu-app-id': { type: 'string', description: 'FeiShu App ID' },
      'feishu-app-secret': { type: 'string', description: 'FeiShu App Secret' },
      port: { type: 'number', description: 'Port to run the server on' },
    })
    .help()
    .parseSync();
}

/**
 * Build configuration object from various sources
 * @param argv - Parsed command line arguments
 * @returns Server configuration
 */
function buildConfiguration(argv: CommandLineArgs): ServerConfig {
  // Initialize with env vars or defaults
  const envAppId = process.env.FEISHU_APP_ID ?? '';
  const envAppSecret = process.env.FEISHU_APP_SECRET ?? '';
  const envPort = process.env.PORT;

  const config: ServerConfig = {
    feishuAppId: envAppId,
    feishuAppSecret: envAppSecret,
    port: envPort ? Number.parseInt(envPort, 10) : DEFAULT_PORT,
    configSources: {
      feishuAppId: envAppId ? 'env' : 'default',
      feishuAppSecret: envAppSecret ? 'env' : 'default',
      port: envPort ? 'env' : 'default',
    },
  };

  // Override with CLI args if provided
  if (argv['feishu-app-id']) {
    config.feishuAppId = argv['feishu-app-id'];
    config.configSources.feishuAppId = 'cli';
  }

  if (argv['feishu-app-secret']) {
    config.feishuAppSecret = argv['feishu-app-secret'];
    config.configSources.feishuAppSecret = 'cli';
  }

  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = 'cli';
  }

  return config;
}

/**
 * Validate that all required configuration is present
 * @param config - Server configuration to validate
 * @throws Error if required configuration is missing
 */
function validateConfiguration(config: ServerConfig): void {
  const { feishuAppId, feishuAppSecret } = config;

  if (!feishuAppId || !feishuAppSecret) {
    console.error(
      'FEISHU_APP_ID and FEISHU_APP_SECRET are required (via CLI argument --feishu-app-id and --feishu-app-secret or .env file)',
    );
    process.exit(1);
  }
}

/**
 * Log the configuration sources for debugging
 * @param config - Server configuration
 */
function logConfiguration(config: ServerConfig): void {
  const { feishuAppId, feishuAppSecret, port, configSources } = config;

  console.log('\nConfiguration:');
  console.log(
    `- FEISHU_APP_ID: ${maskApiKey(feishuAppId)} (source: ${configSources.feishuAppId})`,
  );
  console.log(
    `- FEISHU_APP_SECRET: ${maskApiKey(feishuAppSecret)} (source: ${configSources.feishuAppSecret})`,
  );
  console.log(`- PORT: ${port} (source: ${configSources.port})`);
  console.log();
}
