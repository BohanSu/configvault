#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, writeFileSync, existsSync } from 'fs';

const { parseEnvContent } = await import('./envLoader.js');
const { validateEnv } = await import('./schemaValidator.js');
const { diffEnvs } = await import('./configDiffer.js');
const { mergeEnvs } = await import('./configMerger.js');
const { encryptAES256GCM, decryptAES256GCM, generateKey } = await import('./cryptoAES256.js');
const { formatAsJSON, formatAsShellExport, formatDiffAsJSON } = await import('./outputFormatter.js');

const program = new Command();

program
  .name('configvault')
  .description('Manage environment configuration files across multiple environments')
  .version('0.1.0');

program
  .command('load')
  .description('Load and parse an env file')
  .option('-i, --input <path>', 'Path to env file')
  .option('-s, --schema <path>', 'Path to schema JSON file for validation')
  .option('-o, --output <path>', 'Write output to file')
  .option('--format <format>', 'Output format: json or shell', 'json')
  .action((options) => {
    try {
      if (!options.input) {
        console.error(chalk.red('Error: --input is required'));
        process.exit(1);
      }

      if (!existsSync(options.input)) {
        console.error(chalk.red(`Error: File not found: ${options.input}`));
        process.exit(1);
      }

      const content = readFileSync(options.input, 'utf-8');
      const env = parseEnvContent(content);

      if (options.schema && existsSync(options.schema)) {
        const schema = JSON.parse(readFileSync(options.schema, 'utf-8'));
        const result = validateEnv(env, schema);

        if (!result.ok) {
          console.error(chalk.red('Validation errors:'));
          for (const err of result.errors) {
            console.error(chalk.red(`  - ${err}`));
          }
          process.exit(1);
        }
      }

      const output =
        options.format === 'shell' ? formatAsShellExport(env) : formatAsJSON(env);

      if (options.output) {
        writeFileSync(options.output, output, 'utf-8');
        console.log(chalk.green(`Output written to ${options.output}`));
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('diff')
  .description('Compare two env files')
  .option('--envs <paths>', 'Two env file paths separated by comma')
  .option('-o, --output <path>', 'Write output to file')
  .action((options) => {
    try {
      if (!options.envs) {
        console.error(chalk.red('Error: --envs is required'));
        process.exit(1);
      }

      const [path1, path2] = options.envs.split(',');
      if (!path1 || !path2) {
        console.error(chalk.red('Error: --envs must contain two paths'));
        process.exit(1);
      }

      const content1 = readFileSync(path1.trim(), 'utf-8');
      const content2 = readFileSync(path2.trim(), 'utf-8');

      const env1 = parseEnvContent(content1);
      const env2 = parseEnvContent(content2);

      const diff = diffEnvs(env1, env2);
      const output = formatDiffAsJSON(diff);

      if (options.output) {
        writeFileSync(options.output, output, 'utf-8');
        console.log(chalk.green(`Output written to ${options.output}`));
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('merge')
  .description('Merge multiple env files')
  .option('-b, --base <path>', 'Base env file')
  .option('--overlays <paths>', 'Overlay env file paths separated by comma')
  .option('-o, --output <path>', 'Write output to file')
  .option('--format <format>', 'Output format: json or shell', 'json')
  .action((options) => {
    try {
      if (!options.base || !options.overlays) {
        console.error(chalk.red('Error: --base and --overlays are required'));
        process.exit(1);
      }

      const baseContent = readFileSync(options.base, 'utf-8');
      const baseEnv = parseEnvContent(baseContent);

      const overlayPaths = options.overlays.split(',').map((p: string) => p.trim());
      const overlays = overlayPaths.map((overlayPath: string) => {
        const content = readFileSync(overlayPath, 'utf-8');
        return parseEnvContent(content);
      });

      const merged = mergeEnvs(baseEnv, overlays);
      const output =
        options.format === 'shell' ? formatAsShellExport(merged) : formatAsJSON(merged);

      if (options.output) {
        writeFileSync(options.output, output, 'utf-8');
        console.log(chalk.green(`Output written to ${options.output}`));
      } else {
        console.log(output);
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('encrypt')
  .description('Encrypt env values using AES-256-GCM')
  .option('-i, --input <path>', 'Input env file')
  .option('-o, --output <path>', 'Output env file')
  .option('-k, --key-file <path>', 'File containing 32-byte hex key')
  .action((options) => {
    try {
      if (!options.input || !options.output || !options.keyFile) {
        console.error(chalk.red('Error: --input, --output, and --key-file are required'));
        process.exit(1);
      }

      const content = readFileSync(options.input, 'utf-8');
      const env = parseEnvContent(content);

      let key: Buffer;
      const keyContent = readFileSync(options.keyFile, 'utf-8').trim();

      if (keyContent.startsWith('ENCKEY:')) {
        key = Buffer.from(keyContent.slice(7), 'hex');
      } else {
        key = Buffer.from(keyContent, 'hex');
      }

      if (key.length !== 32) {
        throw new Error('Key must be 32 bytes (64 hex characters)');
      }

      const encryptedEnv: Record<string, string> = {};
      for (const [k, v] of Object.entries(env)) {
        encryptedEnv[k] = encryptAES256GCM(key, v);
      }

      const output = formatAsJSON(encryptedEnv);
      writeFileSync(options.output, output, 'utf-8');
      console.log(chalk.green(`Encrypted output written to ${options.output}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('decrypt')
  .description('Decrypt ENC() values')
  .option('-i, --input <path>', 'Input env file with encrypted values')
  .option('-o, --output <path>', 'Output env file')
  .option('-k, --key-file <path>', 'File containing 32-byte hex key')
  .action((options) => {
    try {
      if (!options.input || !options.output || !options.keyFile) {
        console.error(chalk.red('Error: --input, --output, and --key-file are required'));
        process.exit(1);
      }

      const content = readFileSync(options.input, 'utf-8');
      const env = parseEnvContent(content);

      let key: Buffer;
      const keyContent = readFileSync(options.keyFile, 'utf-8').trim();

      if (keyContent.startsWith('ENCKEY:')) {
        key = Buffer.from(keyContent.slice(7), 'hex');
      } else {
        key = Buffer.from(keyContent, 'hex');
      }

      if (key.length !== 32) {
        throw new Error('Key must be 32 bytes (64 hex characters)');
      }

      const decryptedEnv: Record<string, string> = {};
      for (const [k, v] of Object.entries(env)) {
        if (v.startsWith('ENC(')) {
          decryptedEnv[k] = decryptAES256GCM(key, v);
        } else {
          decryptedEnv[k] = v;
        }
      }

      const output = formatAsJSON(decryptedEnv);
      writeFileSync(options.output, output, 'utf-8');
      console.log(chalk.green(`Decrypted output written to ${options.output}`));
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program
  .command('genkey')
  .description('Generate a new AES-256 key')
  .option('-o, --output <path>', 'Write key to file')
  .action((options) => {
    try {
      const key = generateKey();
      const hexKey = `ENCKEY:${key.toString('hex')}`;

      if (options.output) {
        writeFileSync(options.output, hexKey, 'utf-8');
        console.log(chalk.green(`Key written to ${options.output}`));
      } else {
        console.log(chalk.yellow(hexKey));
        console.log(chalk.dim('Save this key securely to use for encryption/decryption'));
      }
    } catch (error) {
      console.error(chalk.red(`Error: ${error instanceof Error ? error.message : String(error)}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
