# 🔐 ConfigVault

TypeScript CLI for managing environment configuration files across multiple environments. Features: load/validate, diff, merge, and AES-256-GCM encryption for sensitive values.

## Features

- **📝 Load & Validate**: Parse .env files and validate against JSON schemas
- **🔍 Diff**: Compare two env files to see changes
- **🔀 Merge**: Combine multiple env files with precedence rules
- **🔐 Encrypt/Decrypt**: AES-256-GCM encryption for sensitive values
- **📤 Export**: JSON or shell export formats
- **🔑 Key Generation**: Generate secure 32-byte encryption keys

## Installation

```bash
npm install -g configvault
```

Or build locally:

```bash
git clone <repo-url>
cd configvault
npm install
npm run build
```

## Quick Start

### Generate an encryption key

```bash
configvault genkey --output key.txt
```

### Load and validate an env file

```bash
configvault load --input .env --schema schema.json
```

### Compare environments

```bash
configvault diff --envs .env.dev,.env.prod
```

### Merge environments

```bash
configvault merge --base .env.base --overlays .env.dev,.env.staging --output .env.merged
```

### Encrypt sensitive values

```bash
configvault encrypt --input .env --output .env.enc --key-file key.txt
```

### Decrypt values

```bash
configvault decrypt --input .env.enc --output .env.dec --key-file key.txt
```

## CLI Commands

### `load`
Load and parse an env file with optional validation.

```bash
configvault load [options]
```

**Options:**
- `-i, --input <path>`: Path to env file (required)
- `-s, --schema <path>`: Path to schema JSON file
- `-o, --output <path>`: Write output to file
- `--format <format>`: json or shell (default: json)

### `diff`
Compare two env files.

```bash
configvault diff [options]
```

**Options:**
- `--envs <paths>`: Two env file paths separated by comma (required)
- `-o, --output <path>`: Write output to file

### `merge`
Merge multiple env files.

```bash
configvault merge [options]
```

**Options:**
- `-b, --base <path>`: Base env file (required)
- `--overlays <paths>`: Overlay env file paths separated by comma (required)
- `-o, --output <path>`: Write output to file
- `--format <format>`: json or shell (default: json)

### `encrypt`
Encrypt env values using AES-256-GCM.

```bash
configvault encrypt [options]
```

**Options:**
- `-i, --input <path>`: Input env file (required)
- `-o, --output <path>`: Output env file (required)
- `-k, --key-file <path>`: File containing 32-byte hex key (required)

### `decrypt`
Decrypt ENC() values.

```bash
configvault decrypt [options]
```

**Options:**
- `-i, --input <path>`: Input env file (required)
- `-o, --output <path>`: Output env file (required)
- `-k, --key-file <path>`: File containing 32-byte hex key (required)

### `genkey`
Generate a new AES-256 key.

```bash
configvault genkey [options]
```

**Options:**
- `-o, --output <path>`: Write key to file

## Schema Validation

Create a JSON schema file to validate env values:

```json
{
  "API_KEY": "string",
  "PORT": "number",
  "DEBUG": "boolean"
}
```

Supported types:
- `string`: Any value
- `number`: Must parse as a number
- `boolean`: true/false, 1/0, yes/no

## Key File Format

Key files have this format:

```
ENCKEY:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

The key is a 64-character hex string representing 32 bytes. The `ENCKEY:` prefix is optional but recommended for clarity.

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run format
make demo
```

## Project Structure

```
configvault/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── envLoader.ts        # Parse .env files
│   ├── schemaValidator.ts  # Validate env values
│   ├── configDiffer.ts     # Compare env files
│   ├── configMerger.ts     # Merge env files
│   ├── cryptoAES256.ts     # AES-256-GCM encryption
│   ├── outputFormatter.ts  # JSON/shell export
│   └── types.ts            # Shared types
├── tests/unit/             # Unit tests
├── samples/                # Sample env files
└── .github/workflows/      # CI configuration
```

## License

MIT License - see [LICENSE](LICENSE) file.

## Security Notes

- Store encryption keys securely (e.g., in a vault, not in version control)
- Do not log plaintext values
- Keys use AES-256-GCM with 12-byte IV per encryption
- Each value uses a unique IV and auth tag

---

Built with TypeScript, powered by Node.js crypto module.
