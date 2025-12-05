import { CheckCircle2, Clock, XCircle, Loader2, ExternalLink } from "lucide-react";

interface PaymentStatusProps {
  status: string;
  paymentId?: string;
  testnet?: boolean;
}

const PaymentStatus = ({ status, paymentId, testnet = true }: PaymentStatusProps) => {
  const getStatusConfig = () => {
    switch (status.toLowerCase()) {
      case "completed":
      case "success":
        return {
          icon: <CheckCircle2 className="w-6 h-6" />,
          text: "Payment Completed",
          className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        };
      case "pending":
      case "processing":
        return {
          icon: <Clock className="w-6 h-6" />,
          text: "Payment Pending",
          className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        };
      case "failed":
      case "error":
        return {
          icon: <XCircle className="w-6 h-6" />,
          text: "Payment Failed",
          className: "bg-red-500/10 text-red-400 border-red-500/20",
        };
      default:
        return {
          icon: <Loader2 className="w-6 h-6 animate-spin" />,
          text: status || "Processing...",
          className: "bg-primary/10 text-primary border-primary/20",
        };
    }
  };

  const config = getStatusConfig();
  const explorerUrl = testnet
    ? `https://sepolia.basescan.org/tx/${paymentId}`
    : `https://basescan.org/tx/${paymentId}`;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border ${config.className} animate-fade-in`}
    >
      {config.icon}
      <div className="flex-1">
        <p className="font-medium">{config.text}</p>
        {paymentId && (
          <p className="text-sm opacity-70 font-mono truncate max-w-[200px]">
            ID: {paymentId.slice(0, 10)}...{paymentId.slice(-8)}
          </p>
        )}
      </div>
      {paymentId && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-foreground/5 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};

export default PaymentStatus;
