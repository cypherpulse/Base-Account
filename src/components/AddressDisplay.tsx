import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface AddressDisplayProps {
  address: string;
  label?: string;
}

const AddressDisplay = ({ address, label = "Recipient" }: AddressDisplayProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const truncatedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="bg-secondary/50 rounded-xl p-4 border border-border">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-sm text-foreground">{truncatedAddress}</span>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
          title="Copy address"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default AddressDisplay;
