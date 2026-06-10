export const EDUFUND_ABI = [
  "function donate(string _message) external payable",
  "function getBalance() external view returns (uint256)",
  "function getDonorCount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function paused() external view returns (bool)",
  "function withdrawFunds(uint256 _amount) external",
  "function pause() external",
  "function unpause() external",
  "event DonationReceived(address indexed donor, uint256 amount, string message, uint256 timestamp)",
];

export const CONTRACT_ADDRESS =
  import.meta.env.VITE_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000";

export const SEPOLIA_CHAIN_ID = "0xaa36a7";
export const PUBLIC_RPC_URL = "https://rpc.sepolia.org";
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DEFAULT_BLOCK_RANGE = 5000;

export const STATUS = {
  IDLE: "idle",
  WAITING_WALLET: "waiting_wallet",
  PENDING: "pending",
  SUCCESS: "success",
  ERROR: "error",
};
