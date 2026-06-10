import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import {
  EDUFUND_ABI,
  CONTRACT_ADDRESS,
  SEPOLIA_CHAIN_ID,
  PUBLIC_RPC_URL,
  ZERO_ADDRESS,
  DEFAULT_BLOCK_RANGE,
  STATUS,
} from "../constants/blockchain";

export function useBlockchain() {
  const [account, setAccount] = useState("");
  const [network, setNetwork] = useState("");
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [balance, setBalance] = useState("0");
  const [donorCount, setDonorCount] = useState("0");
  const [ownerAddress, setOwnerAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");
  const [txHash, setTxHash] = useState("");
  const [history, setHistory] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawStatus, setWithdrawStatus] = useState(STATUS.IDLE);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawTxHash, setWithdrawTxHash] = useState("");
  const [pauseStatus, setPauseStatus] = useState(STATUS.IDLE);
  const [pauseError, setPauseError] = useState("");
  const [ethToIdr, setEthToIdr] = useState(52000000);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const publicProvider = useMemo(
    () => new ethers.JsonRpcProvider(PUBLIC_RPC_URL),
    []
  );

  // Live ETH/IDR price dari CoinGecko
  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=idr"
        );
        const data = await res.json();
        if (data?.ethereum?.idr) setEthToIdr(data.ethereum.idr);
      } catch {
        // Gunakan fallback jika API gagal
      }
    };
    fetchPrice();
    const interval = setInterval(fetchPrice, 60000);
    return () => clearInterval(interval);
  }, []);

  const idrEstimate = useMemo(() => {
    const parsed = Number.parseFloat(amount);
    if (!amount || Number.isNaN(parsed)) {
      return "~ Rp 0";
    }
    return `~ Rp ${Math.round(parsed * ethToIdr).toLocaleString("id-ID")}`;
  }, [amount, ethToIdr]);

  const balanceDisplay = useMemo(() => {
    const parsed = Number.parseFloat(balance);
    if (!Number.isFinite(parsed)) {
      return "0.0";
    }
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 4,
    });
  }, [balance]);

  const donorDisplay = useMemo(() => {
    const parsed = Number.parseFloat(donorCount);
    if (!Number.isFinite(parsed)) {
      return "0";
    }
    return parsed.toLocaleString("id-ID");
  }, [donorCount]);

  const isLoading = status === STATUS.WAITING_WALLET || status === STATUS.PENDING;
  const isWithdrawing =
    withdrawStatus === STATUS.WAITING_WALLET || withdrawStatus === STATUS.PENDING;
  const isPausing = pauseStatus === STATUS.WAITING_WALLET || pauseStatus === STATUS.PENDING;
  const isContractMissing = CONTRACT_ADDRESS === ZERO_ADDRESS;

  const isOwner = useMemo(() => {
    if (!account || !ownerAddress) return false;
    return account.toLowerCase() === ownerAddress.toLowerCase();
  }, [account, ownerAddress]);

  const shortAddr = useCallback((addr) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }, []);

  const formatEth = useCallback((value) => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) {
      return "0.0000";
    }
    return parsed.toLocaleString("en-US", {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  }, []);

  const formatTime = useCallback((timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp * 1000).toLocaleString("id-ID");
  }, []);

  const checkNetwork = useCallback(async (provider) => {
    const net = await provider.getNetwork();
    setNetwork(net.name || "Unknown");
    setIsWrongNetwork(net.chainId !== BigInt(parseInt(SEPOLIA_CHAIN_ID, 16)));
  }, []);

  const fetchStats = useCallback(async (provider) => {
    if (CONTRACT_ADDRESS === ZERO_ADDRESS) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);
      const bal = await contract.getBalance();
      const donors = await contract.getDonorCount();
      setBalance(ethers.formatEther(bal));
      setDonorCount(donors.toString());
    } catch {
      // Abaikan jika kontrak tidak dapat dihubungi
    }
  }, []);

  const fetchMeta = useCallback(async (provider) => {
    if (CONTRACT_ADDRESS === ZERO_ADDRESS) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);
      const [owner, paused] = await Promise.all([
        contract.owner(),
        contract.paused(),
      ]);
      setOwnerAddress(owner);
      setIsPaused(Boolean(paused));
    } catch {
      // Abaikan jika kontrak tidak dapat dihubungi
    }
  }, []);

  const mergeHistory = useCallback((prev, next) => {
    const map = new Map(prev.map((item) => [item.txHash, item]));
    next.forEach((item) => {
      if (!map.has(item.txHash)) {
        map.set(item.txHash, item);
      }
    });
    return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
  }, []);

  const fetchHistory = useCallback(
    async (provider, options = {}) => {
      if (CONTRACT_ADDRESS === ZERO_ADDRESS) return;
      try {
        const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);
        const latestBlock = await provider.getBlockNumber();
        const toBlock =
          typeof options.toBlock === "number" ? options.toBlock : latestBlock;
        const fromBlock =
          typeof options.fromBlock === "number"
            ? options.fromBlock
            : Math.max(toBlock - DEFAULT_BLOCK_RANGE, 0);

        const events = await contract.queryFilter(
          contract.filters.DonationReceived(),
          fromBlock,
          toBlock
        );

        const items = events.map((event) => {
          const args = event.args || [];
          return {
            donor: args[0],
            amount: args[1] ? ethers.formatEther(args[1]) : "0",
            message: args[2] || "",
            timestamp: args[3] ? Number(args[3]) : 0,
            txHash: event.transactionHash,
          };
        });

        setHistory((prev) =>
          options.append ? mergeHistory(prev, items) : mergeHistory([], items)
        );
      } catch {
        // Abaikan jika kontrak tidak dapat dihubungi
      }
    },
    [mergeHistory]
  );

  const refreshAll = useCallback(
    async (provider) => {
      await checkNetwork(provider);
      await fetchStats(provider);
      await fetchHistory(provider);
      await fetchMeta(provider);
    },
    [checkNetwork, fetchHistory, fetchMeta, fetchStats]
  );

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setErrorMsg("MetaMask tidak ditemukan. Silakan install ekstensi MetaMask.");
      setStatus(STATUS.ERROR);
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const nextAccount = accounts[0] || "";
      setAccount(nextAccount);
      await refreshAll(provider);
      setStatus(STATUS.IDLE);
      setErrorMsg("");
    } catch {
      setErrorMsg("Koneksi wallet ditolak pengguna.");
      setStatus(STATUS.ERROR);
    }
  }, [refreshAll]);

  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      await refreshAll(provider);
    } catch {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: SEPOLIA_CHAIN_ID,
              chainName: "Sepolia Testnet",
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "SEP",
                decimals: 18,
              },
              rpcUrls: ["https://rpc.sepolia.org"],
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            },
          ],
        });
        const provider = new ethers.BrowserProvider(window.ethereum);
        await refreshAll(provider);
      } catch {
        setErrorMsg("Gagal berpindah ke jaringan Sepolia.");
        setStatus(STATUS.ERROR);
      }
    }
  }, [refreshAll]);

  const handleDonate = useCallback(async () => {
    setErrorMsg("");

    if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
      setErrorMsg("Alamat smart contract belum diatur.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (!window.ethereum) {
      setErrorMsg("MetaMask tidak ditemukan.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (!account) {
      setErrorMsg("Hubungkan wallet terlebih dahulu.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (isWrongNetwork) {
      setErrorMsg("Gunakan jaringan Sepolia Testnet.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (isPaused) {
      setErrorMsg("Kontrak sedang dijeda oleh admin.");
      setStatus(STATUS.ERROR);
      return;
    }

    const parsed = Number.parseFloat(amount);
    if (!amount || Number.isNaN(parsed) || parsed <= 0) {
      setErrorMsg("Masukkan nominal ETH yang valid.");
      setStatus(STATUS.ERROR);
      return;
    }
    if (parsed < 0.001) {
      setErrorMsg("Donasi minimal adalah 0.001 ETH.");
      setStatus(STATUS.ERROR);
      return;
    }

    if (message.trim().length > 120) {
      setErrorMsg("Pesan terlalu panjang (maksimal 120 karakter).");
      setStatus(STATUS.ERROR);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, signer);

      setStatus(STATUS.WAITING_WALLET);
      setTxHash("");
      const donateMessage = message.trim() === "" ? "Hamba Allah" : message.trim();
      const tx = await contract.donate(donateMessage, {
        value: ethers.parseEther(amount),
      });

      setTxHash(tx.hash);
      setStatus(STATUS.PENDING);
      await tx.wait(1);
      setStatus(STATUS.SUCCESS);
      setAmount("");
      await fetchStats(provider);
      await fetchHistory(provider);
    } catch (err) {
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setErrorMsg("Transaksi dibatalkan oleh pengguna.");
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setErrorMsg("Saldo ETH di wallet tidak mencukupi.");
      } else {
        setErrorMsg("Transaksi gagal diproses.");
      }
      setStatus(STATUS.ERROR);
    }
  }, [account, amount, fetchHistory, fetchStats, isWrongNetwork, message, isPaused]);

  const handleWithdraw = useCallback(async () => {
    setWithdrawError("");
    if (CONTRACT_ADDRESS === ZERO_ADDRESS) {
      setWithdrawError("Alamat smart contract belum diatur.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    if (!window.ethereum) {
      setWithdrawError("MetaMask tidak ditemukan.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    if (!account) {
      setWithdrawError("Hubungkan wallet terlebih dahulu.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    if (!isOwner) {
      setWithdrawError("Hanya owner yang dapat menarik dana.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    if (isWrongNetwork) {
      setWithdrawError("Gunakan jaringan Sepolia Testnet.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    const parsed = Number.parseFloat(withdrawAmount);
    if (!withdrawAmount || Number.isNaN(parsed) || parsed <= 0) {
      setWithdrawError("Masukkan nominal penarikan yang valid.");
      setWithdrawStatus(STATUS.ERROR);
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, signer);

      setWithdrawStatus(STATUS.WAITING_WALLET);
      setWithdrawTxHash("");
      const tx = await contract.withdrawFunds(ethers.parseEther(withdrawAmount));
      setWithdrawTxHash(tx.hash);
      setWithdrawStatus(STATUS.PENDING);
      await tx.wait(1);
      setWithdrawStatus(STATUS.SUCCESS);
      setWithdrawAmount("");
      await fetchStats(provider);
    } catch (err) {
      if (err.code === 4001 || err.code === "ACTION_REJECTED") {
        setWithdrawError("Penarikan dibatalkan oleh pengguna.");
      } else if (err.code === "INSUFFICIENT_FUNDS") {
        setWithdrawError("Saldo kontrak tidak mencukupi.");
      } else {
        setWithdrawError("Penarikan gagal diproses.");
      }
      setWithdrawStatus(STATUS.ERROR);
    }
  }, [account, fetchStats, isOwner, isWrongNetwork, withdrawAmount]);

  const handleTogglePause = useCallback(async () => {
    setPauseError("");
    if (!window.ethereum || !account || !isOwner) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, signer);

      setPauseStatus(STATUS.WAITING_WALLET);
      const tx = isPaused ? await contract.unpause() : await contract.pause();
      setPauseStatus(STATUS.PENDING);
      await tx.wait(1);
      setPauseStatus(STATUS.SUCCESS);
      setIsPaused(!isPaused);
    } catch {
      setPauseError("Gagal mengubah status jeda kontrak.");
      setPauseStatus(STATUS.ERROR);
    }
  }, [account, isOwner, isPaused]);

  useEffect(() => {
    if (!window.ethereum) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    provider.send("eth_accounts", []).then((accounts) => {
      if (!accounts || accounts.length === 0) return;
      setAccount(accounts[0]);
      refreshAll(provider);
    });
  }, [refreshAll]);

  useEffect(() => {
    if (account) return;
    refreshAll(publicProvider);
  }, [account, publicProvider, refreshAll]);

  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    if (CONTRACT_ADDRESS === ZERO_ADDRESS) return;
    const provider = window.ethereum
      ? new ethers.BrowserProvider(window.ethereum)
      : publicProvider;
    const contract = new ethers.Contract(CONTRACT_ADDRESS, EDUFUND_ABI, provider);

    const handleDonation = (donor, amountValue, messageVal, timestamp, event) => {
      const txHashValue = event?.transactionHash || "";
      const formattedAmount = ethers.formatEther(amountValue);
      const nextItem = {
        donor,
        amount: formattedAmount,
        message: messageVal || "",
        timestamp: timestamp ? Number(timestamp) : 0,
        txHash: txHashValue,
      };

      setHistory((prev) => {
        if (txHashValue && prev.some((item) => item.txHash === txHashValue)) {
          return prev;
        }
        return [nextItem, ...prev].slice(0, 50);
      });
      fetchStats(provider);

      // Add toast notification
      setToasts((prev) => [
        ...prev,
        {
          id: `${txHashValue}-${Date.now()}`,
          donor: shortAddr(donor),
          amount: formattedAmount,
          message: messageVal || "",
        },
      ]);
    };

    contract.on("DonationReceived", handleDonation);
    return () => {
      contract.off("DonationReceived", handleDonation);
    };
  }, [fetchStats, publicProvider, shortAddr]);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    if (!window.ethereum) return;
    const handleAccountsChanged = (accounts) => {
      const nextAccount = accounts[0] || "";
      setAccount(nextAccount);
      if (!nextAccount) return;
      const provider = new ethers.BrowserProvider(window.ethereum);
      refreshAll(provider);
    };
    const handleChainChanged = () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      refreshAll(provider);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [refreshAll]);

  return {
    account,
    network,
    isWrongNetwork,
    isPaused,
    balance,
    donorCount,
    ownerAddress,
    amount,
    setAmount,
    message,
    setMessage,
    status,
    setStatus,
    errorMsg,
    setErrorMsg,
    txHash,
    history,
    withdrawAmount,
    setWithdrawAmount,
    withdrawStatus,
    withdrawError,
    withdrawTxHash,
    pauseStatus,
    pauseError,
    ethToIdr,
    isAdminMode,
    setIsAdminMode,
    idrEstimate,
    balanceDisplay,
    donorDisplay,
    isLoading,
    isWithdrawing,
    isPausing,
    isContractMissing,
    isOwner,
    shortAddr,
    formatEth,
    formatTime,
    connectWallet,
    switchToSepolia,
    handleDonate,
    handleWithdraw,
    handleTogglePause,
    toasts,
    dismissToast,
  };
}
