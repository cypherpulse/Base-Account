# Base Account Demo

<div align="center">

![Base Account Demo](https://img.shields.io/badge/Base-Account-blue?style=for-the-badge&logo=ethereum)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?style=for-the-badge&logo=vite)
![Viem](https://img.shields.io/badge/Viem-2.41.2-000000?style=for-the-badge&logo=ethereum)

**A comprehensive demo application showcasing Base Account integration with React**

[Live Demo](https://your-demo-url.com) • [Documentation](https://docs.base.org) • [Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🎯 Usage](#-usage)
- [🛠️ Development](#️-development)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📚 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [🙋 Support](#-support)

---

## ✨ Features

### 🔐 Account Management
- **Sign In with Base**: Seamless authentication using Base Account
- **Account Creation**: Create new Base Accounts with sub-account support
- **Network Switching**: Toggle between Base Sepolia Testnet and Base Mainnet
- **Secure Wallet Integration**: EIP-1193 compliant provider integration

### 💰 Payment Processing
- **USDC Payments**: Send USDC payments on Base network
- **Real-time Status**: Live payment status tracking
- **Gasless Transactions**: Paymaster integration for sponsored transactions
- **Multi-network Support**: Testnet and Mainnet payment processing

### 🎨 User Experience
- **Modern UI**: Built with shadcn/ui and Tailwind CSS
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Dark Theme**: Consistent dark theme matching Base branding
- **Loading States**: Comprehensive loading and error handling
- **Toast Notifications**: User-friendly feedback system

### 🛠️ Developer Experience
- **TypeScript**: Full type safety throughout the application
- **Hot Reload**: Fast development with Vite
- **ESLint**: Code quality and consistency
- **Viem Integration**: Ethereum account management and cryptographic operations
- **Modular Architecture**: Clean, maintainable code structure

---

## 🚀 Quick Start

Get up and running in less than 5 minutes!

```bash
# Clone the repository
git clone https://github.com/your-username/base-account-demo.git
cd base-account-demo

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit `http://localhost:5173` and start exploring Base Account features!

---

## 📦 Installation

### Prerequisites

- **Node.js**: Version 18.0.0 or higher
- **Package Manager**: pnpm (recommended), npm, or yarn
- **Git**: For cloning the repository

### Step-by-Step Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/base-account-demo.git
   cd base-account-demo
   ```

2. **Install Dependencies**
   ```bash
   # Using pnpm (recommended)
   pnpm install

   # Or using npm
   npm install

   # Or using yarn
   yarn install
   ```

3. **Environment Setup** (Optional)
   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Edit environment variables
   nano .env.local
   ```

4. **Start Development Server**
   ```bash
   # Using pnpm
   pnpm dev

   # Or using npm
   npm run dev

   # Or using yarn
   yarn dev
   ```

The application will be available at `http://localhost:5173`.

---

## ⚙️ Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Base Account Configuration
VITE_APP_NAME=Base Account Demo
VITE_APP_LOGO_URL=https://base.org/logo.png

# Network Configuration
VITE_DEFAULT_NETWORK=testnet  # 'testnet' or 'mainnet'

# Payment Configuration
VITE_RECIPIENT_ADDRESS=0xc5983e0b551a7c60d62177cccadf199b9eeac54b

# Optional: Custom Paymaster URLs
VITE_PAYMASTER_BASE_SEPOLIA=https://paymaster.base-sepolia.org/api/v1/sponsor
VITE_PAYMASTER_BASE=https://paymaster.base.org/api/v1/sponsor
```

### SDK Configuration

The Base Account SDK is configured in `src/pages/Index.tsx`:

```typescript
const sdk = createBaseAccountSDK({
  appName: 'Base Account Demo',
  appLogoUrl: 'https://base.org/logo.png',
  appChainIds: [isTestnet ? 84532 : 8453], // Dynamic network selection
  subAccounts: {
    creation: 'manual',
    defaultAccount: 'sub',
    funding: 'spend-permissions',
    toOwnerAccount: async () => ({ account: ownerAccount }),
  },
});
```

### Viem Integration

Viem (`^2.41.2`) is used for Ethereum account management and cryptographic operations:

```typescript
import { privateKeyToAccount } from 'viem/accounts';

// Create demo owner account for sub-account signing
const ownerAccount = privateKeyToAccount(process.env.DEMO_PRIVATE_KEY || 'your-private-key-here');

// Account properties available:
console.log(ownerAccount.address);    // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
console.log(ownerAccount.publicKey);  // Public key for signing operations
```

Viem provides:
- **Account Management**: Local account creation and management
- **Cryptographic Operations**: Secure signing and verification
- **Type Safety**: Full TypeScript support for Ethereum operations
- **Performance**: Optimized for modern Ethereum interactions

---

## 🎯 Usage

### Basic Usage

1. **Select Network**: Choose between Testnet and Mainnet
2. **Connect Account**: Click "Sign In with Base" or "Create a Base Account"
3. **Make Payment**: Enter amount and send USDC
4. **Track Status**: Monitor payment progress in real-time

### Advanced Features

#### Account Creation
```typescript
// Manual sub-account creation
await sdk.subAccount.create({
  type: 'create',
  keys: [{
    type: 'p256',
    publicKey: ownerAccount.publicKey,
  }],
});
```

#### Payment Processing
```typescript
// Send USDC payment
const { id } = await pay({
  amount: '1.0',
  to: RECIPIENT_ADDRESS,
  testnet: true,
});

// Check payment status
const { status } = await getPaymentStatus({
  id,
  testnet: true,
});
```

#### Network Switching
```typescript
// Toggle between networks
const [isTestnet, setIsTestnet] = useState(true);

// SDK automatically updates chain IDs
const chainId = isTestnet ? '0x14a34' : '0x2105';
```

---

## 🛠️ Development

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BaseLogo.tsx    # Base logo component
│   ├── AmountSelector.tsx
│   ├── PaymentStatus.tsx
│   └── AddressDisplay.tsx
├── pages/              # Page components
│   └── Index.tsx       # Main application page
├── lib/                # Utility functions
│   └── utils.ts
├── hooks/              # Custom React hooks
└── types/              # TypeScript type definitions
```

### Development Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run linter
pnpm lint

# Type checking
pnpm type-check
```

### Code Quality

This project uses:
- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Prettier**: Code formatting (via ESLint)

### Adding New Features

1. **Create Component**: Add new components in `src/components/`
2. **Update Types**: Define types in component files or `src/types/`
3. **Add Styling**: Use Tailwind CSS classes or custom CSS
4. **Test Integration**: Test with both testnet and mainnet

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

### Test Structure

```
src/
├── __tests__/          # Unit tests
├── __mocks__/          # Mock data and functions
└── test-utils/         # Testing utilities
```

### Testing Strategy

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: SDK integration and API calls
- **E2E Tests**: Full user flow testing with Playwright

---

## 🚀 Deployment

### Build for Production

```bash
# Build the application
pnpm build

# The built files will be in the `dist` directory
```

### Deployment Options

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production deployment
vercel --prod
```

#### Netlify
```bash
# Build command: pnpm build
# Publish directory: dist
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 80
CMD ["npm", "run", "preview"]
```

### Environment Variables for Production

Ensure these environment variables are set in your deployment platform:

- `NODE_ENV=production`
- Custom configuration variables as needed

---

## 📚 API Reference

### Base Account SDK

#### `createBaseAccountSDK(options)`

Creates a Base Account SDK instance.

**Parameters:**
- `options.appName` (string): Application name
- `options.appLogoUrl` (string): Application logo URL
- `options.appChainIds` (number[]): Supported chain IDs
- `options.subAccounts` (object): Sub-account configuration

**Returns:** BaseAccountSDK instance

#### `pay(options)`

Initiates a USDC payment.

**Parameters:**
- `options.amount` (string): Payment amount
- `options.to` (string): Recipient address
- `options.testnet` (boolean): Use testnet or mainnet

**Returns:** Promise with payment ID

#### `getPaymentStatus(options)`

Retrieves payment status.

**Parameters:**
- `options.id` (string): Payment ID
- `options.testnet` (boolean): Network flag

**Returns:** Promise with status information

### Components

#### `SignInWithBaseButton`
Base Account sign-in button component.

#### `BasePayButton`
USDC payment button component.

#### `BaseLogo`
Base logo component with customizable sizing.

### Viem Library

Viem (`^2.41.2`) is a TypeScript interface for Ethereum that provides low-level utilities for interacting with Ethereum.

#### `privateKeyToAccount(privateKey)`

Creates a local account from a private key.

**Parameters:**
- `privateKey` (string): Private key in hex format (with or without 0x prefix)

**Returns:** LocalAccount object with address, publicKey, and signing methods

```typescript
const account = privateKeyToAccount('your-private-key-here');
console.log(account.address); // '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
```

#### Key Features Used:
- **Account Creation**: Generate and manage Ethereum accounts
- **Cryptographic Operations**: Secure signing for sub-account transactions
- **Type Safety**: Full TypeScript support for all operations
- **Performance**: Optimized for modern Ethereum applications

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Standards

- Follow the existing code style
- Write clear, concise commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

### Reporting Issues

- Use [GitHub Issues](https://github.com/your-repo/issues) for bug reports
- Provide detailed reproduction steps
- Include browser/console logs if applicable
- Specify your environment (OS, browser, Node version)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

### Getting Help

- 📖 [Documentation](https://docs.base.org)
- 💬 [Discord Community](https://discord.gg/base)
- 🐛 [Bug Reports](https://github.com/your-repo/issues)
- 💡 [Feature Requests](https://github.com/your-repo/issues)
- 📧 [Email Support](mailto:support@base.org)

### Resources

- [Base Documentation](https://docs.base.org)
- [Base Account SDK](https://github.com/base-org/account)
- [Base Faucet](https://faucet.circle.com)
- [Base Explorer](https://basescan.org)

---

<div align="center">

**Built with ❤️ for the Base ecosystem**

[⭐ Star us on GitHub](https://github.com/your-repo) • [🐦 Follow @Base on Twitter](https://twitter.com/base)

</div>
