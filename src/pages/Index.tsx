'use client';

import { useState, useCallback } from 'react';
import { createBaseAccountSDK, pay, getPaymentStatus } from '@base-org/account';
import { SignInWithBaseButton, BasePayButton } from '@base-org/account-ui/react';
import { Wallet, RefreshCw, Loader2 } from 'lucide-react';
import { privateKeyToAccount, generatePrivateKey } from 'viem/accounts';
import BaseLogo from '@/components/BaseLogo';
import AmountSelector from '@/components/AmountSelector';
import PaymentStatus from '@/components/PaymentStatus';

// Main page component for Base Account demo application
import AddressDisplay from '@/components/AddressDisplay';
import { toast } from 'sonner';

interface WalletConnectResult {
  accounts?: Array<{
    address: string;
    capabilities?: {
      signInWithEthereum?: {
        message: string;
        signature: string;
      };
    };
  }>;
}

const RECIPIENT_ADDRESS = '0xc5983e0b551a7c60d62177cccadf199b9eeac54b';

const Index = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentId, setPaymentId] = useState('');
  const [amount, setAmount] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [isTestnet, setIsTestnet] = useState(true); // Default to testnet

  // Demo owner account for sub-account signing
  const ownerAccount = privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80');

  // Initialize SDK
  const sdk = createBaseAccountSDK({
    appName: 'Base Account Demo',
    appLogoUrl: 'https://base.org/logo.png',
    appChainIds: [isTestnet ? 84532 : 8453], // Base Sepolia or Base Mainnet
    subAccounts: {
      creation: 'manual', // Manual sub-account creation
      defaultAccount: 'sub', // Use sub-account by default
      funding: 'spend-permissions', // Auto-handle funding
      toOwnerAccount: async () => ({ account: ownerAccount }),
    },
  });

  const handleSignIn = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = sdk.getProvider();
      
      // Generate nonce for SIWE
      const nonce = window.crypto.randomUUID().replace(/-/g, '');
      
      // Connect with Sign in with Ethereum
      const result = await provider.request({
        method: 'wallet_connect',
        params: [
          {
            version: '1',
            capabilities: {
              signInWithEthereum: {
                nonce,
                chainId: isTestnet ? '0x14a34' : '0x2105', // Base Sepolia or Base Mainnet
              },
            },
          },
        ],
      }) as WalletConnectResult;

      if (result?.accounts?.[0]) {
        const { address } = result.accounts[0];
        setUserAddress(address);
        setIsSignedIn(true);
        toast.success('Successfully connected to Base Account!');
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sdk, isTestnet]);

  const handleCreateAccount = useCallback(async () => {
    setIsLoading(true);
    try {
      const provider = sdk.getProvider();
      
      // Generate nonce for SIWE
      const nonce = window.crypto.randomUUID().replace(/-/g, '');
      
      // Connect with Sign in with Ethereum
      const result = await provider.request({
        method: 'wallet_connect',
        params: [
          {
            version: '1',
            capabilities: {
              signInWithEthereum: {
                nonce,
                chainId: isTestnet ? '0x14a34' : '0x2105', // Base Sepolia or Base Mainnet
              },
            },
          },
        ],
      }) as WalletConnectResult;

      if (result?.accounts?.[0]) {
        const { address } = result.accounts[0];
        
        // Create sub-account
        await sdk.subAccount.create({
          type: 'create',
          keys: [{
            type: 'p256',
            publicKey: ownerAccount.publicKey, // Use the owner account's public key
          }],
        });
        
        setUserAddress(address);
        setIsSignedIn(true);
        toast.success('Base Account created and connected successfully!');
      }
    } catch (error) {
      console.error('Account creation failed:', error);
      toast.error('Failed to create Base Account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [sdk, ownerAccount.publicKey, isTestnet]);

  const handleCheckStatus = useCallback(async (id?: string) => {
    const checkId = id || paymentId;
    if (!checkId) {
      toast.error('No payment ID found. Please make a payment first.');
      return;
    }

    setIsCheckingStatus(true);
    try {
      const { status } = await getPaymentStatus({ 
        id: checkId,
        testnet: isTestnet 
      });
      setPaymentStatus(status);
      
      if (status === 'completed') {
        toast.success('Payment completed successfully!');
      }
    } catch (error) {
      console.error('Status check failed:', error);
      toast.error('Failed to check payment status.');
    } finally {
      setIsCheckingStatus(false);
    }
  }, [paymentId, isTestnet]);

  const handlePayment = useCallback(async () => {
    if (!amount || parseFloat(amount) < 1) {
      toast.error('Please enter a valid amount (minimum 1 USDC)');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('');
    
    try {
      const { id } = await pay({
        amount: amount,
        to: RECIPIENT_ADDRESS,
        testnet: isTestnet, // Using Base Sepolia testnet or mainnet
      });

      setPaymentId(id);
      setPaymentStatus('Payment initiated! Checking status...');
      toast.success('Payment initiated successfully!');
      
      // Auto-check status after a short delay
      setTimeout(() => handleCheckStatus(id), 2000);
    } catch (error: unknown) {
      console.error('Payment failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setPaymentStatus(`Payment failed: ${errorMessage}`);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [amount, handleCheckStatus, isTestnet]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 bg-glow pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BaseLogo className="w-12 h-12" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Base Account
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">
            Sign in with your Base Account and send USDC payments seamlessly
          </p>
        </header>

        {/* Main Card */}
        <main className="w-full max-w-md">
          <div className="card-gradient rounded-2xl border border-border p-6 md:p-8 shadow-xl animate-scale-in">
            {/* Connection Status */}
            {isSignedIn && userAddress && (
              <div className="mb-6 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 animate-fade-in">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm font-medium">Connected</span>
                </div>
                <p className="text-xs font-mono text-emerald-300/80 mt-1 truncate">
                  {userAddress}
                </p>
              </div>
            )}

            {/* Sign In Section */}
            {!isSignedIn && (
              <div className="space-y-6 mb-8">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    Connect Your Account
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Sign in with your Base Account to get started
                  </p>
                </div>

                {/* Network Selector */}
                <div className="flex justify-center">
                  <div className="flex items-center gap-2 p-2 bg-secondary rounded-lg">
                    <span className="text-sm font-medium">Network:</span>
                    <button
                      onClick={() => setIsTestnet(true)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        isTestnet ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Testnet
                    </button>
                    <button
                      onClick={() => setIsTestnet(false)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                        !isTestnet ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Mainnet
                    </button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <SignInWithBaseButton
                      align="center"
                      variant="solid"
                      colorScheme="dark"
                      onClick={handleSignIn}
                    />
                  </div>

                  <div className="flex justify-center">
                    <button
                      onClick={handleCreateAccount}
                      disabled={isLoading}
                      className="w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium border border-gray-700"
                    >
                      <BaseLogo className="w-5 h-5" />
                      Create a Base Account
                    </button>
                  </div>
                </div>

                {isLoading && (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Connecting...</span>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  {isSignedIn ? 'Send Payment' : 'Or Pay Directly'}
                </span>
              </div>
            </div>

            {/* Payment Section */}
            <div className="space-y-6">
              <AddressDisplay address={RECIPIENT_ADDRESS} label="Funding Address" />
              
              <AmountSelector value={amount} onChange={setAmount} />

              <div className="flex justify-center">
                <BasePayButton
                  colorScheme="dark"
                  onClick={handlePayment}
                />
              </div>

              {isLoading && !isCheckingStatus && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing payment...</span>
                </div>
              )}

              {/* Payment Status */}
              {paymentStatus && (
                <PaymentStatus 
                  status={paymentStatus} 
                  paymentId={paymentId}
                  testnet={isTestnet}
                />
              )}

              {/* Check Status Button */}
              {paymentId && (
                <button
                  onClick={() => handleCheckStatus()}
                  disabled={isCheckingStatus}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                >
                  {isCheckingStatus ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Check Payment Status</span>
                </button>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <footer className="mt-8 text-center space-y-2 animate-fade-in">
            <p className="text-xs text-muted-foreground">
              Using {isTestnet ? 'Base Sepolia Testnet' : 'Base Mainnet'} • Get {isTestnet ? 'test ' : ''}USDC from{' '}
              <a
                href="https://faucet.circle.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Circle Faucet
              </a>
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by{' '}
              <a
                href="https://base.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Base
              </a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
