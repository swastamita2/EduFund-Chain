// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

/**
 * @title EduFund Chain
 * @author Kelompok 7 - Kelas A
 * @dev Sistem Donasi Transparan untuk Institusi Pendidikan Usia Dini Berbasis Ethereum.
 */
contract EduFund {
    // --- State Variables ---
    address public owner;
    
    /**
     * @dev totalDonations mencatat AKUMULASI historis seluruh dana yang pernah masuk.
     * Variabel ini sengaja tidak dikurangi saat withdraw untuk menjaga rekam jejak
     * total dampak (total impact) yang dikelola yayasan. 
     * Untuk melihat saldo likuid saat ini, gunakan fungsi getBalance().
     */
    uint256 public totalDonations;
    
    // Melacak jumlah donatur unik
    uint256 public donorCount;
    
    // Mapping untuk melacak total kontribusi per alamat dompet
    mapping(address => uint256) public donorBalances;
    
    // Mapping untuk melacak apakah sebuah alamat sudah pernah berdonasi
    mapping(address => bool) private hasDonated;

    // --- Events ---
    event DonationReceived(
        address indexed donor, 
        uint256 amount, 
        string message, 
        uint256 timestamp
    );
    
    event FundsWithdrawn(
        address indexed owner, 
        uint256 amount, 
        uint256 timestamp
    );

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Akses Ditolak: Hanya admin yayasan yang diizinkan");
        _;
    }

    // --- Constructor ---
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Fungsi untuk menerima donasi ETH beserta pesan dari donatur.
     */
    function donate(string memory _message) public payable {
        require(msg.value > 0, "Nominal donasi harus lebih dari 0");
        
        totalDonations += msg.value;
        donorBalances[msg.sender] += msg.value;
        
        // Logika pencatatan donatur unik
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            donorCount++;
        }
        
        emit DonationReceived(msg.sender, msg.value, _message, block.timestamp);
    }

    /**
     * @dev Fungsi view untuk melihat saldo (liquid balance) kontrak saat ini.
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Fungsi view untuk melihat jumlah donatur unik.
     */
    function getDonorCount() public view returns (uint256) {
        return donorCount;
    }

    /**
     * @dev Fungsi untuk menarik dana donasi ke wallet yayasan.
     * Menggunakan metode .call() (Best Practice) untuk keamanan dan fleksibilitas gas.
     */
    function withdrawFunds(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Saldo tidak mencukupi");
        
        // Pola Checks-Effects-Interactions: Transfer dilakukan di akhir
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(success, "Transfer gagal: Periksa kembali limit gas atau alamat owner");
        
        emit FundsWithdrawn(owner, _amount, block.timestamp);
    }

    /**
     * @dev Fallback function yang dioptimalkan untuk batasan gas (Gas Limit).
     * Menerima transaksi transfer langsung dengan biaya gas minimal.
     */
    receive() external payable {
        totalDonations += msg.value;
        donorBalances[msg.sender] += msg.value;
        
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            donorCount++;
        }
        
        // Event direkam dengan pesan default untuk membedakan jalur donasi
        emit DonationReceived(msg.sender, msg.value, "Direct Transfer", block.timestamp);
    }
}
