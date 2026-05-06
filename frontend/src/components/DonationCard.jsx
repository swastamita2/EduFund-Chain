import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

// ── ABI hanya fungsi yang dipakai DonationCard ──────────────────────────────
const EDUFUND_ABI = [
  "function donate() external payable",
  "function getBalance() external view returns (uint256)",
  "function totalDonations() external view returns (uint256)",
  "event DonationReceived(address indexed donor, uint256 amount, uint256 timestamp)",
];

// ── Ganti dengan address kontrak kalian setelah deploy di Sepolia ───────────
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000";

// ── Konstanta ────────────────────────────────────────────────────────────────
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111 dalam hex
const ETH_TO_IDR = 52_000_000;      // estimasi kurs, sesuaikan

// ── Status tx ────────────────────────────────────────────────────────────────
const STATUS = {
  IDLE: "idle",
  WAITING_WALLET: "waiting_wallet",
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
};

export default function DonationCard({ onDonationSuccess }) {
  const [account, setAccount]         = useState(null);
  const [network, setNetwork]         = useState(null);
  const [balance, setBalance]         = useState("0");
  const [amount, setAmount]           = useState("");
  const [status, setStatus]           = useState(STATUS.IDLE);
  const [txHash, setTxHash]           = useState("");
  const [errorMsg, setErrorMsg]       = useState("");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  // ── Estimasi IDR ─────────────────────────────────────────────────────────
  const idrEstimate = amount
    ? `≈ Rp ${Math.round(parseFloat(amount) * ETH_TO_IDR).toLocaleString("id-ID")}`
    : "";

  // ── Ambil saldo kontrak ──────────────────────────────────────────────────
  const fetchBalance = useCallback(async (provider) => {
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);
      const bal = await contract.getBalance();
      setBalance(ethers.formatEther(bal));
    } catch {
      // kontrak belum di-deploy atau address placeholder — abaikan
    }
  }, []);

  // ── Cek jaringan ─────────────────────────────────────────────────────────
  const checkNetwork = useCallback(async (provider) => {
    const net = await provider.getNetwork();
    setNetwork(net.name);
    setIsWrongNetwork(net.chainId !== BigInt(parseInt(SEPOLIA_CHAIN_ID, 16)));
  }, []);

  // ── Connect MetaMask ─────────────────────────────────────────────────────
  const connectWallet = async () => {
    if (!window.ethereum) {
      setErrorMsg("MetaMask tidak ditemukan. Silakan install terlebih dahulu.");
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
      setErrorMsg("Koneksi wallet ditolak.");
      setStatus(STATUS.ERROR);
    }
  };

  // ── Switch ke Sepolia ────────────────────────────────────────────────────
  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (err) {
      setErrorMsg("Gagal berpindah jaringan ke Sepolia.");
      setStatus(STATUS.ERROR);
    }
  };

  // ── Kirim donasi ─────────────────────────────────────────────────────────
  const handleDonate = async () => {
    setErrorMsg("");

    // Validasi input
    const parsed = parseFloat(amount);
    if (!amount || isNaN(parsed) || parsed <= 0) {
      setErrorMsg("Masukkan nominal ETH yang valid (contoh: 0.05).");
      return;
    }
    if (parsed < 0.001) {
      setErrorMsg("Donasi minimal 0.001 ETH.");
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer   = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, signer);

      // Tahap 1: tunggu approval MetaMask
      setStatus(STATUS.WAITING_WALLET);
      const tx = await contract.donate({
        value: ethers.parseEther(amount),
      });

      // Tahap 2: tx terbroadcast, tunggu konfirmasi
      setTxHash(tx.hash);
      setStatus(STATUS.PENDING);

      // Tunggu 1 konfirmasi block
      await tx.wait(1);

      // Sukses
      setStatus(STATUS.SUCCESS);
      setAmount("");
      await fetchBalance(provider);

      // Callback ke parent (untuk refresh HistoryTable, dsb.)
      if (onDonationSuccess) onDonationSuccess(tx.hash);

    } catch (err) {
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setErrorMsg("Transaksi dibatalkan oleh user.");
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setErrorMsg("Saldo ETH di wallet tidak cukup.");
      } else {
        setErrorMsg(err.reason || err.message || "Transaksi gagal.");
      }
      setStatus(STATUS.ERROR);
    }
  };

  // ── Listen perubahan akun / jaringan dari MetaMask ───────────────────────
  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => setAccount(accounts[0] || null);
    const handleChainChanged    = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged",    handleChainChanged);
    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged",    handleChainChanged);
    };
  }, []);

  // ── Format alamat singkat ─────────────────────────────────────────────────
  const shortAddr = (addr) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // ── Label tombol utama ───────────────────────────────────────────────────
  const buttonLabel = () => {
    switch (status) {
      case STATUS.WAITING_WALLET: return "Menunggu konfirmasi MetaMask...";
      case STATUS.PENDING:        return "Memproses transaksi...";
      default:                    return "Donasi via MetaMask";
    }
  };

  const isLoading = status === STATUS.WAITING_WALLET || status === STATUS.PENDING;

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={styles.wrapper}>

      {/* ── Header saldo kontrak ── */}
      <div style={styles.hero}>
        <p style={styles.heroLabel}>Total donasi terkumpul</p>
        <p style={styles.heroAmount}>{parseFloat(balance).toFixed(4)} ETH</p>
        <p style={styles.heroSub}>dari smart contract EduFund · Sepolia Testnet</p>
      </div>

      <div style={styles.body}>

        {/* ── Status wallet ── */}
        {!account ? (
          <button style={styles.btnConnect} onClick={connectWallet}>
            Hubungkan MetaMask
          </button>
        ) : (
          <div style={styles.walletRow}>
            <span style={styles.dot} />
            <span style={styles.walletAddr}>{shortAddr(account)}</span>
            {network && (
              <span style={isWrongNetwork ? styles.badgeDanger : styles.badgeOk}>
                {isWrongNetwork ? "Jaringan salah" : network}
              </span>
            )}
          </div>
        )}

        {/* ── Peringatan jaringan salah ── */}
        {isWrongNetwork && account && (
          <div style={styles.alertWarn}>
            <span>Harap gunakan jaringan Sepolia Testnet.</span>
            <button style={styles.btnSwitch} onClick={switchToSepolia}>
              Switch ke Sepolia
            </button>
          </div>
        )}

        {/* ── Form donasi ── */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Nominal donasi (ETH)</label>
          <div style={styles.inputRow}>
            <input
              type="number"
              step="0.001"
              min="0.001"
              placeholder="cth: 0.05"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (status === STATUS.SUCCESS || status === STATUS.ERROR) {
                  setStatus(STATUS.IDLE);
                  setErrorMsg("");
                }
              }}
              disabled={isLoading || !account || isWrongNetwork}
              style={styles.input}
            />
            <span style={styles.ethBadge}>ETH</span>
          </div>
          {idrEstimate && (
            <p style={styles.idrHint}>{idrEstimate} (estimasi)</p>
          )}
        </div>

        {/* ── Tombol donasi ── */}
        <button
          style={{
            ...styles.btnDonate,
            opacity: isLoading || !account || isWrongNetwork || !amount ? 0.55 : 1,
            cursor:  isLoading || !account || isWrongNetwork || !amount ? "not-allowed" : "pointer",
          }}
          onClick={handleDonate}
          disabled={isLoading || !account || isWrongNetwork || !amount}
        >
          {isLoading && <span style={styles.spinner} />}
          {buttonLabel()}
        </button>

        {/* ── Status: sukses ── */}
        {status === STATUS.SUCCESS && (
          <div style={styles.alertSuccess}>
            <p style={{ margin: "0 0 4px", fontWeight: 500 }}>Donasi berhasil! Terima kasih.</p>
            {txHash && (
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
                style={styles.txLink}
              >
                Lihat di Etherscan ↗
              </a>
            )}
          </div>
        )}

        {/* ── Status: error ── */}
        {status === STATUS.ERROR && errorMsg && (
          <div style={styles.alertError}>{errorMsg}</div>
        )}

        {/* ── Hash tx (saat pending) ── */}
        {status === STATUS.PENDING && txHash && (
          <p style={styles.txPending}>
            Tx hash:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              style={styles.txLink}
            >
              {txHash.slice(0, 20)}...
            </a>
          </p>
        )}

        {/* ── Catatan ── */}
        <p style={styles.note}>
          Transaksi diproses di Ethereum Sepolia Testnet. ETH yang digunakan
          adalah ETH testnet (tidak bernilai nyata).
        </p>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// STYLES (inline — tidak perlu CSS module / Tailwind)
// ════════════════════════════════════════════════════════════════════════════
const styles = {
  wrapper: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: 420,
    borderRadius: 16,
    border: "1px solid #e2e8f0",
    overflow: "hidden",
    background: "#ffffff",
  },
  hero: {
    background: "#0F6E56",
    padding: "20px 20px 16px",
    textAlign: "center",
  },
  heroLabel: {
    margin: "0 0 4px",
    fontSize: 11,
    color: "#9FE1CB",
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  heroAmount: {
    margin: "0 0 4px",
    fontSize: 30,
    fontWeight: 600,
    color: "#ffffff",
  },
  heroSub: {
    margin: 0,
    fontSize: 11,
    color: "#5DCAA5",
  },
  body: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  walletRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 12px",
    background: "#f8faf9",
    borderRadius: 8,
    border: "1px solid #e2e8f0",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "#1D9E75",
    flexShrink: 0,
  },
  walletAddr: { fontSize: 13, color: "#374151", fontFamily: "monospace", flex: 1 },
  badgeOk: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 20,
    background: "#EAF3DE",
    color: "#3B6D11",
    fontWeight: 500,
  },
  badgeDanger: {
    fontSize: 11,
    padding: "2px 8px",
    borderRadius: 20,
    background: "#FCEBEB",
    color: "#A32D2D",
    fontWeight: 500,
  },
  btnConnect: {
    width: "100%",
    padding: "10px 0",
    background: "#0F6E56",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  alertWarn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    padding: "10px 12px",
    background: "#FAEEDA",
    borderRadius: 8,
    fontSize: 12,
    color: "#854F0B",
  },
  btnSwitch: {
    padding: "4px 10px",
    background: "#BA7517",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 11,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  formGroup: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 13, fontWeight: 500, color: "#374151" },
  inputRow: { display: "flex", alignItems: "center", gap: 8 },
  input: {
    flex: 1,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    background: "#f9fafb",
  },
  ethBadge: {
    fontSize: 13,
    fontWeight: 600,
    color: "#6b7280",
    minWidth: 32,
  },
  idrHint: { margin: 0, fontSize: 11, color: "#9ca3af" },
  btnDonate: {
    width: "100%",
    padding: "12px 0",
    background: "#0F6E56",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "opacity 0.2s",
  },
  spinner: {
    width: 14,
    height: 14,
    border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  alertSuccess: {
    padding: "10px 12px",
    background: "#EAF3DE",
    borderRadius: 8,
    fontSize: 12,
    color: "#3B6D11",
  },
  alertError: {
    padding: "10px 12px",
    background: "#FCEBEB",
    borderRadius: 8,
    fontSize: 12,
    color: "#A32D2D",
  },
  txPending: { margin: 0, fontSize: 11, color: "#6b7280" },
  txLink: { color: "#0F6E56", fontSize: 12 },
  note: {
    margin: 0,
    fontSize: 11,
    color: "#9ca3af",
    textAlign: "center",
    lineHeight: 1.5,
  },
};
