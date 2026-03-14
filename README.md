# 🔐 ConfigVault / 配置保险库

[![npm version](https://badge.fury.io/js/configvault.svg)](https://www.npmjs.com/package/configvault)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/BohanSu/configvault)
[![Test Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)](https://github.com/BohanSu/configvault)

**TypeScript CLI for managing environment configuration files across multiple environments.**
**用于管理多环境配置文件的 TypeScript CLI 工具。**

Features: load/validate, diff, merge, and AES-256-GCM encryption for sensitive values.
功能：加载/验证、对比、合并以及敏感值的 AES-256-GCM 加密。

---

## 📚 Table of Contents / 目录

- [Why ConfigVault? / 为什么选择 ConfigVault?](#why-configvault--为什么选择-configvault)
- [Features / 功能特性](#features--功能特性)
- [Installation / 安装](#installation--安装)
- [Quick Start / 快速开始](#quick-start--快速开始)
- [CLI Commands / 命令行命令](#cli-commands--命令行命令)
- [Encryption / 加密](#encryption--加密)
- [Security Best Practices / 安全最佳实践](#security-best-practices--安全最佳实践)
- [Contributing / 贡献](#contributing--贡献)
- [License / 许可证](#license--许可证)

---

## 🎯 Why ConfigVault? / 为什么选择 ConfigVault?

### English
Managing `.env` files across multiple environments (development, staging, production) is a common pain point:

- **Configuration drift** — inconsistent values across environments
- **Manual errors** — typos and missing keys cause production issues
- **Secret management** — API keys and passwords committed to git
- **Validation** — type errors in environment variables
- **Merging complexity** — overriding base configuration correctly
- **Security** - encrypted values in version control, plain text in production

ConfigVault solves all these problems with a unified tool for loading, validating, comparing, merging, and encrypting environment configuration.

### 中文
管理多个环境（开发、测试、生产）的 `.env` 文件是一个常见痛点：

- **配置漂移** — 环境间的值不一致
- **人工错误** — 拼写错误和缺失键导致生产问题
- **密钥管理** — API 密钥和密码被提交到 git
- **验证** — 环境变量的类型错误
- **合并复杂性** — 正确覆盖基础配置
- **安全性** - 版本控制中的加密值，生产环境中的明文

ConfigVault 使用统一工具解决所有这些问题，用于加载、验证、比较、合并和加密环境配置。

---

## ✨ Features / 功能特性

### English
- 📝 **Load & Validate** — Parse `.env` files and validate against JSON schemas
- 🔍 **Diff** — Compare two env files to see changes between environments
- 🔀 **Merge** — Combine multiple env files with precedence rules
- 🔐 **Encrypt/Decrypt** — AES-256-GCM encryption for sensitive values
- 📤 **Export** — JSON or shell export formats for flexibility
- 🔑 **Key Generation** — Generate secure 32-byte encryption keys
- 📊 **Schema Validation** — Type checking (string, number, boolean) for env values
- 🔄 **Precedence Rules** — Smart merging with overlay semantics

### 中文
- 📝 **加载与验证** — 解析 `.env` 文件并根据 JSON 模式验证
- 🔍 **对比** — 比较两个环境文件以查看环境之间的变化
- 🔀 **合并** — 按优先级规则组合多个环境文件
- 🔐 **加密/解密** — 敏感值的 AES-256-GCM 加密
- 📤 **导出** — JSON 或 Shell 导出格式，灵活多变
- 🔑 **密钥生成** — 生成安全的 32 字节加密密钥
- 📊 **模式验证** — 环境值的类型检查（字符串、数字、布尔值）
- 🔄 **优先级规则** — 具有覆盖语义的智能合并

---

## 📦 Installation / 安装

### English

#### Global Installation (Recommended)

```bash
npm install -g configvault
```

After global installation, run from anywhere:

```bash
configvault --help
```

#### Build from Source

```bash
git clone https://github.com/BohanSu/configvault.git
cd configvault
npm install
npm run build
npm link
```

### 中文

#### 全局安装（推荐）

```bash
npm install -g configvault
```

全局安装后，可以在任何位置运行：

```bash
configvault --help
```

#### 从源码构建

```bash
git clone https://github.com/BohanSu/configvault.git
cd configvault
npm install
npm run build
npm link
```

---

## 🚀 Quick Start / 快速开始

### English

#### Step 1: Generate an Encryption Key

```bash
configvault genkey --output key.txt
```

⚠️ **Important:** Never commit `key.txt` to version control! Add it to `.gitignore`.

#### Step 2: Create Environment Files

**`.env.base` (Base configuration):**
```bash
APP_NAME=MyApp
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
```

**`.env.dev` (Development overrides):**
```bash
NODE_ENV=development
DEBUG=true
PORT=3001
```

#### Step 3: Compare Environments

```bash
configvault diff --envs .env.dev,.env.prod
```

#### Step 4: Merge Configurations

```bash
configvault merge --base .env.base --overlays .env.dev,.env.staging --output .env.merged
```

#### Step 5: Encrypt Sensitive Values

```bash
configvault encrypt --input .env --output .env.enc --key-file key.txt
```

### 中文

#### 第一步：生成加密密钥

```bash
configvault genkey --output key.txt
```

⚠️ **重要：** 永远不要将 `key.txt` 提交到版本控制！将其添加到 `.gitignore`。

#### 第二步：创建环境文件

**`.env.base`（基础配置）：**
```bash
APP_NAME=MyApp
NODE_ENV=production
LOG_LEVEL=info
PORT=3000
```

**`.env.dev`（开发环境覆盖）：**
```bash
NODE_ENV=development
DEBUG=true
PORT=3001
```

#### 第三步：比较环境

```bash
configvault diff --envs .env.dev,.env.prod
```

#### 第四步：合并配置

```bash
configvault merge --base .env.base --overlays .env.dev,.env.staging --output .env.merged
```

#### 第五步：加密敏感值

```bash
configvault encrypt --input .env --output .env.enc --key-file key.txt
```

---

## 📚 CLI Commands / 命令行命令

### `load` / 加载

#### English

Load and parse an env file with optional validation.

```bash
configvault load [options]
```

| Option | Required | Description |
|--------|----------|-------------|
| `-i, --input <path>` | ✅ Yes | Path to env file |
| `-s, --schema <path>` | No | Path to schema JSON file |
| `-o, --output <path>` | No | Write output to file |
| `--format <format>` | No | `json` or `shell` (default: json) |

#### 中文

加载和解析环境文件，可选验证。

```bash
configvault load [选项]
```

| 选项 | 必需 | 描述 |
|------|------|------|
| `-i, --input <路径>` | ✅ 是 | 环境文件路径 |
| `-s, --schema <路径>` | 否 | 模式 JSON 文件路径 |
| `-o, --output <路径>` | 否 | 将输出写入文件 |
| `--format <格式>` | 否 | `json` 或 `shell`（默认：json） |

---

### `diff` / 对比

#### English

Compare two env files to show differences.

```bash
configvault diff [options]
```

| Option | Required | Description |
|--------|----------|-------------|
| `--envs <paths>` | ✅ Yes | Two env file paths separated by comma |
| `-o, --output <path>` | No | Write output to file |

#### 中文

比较两个环境文件以显示差异。

```bash
configvault diff [选项]
```

| 选项 | 必需 | 描述 |
|------|------|------|
| `--envs <路径>` | ✅ 是 | 两个环境文件路径，用逗号分隔 |
| `-o, --output <路径>` | 否 | 将输出写入文件 |

---

### `merge` / 合并

#### English

Merge multiple env files with precedence rules (last overlay wins).

```bash
configvault merge [options]
```

| Option | Required | Description |
|--------|----------|-------------|
| `-b, --base <path>` | ✅ Yes | Base env file |
| `--overlays <paths>` | ✅ Yes | Overlay env files (comma-separated) |

#### 中文

按优先级规则合并多个环境文件（最后一个覆盖胜出）。

```bash
configvault merge [选项]
```

| 选项 | 必需 | 描述 |
|------|------|------|
| `-b, --base <路径>` | ✅ 是 | 基础环境文件 |
| `--overlays <路径>` | ✅ 是 | 覆盖环境文件（逗号分隔） |

---

### `encrypt` / 加密

#### English

Encrypt env values using AES-256-GCM.

```bash
configvault encrypt [options]
```

| Option | Required | Description |
|--------|----------|-------------|
| `-i, --input <path>` | ✅ Yes | Input env file |
| `-o, --output <path>` | ✅ Yes | Output env file |
| `-k, --key-file <path>` | ✅ Yes | File containing 32-byte hex key |

#### 中文

使用 AES-256-GCM 加密环境值。

```bash
configvault encrypt [选项]
```

| 选项 | 必需 | 描述 |
|------|------|------|
| `-i, --input <路径>` | ✅ 是 | 输入环境文件 |
| `-o, --output <路径>` | ✅ 是 | 输出环境文件 |
| `-k, --key-file <路径>` | ✅ 是 | 包含 32 字节十六进制密钥的文件 |

---

### `decrypt` / 解密

#### English

Decrypt `ENC()` values back to plain text.

```bash
configvault decrypt [options]
```

| Option | Required | Description |
|--------|----------|-------------|
| `-i, --input <path>` | ✅ Yes | Input env file |
| `-o, --output <path>` | ✅ Yes | Output env file |
| `-k, --key-file <path>` | ✅ Yes | File containing 32-byte hex key |

#### 中文

将 `ENC()` 值解密回明文。

```bash
configvault decrypt [选项]
```

| 选项 | 必需 | 描述 |
|------|------|------|
| `-i, --input <路径>` | ✅ 是 | 输入环境文件 |
| `-o, --output <路径>` | ✅ 是 | 输出环境文件 |
| `-k, --key-file <路径>` | ✅ 是 | 包含 32 字节十六进制密钥的文件 |

---

## 🔐 Encryption / 加密

### English

#### Key File Format

Key files have this format:

```
ENCKEY:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

- **Length:** 64 characters (32 bytes, hex-encoded)
- **Format:** Random bytes converted to hexadecimal
- **Prefix:** `ENCKEY:` is optional but recommended

#### Encryption Algorithm

- **Algorithm:** AES-256-GCM
- **Key Size:** 256 bits
- **IV Size:** 96 bits (12 bytes) — unique per value
- **Auth Tag:** 128 bits — provides integrity verification

### 中文

#### 密钥文件格式

密钥文件具有以下格式：

```
ENCKEY:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

- **长度：** 64 个字符（32 字节，十六进制编码）
- **格式：** 转换为十六进制的随机字节
- **前缀：** `ENCKEY:` 是可选的，但建议使用

#### 加密算法

- **算法：** AES-256-GCM
- **密钥大小：** 256 位
- **IV 大小：** 96 位（12 字节）— 每个值唯一
- **认证标签：** 128 位 — 提供完整性验证

---

## 🔒 Security Best Practices / 安全最佳实践

### English

⚠️ **Critical Rules:**

1. **Never commit encryption keys to git**
   ```bash
   echo "key.txt" >> .gitignore
   echo "*.key" >> .gitignore
   ```

2. **Store keys securely:**
   - AWS Secrets Manager
   - HashiCorp Vault
   - CI/CD secrets
   - Environment variables

3. **Rotate keys periodically**

4. **Always validate env values before use**

### 中文

⚠️ **关键规则：**

1. **永远不要将加密密钥提交到 git**
   ```bash
   echo "key.txt" >> .gitignore
   echo "*.key" >> .gitignore
   ```

2. **安全存储密钥：**
   - AWS Secrets Manager
   - HashiCorp Vault
   - CI/CD 密钥
   - 环境变量

3. **定期轮换密钥**

4. **使用前始终验证环境值**

---

## 🛠️ Development / 开发

### English

#### Setup

```bash
npm install
npm run build
npm test
npm run lint
```

### 中文

#### 设置

```bash
npm install
npm run build
npm test
npm run lint
```

---

## 🤝 Contributing / 贡献

### English

Contributions are welcome! Please follow:

1. Fork the repository
2. Create a feature branch
3. Write tests for new features
4. Ensure all tests pass
5. Submit a Pull Request

### 中文

欢迎贡献！请遵循：

1. Fork 该仓库
2. 创建功能分支
3. 为新功能编写测试
4. 确保所有测试通过
5. 提交 Pull Request

---

## 📄 License / 许可证

MIT License - see [LICENSE](LICENSE) file.

MIT 许可证 - 参见 [LICENSE](LICENSE) 文件。

---

## 📞 Support / 支持

### English
- 📖 [Documentation](https://github.com/BohanSu/configvault)
- 🐛 [Issue Tracker](https://github.com/BohanSu/configvault/issues)

### 中文
- 📖 [文档](https://github.com/BohanSu/configvault)
- 🐛 [问题追踪](https://github.com/BohanSu/configvault/issues)

---

**Secure your secrets! 🔐**
**保护您的秘密！🔐**
