import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Heart,
  Loader2,
  Lock,
  Wallet,
} from "lucide-react";

// ── ABI ────────────────────────────────────────────────────────────────
const EDUFUND_ABI = [
  "function donate(string memory _message) external payable",
  "function getBalance() external view returns (uint256)",
  "function getDonorCount() external view returns (uint256)",
  "function totalDonations() external view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 amount, string message, uint256 timestamp)",
];

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111
const ETH_TO_IDR = 52000000;

const STATUS = {
  IDLE: "idle",
  WAITING_WALLET: "waiting_wallet",
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
};

export default function DonationCard({ onDonationSuccess, onMetricsChange, onConnectReady }) {
  const [account, setAccount] = useState(null);
  const [network, setNetwork] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [txHash, setTxHash] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  const idrEstimate = amount
    ? `≈ Rp ${Math.round(parseFloat(amount) * ETH_TO_IDR).toLocaleString("id-ID")}`
    : "≈ Rp 0";

  const fetchBalance = useCallback(
    async (provider) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);
      const bal = await contract.getBalance();
      const donors = await contract.getDonorCount();

      const nextBalance = ethers.formatEther(bal);
      const nextDonors = donors.toString();

      if (onMetricsChange) {
        onMetricsChange({ balance: nextBalance, donorCount: nextDonors });
      }
    } catch {
      // Ignore if contract is placeholder
    }
    },
    [onMetricsChange]
  );

  const checkNetwork = useCallback(async (provider) => {
    const net = await provider.getNetwork();
    setNetwork(net.name);
    setIsWrongNetwork(net.chainId !== BigInt(parseInt(SEPOLIA_CHAIN_ID, 16)));
  }, []);

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setErrorMsg("MetaMask tidak ditemukan. Silakan install ekstensi MetaMask.");
      setStatus(STATUS.ERROR);
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      await checkNetwork(provider);
      await fetchBalance(provider);
    } catch (err) {
      setErrorMsg("Koneksi wallet ditolak pengguna.");
      setStatus(STATUS.ERROR);
    }
  }, [checkNetwork, fetchBalance]);

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      setErrorMsg("Gagal berpindah ke jaringan Sepolia.");
      setStatus(STATUS.ERROR);
    }
  };

  const handleDonate = async () => {
    setErrorMsg("");
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setErrorMsg("Masukkan nominal ETH yang valid.");
      return;
    }
    if (parsed < 0.001) {
      setErrorMsg("Donasi minimal adalah 0.001 ETH.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, signer);

      setStatus(STATUS.WAITING_WALLET);
      const donateMessage = message.trim() === "" ? "Hamba Allah" : message;
      
      const tx = await contract.donate(donateMessage, {
        value: ethers.parseEther(amount),
      });

      setTxHash(tx.hash);
      setStatus(STATUS.PENDING);

      await tx.wait(1);

      setStatus(STATUS.SUCCESS);
      setAmount("");
      setMessage("");
      await fetchBalance(provider);

      if (onDonationSuccess) onDonationSuccess(tx.hash);

    } catch (err) {
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setErrorMsg("Transaksi dibatalkan oleh user.");
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setErrorMsg("Saldo ETH di wallet tidak mencukupi.");
      } else {
        setErrorMsg("Transaksi gagal diproses.");
      }
      setStatus(STATUS.ERROR);
    }
  };

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => setAccount(accounts[0] || null);
    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, []);

  useEffect(() => {
    if (onConnectReady) {
      onConnectReady(() => connectWallet());
    }
  }, [connectWallet, onConnectReady]);

  const shortAddr = (addr) => (addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "");
  const isLoading = status === STATUS.WAITING_WALLET || status === STATUS.PENDING;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-[32px] bg-brand-100/60 blur-2xl" />
      <div className="glass-card relative rounded-[28px] p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-xl text-slate-900">
              Donasi untuk Pendidikan
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Bantu sediakan alat tulis, buku, dan mainan edukatif.
            </p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-500">
            <Heart className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-5 space-y-4">
          {!account ? (
            <button
              onClick={connectWallet}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              type="button"
            >
              Hubungkan MetaMask
            </button>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Wallet className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-slate-500">
                      Wallet terhubung
                    </p>
                    <p className="text-sm font-mono text-slate-700">
                      {shortAddr(account)}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    isWrongNetwork
                      ? "bg-rose-100 text-rose-700"
                      : "bg-brand-100 text-brand-700"
                  }`}
                >
                  {isWrongNetwork ? "Salah jaringan" : network}
                </span>
              </div>
            </div>
          )}

          <AnimatePresence>
            {isWrongNetwork && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3"
              >
                <span className="text-xs font-medium text-amber-800">
                  Gunakan Sepolia Testnet
                </span>
                <button
                  onClick={switchToSepolia}
                  className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white"
                  type="button"
                >
                  Switch
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Jumlah Donasi (ETH)
            </label>
            <div className="relative mt-2 flex items-center">
              <input
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.05"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
                    setStatus(STATUS.IDLE);
                  }
                }}
                disabled={isLoading || !account || isWrongNetwork}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-24 text-sm font-semibold text-slate-700 outline-none transition focus:border-brand-500 disabled:opacity-50"
              />
              <span className="absolute right-4 text-xs font-semibold text-slate-500">
                {idrEstimate}
              </span>
            </div>
          </div>

          <div className="flex gap-2 text-xs">
            {[
              { label: "0.01 ETH", value: "0.01" },
              { label: "0.05 ETH", value: "0.05" },
              { label: "0.1 ETH", value: "0.1" },
            ].map((preset) => (
              <button
                key={preset.value}
                className="flex-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 font-semibold text-slate-700"
                onClick={() => setAmount(preset.value)}
                type="button"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Pesan Donatur
            </label>
            <input
              type="text"
              placeholder="Dari Alumni 2020"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={isLoading || !account || isWrongNetwork}
              maxLength={100}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-brand-500 disabled:opacity-50"
            />
          </div>

          <button
            onClick={handleDonate}
            disabled={isLoading || !account || isWrongNetwork || !amount}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 shadow-soft transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            type="button"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {status === STATUS.WAITING_WALLET
                  ? "Menunggu persetujuan MetaMask"
                  : "Memproses transaksi"}
              </>
            ) : (
              <>
                <Heart className="h-4 w-4" />
                Donasi Sekarang
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5" />
            Transaksi aman via Smart Contract
          </div>

          <AnimatePresence mode="popLayout">
            {status === STATUS.SUCCESS && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-xl border border-emerald-200 bg-emerald-50 p-4"
              >
                <div className="flex items-start gap-3 text-emerald-700">
                  <CheckCircle2 className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold">Donasi Berhasil!</p>
                    <p className="text-xs">
                      Transaksi Anda tercatat permanen di blockchain.
                    </p>
                    {txHash && (
                      <a
                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700"
                        href={`https://sepolia.etherscan.io/tx/${txHash}`}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Lihat di Etherscan <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {status === STATUS.ERROR && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5" />
                  <p>{errorMsg}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
