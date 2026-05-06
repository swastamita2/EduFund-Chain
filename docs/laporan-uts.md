# LAPORAN PROYEK AKHIR MATA KULIAH TEKNOLOGI BLOCKCHAIN (TAHAP UTS)

---
**JUDUL PROYEK:** EduFund Chain: Sistem Donasi Transparan untuk Institusi Pendidikan Usia Dini Berbasis Ethereum
**PROGRAM STUDI:** S1 Sistem Informasi — Strata 1 (S1)
**DOSEN PENGAMPU:** Riani Saputri Abadi
**KELOMPOK:** 7 (Tujuh) — Kelas A

---

## DAFTAR ANGGOTA KELOMPOK

| No | NIM | Nama Mahasiswa | Peran Utama (Project Charter) |
| :--- | :--- | :--- | :--- |
| 1 | 202332119 | Achmad Sapta Megan Nugroho | Frontend Developer (React.js) & Architect |
| 2 | 202332124 | Lulu El Maknun | Researcher & Literature Reviewer |
| 3 | 202332128 | Muhammad Kivlan Kusuma Bakti | Smart Contract Developer (Solidity) |
| 4 | 202332129 | Zhafira Aulia Descha Arianto | Project Manager & Technical Writer |

---

## BAB 1 — PENDAHULUAN

### 1.1 Latar Belakang Masalah
Institusi pendidikan mandiri pada tingkat usia dini (seperti child care, PAUD, dan TK) seringkali bergantung pada pendanaan kolektif dari yayasan, wali murid, atau donatur eksternal untuk pengembangan fasilitas. Namun, kerap muncul keraguan (*trust issue*) dari para donatur mengenai transparansi aliran dana masuk dan keluar. Sistem pencatatan konvensional terpusat (*centralized database*) sangat rentan terhadap manipulasi atau kelalaian administratif, di mana data bisa diubah sepihak tanpa jejak audit yang jelas. Kurangnya transparansi ini sering kali menghambat partisipasi donatur potensial yang ingin berkontribusi namun ragu akan integritas pengelolaan dana.

### 1.2 Rumusan Masalah
1. Bagaimana merancang sistem donasi yang transparan dan dapat diverifikasi oleh publik secara *real-time* untuk institusi pendidikan usia dini?
2. Bagaimana mengimplementasikan teknologi blockchain untuk mencegah manipulasi data histori donasi dan pencairan dana?

### 1.3 Tujuan Proyek
1. Mengembangkan purwarupa (*prototype*) sistem donasi berbasis *smart contract* di jaringan Ethereum yang mencatat aliran dana secara kekal (*immutable*).
2. Menyediakan antarmuka web berbasis React.js yang memudahkan donatur untuk mengirimkan donasi (ETH) dan memantau saldo institusi secara transparan.

### 1.4 Ruang Lingkup dan Batasan
- **Platform:** *Smart contract* menggunakan bahasa Solidity (v0.8.x) pada Testnet Sepolia.
- **Frontend:** Menggunakan *library* **React.js** untuk manajemen *state* dan interaksi pengguna.
- **Transaksi:** Terbatas pada mata uang *native* ETH (Testnet), belum mencakup token ERC-20 atau konversi fiat.
- **Fungsionalitas:** Berfokus pada alur penerimaan donasi, verifikasi saldo publik, dan kontrol penarikan dana oleh pemilik kontrak (*owner*).

---

## BAB 2 — TINJAUAN PUSTAKA

### 2.1 Landasan Teori dan Referensi Utama
Penelitian ini mengacu pada lima literatur utama yang mendasari implementasi blockchain dalam sektor filantropi. **Ahmed et al. (2023)** menekankan bahwa *Decentralized Philanthropic Charity* mampu menciptakan ekosistem sosial yang lebih baik melalui transparansi radikal. Prinsip ini didukung oleh **Wu & Zhu (2020)** yang merancang sistem layanan donasi terpercaya menggunakan teknologi terdesentralisasi, terutama untuk situasi krisis seperti pandemi. Secara teknis, **Xu et al. (2020)** menjelaskan *framework* berkelanjutan untuk dukungan finansial organisasi amal berbasis blockchain untuk melindungi integritas dan pelacakan dana. Di level lokal, **Rizky & Dirgahayu (2025)** menggarisbawahi bahwa *crowdfunding* berbasis blockchain dapat meningkatkan kepercayaan publik secara signifikan di Indonesia melalui akuntabilitas yang terverifikasi publik. Terakhir, implementasi aplikasi donasi terdesentralisasi yang dirancang oleh **Mattew & Suwarno (2022)** memberikan kerangka kerja praktis bagi pengembangan *smart contract* yang aman.

### 2.2 Kriptografi: Hash SHA-256 dan Digital Signature
Integritas data dalam EduFund Chain dijamin melalui dua pilar kriptografi utama:
1.  **Hash SHA-256 (Secure Hash Algorithm):** Setiap blok data dalam blockchain diproses menggunakan fungsi hash satu arah SHA-256. Algoritma ini mengubah input data donasi menjadi string unik sepanjang 256-bit. Sifatnya yang *collision-resistant* memastikan bahwa perubahan sekecil apa pun pada data transaksi akan menghasilkan nilai hash yang berbeda, sehingga manipulasi data dapat dideteksi secara instan.
2.  **Digital Signature (ECDSA):** Untuk menjamin keaslian pengirim, sistem menggunakan *Elliptic Curve Digital Signature Algorithm*. Donatur menandatangani transaksi menggunakan *Private Key*, yang kemudian divalidasi oleh jaringan menggunakan *Public Key*. Hal ini memastikan bahwa hanya pemilik dana yang sah yang dapat mengotorisasi pengiriman donasi.

### 2.3 Mekanisme Konsensus: Proof of Work vs Proof of Stake
Sistem blockchain memerlukan mekanisme konsensus untuk menyepakati validitas transaksi:
-   **Proof of Work (PoW):** Mekanisme awal yang digunakan Bitcoin, di mana penambang memecahkan teka-teki matematika yang mengonsumsi energi sangat besar.
-   **Proof of Stake (PoS):** Mekanisme yang digunakan Ethereum saat ini pasca peristiwa **"The Merge" (2022)**. Dalam PoS, keamanan jaringan dijamin oleh *stakers*.
**Relevansi bagi Proyek:** EduFund Chain memilih Ethereum (PoS) karena konsumsi energinya 99% lebih rendah dibandingkan PoW, menjadikannya infrastruktur yang ramah lingkungan dan efisien untuk institusi pendidikan lokal.

---

## BAB 3 — ANALISIS STUDI KASUS

### 3.1 Identifikasi Masalah Utama
Berdasarkan observasi pada sistem donasi konvensional, ditemukan masalah kritis:
1.  **Ketidakterlacakan Saldo:** Laporan statis tidak mencerminkan saldo kas secara *real-time*.
2.  **Risiko Manipulasi:** Database terpusat rentan terhadap pengubahan histori tanpa jejak audit.
3.  **Ketergantungan Birokrasi:** Verifikasi dana seringkali lambat karena melibatkan banyak perantara manual.

### 3.2 Justifikasi Penggunaan Blockchain
Blockchain menyelesaikan masalah *trust*. Dalam database biasa, admin memiliki kuasa penuh untuk menghapus data. Dengan *smart contract* Ethereum, setiap transaksi donasi tercatat secara **permanen (immutable)**. Transparansi publik memungkinkan setiap wali murid memverifikasi dana melalui *block explorer* secara mandiri, yang menjadi inti kekuatan proyek EduFund Chain dalam membangun kepercayaan.

### 3.3 Studi Banding: Platform Binance Charity
Implementasi sistem donasi berbasis blockchain telah sukses diterapkan oleh **Binance Charity**. Platform ini menggunakan model Web3 untuk memastikan 100% donasi langsung disalurkan tanpa potongan biaya tersembunyi. Keunggulan teknisnya terletak pada penggunaan *smart contract* untuk mencatat setiap tahapan distribusi secara transparan. Hasilnya, Binance Charity berhasil meminimalisir risiko korupsi dan meningkatkan volume donasi global. **EduFund Chain mengadopsi prinsip transparansi end-to-end yang sama**, namun disesuaikan untuk skala lokal: setiap rupiah yang didonasikan akan dipetakan langsung ke dompet institusi melalui kontrak pintar yang dapat diaudit publik kapan pun.

---

## BAB 4 — RANCANGAN SISTEM

### 4.1 Arsitektur Sistem (React.js + Ethereum)
Sistem menggunakan pendekatan hybrid: **Off-chain** (React.js) dan **On-chain** (Solidity).

**(Catatan: Masukkan Diagram Arsitektur Mermaid di sini setelah di-render menjadi gambar)**

### 4.2 Alur Data Sistem (Data Flow)
1.  **Input Data:** Donatur memasukkan nominal pada antarmuka React.js.
2.  **Request Signature:** React mengirimkan payload ke MetaMask untuk meminta tanda tangan digital (ECDSA).
3.  **Broadcast Transaksi:** Transaksi dikirim ke jaringan Sepolia untuk divalidasi oleh validator PoS.
4.  **Smart Contract Execution:** Kontrak pintar mengeksekusi fungsi `donate()`, memperbarui variabel saldo di blockchain.
5.  **Event Logging:** Blockchain memancarkan event `DonationReceived`.
6.  **Update UI:** React menangkap event tersebut dan memperbarui tabel riwayat secara *real-time*.

### 4.3 Daftar Fungsi dan Komponen Smart Contract

**Tabel 4.3.1 Fungsi Utama (Core Functions)**
| Nama Fungsi | Mutability | Visibility | Parameter | Deskripsi |
| :--- | :--- | :--- | :--- | :--- |
| `donate()` | **Payable** | Public | `string _message` | Menerima donasi ETH beserta pesan dari donatur dan mengupdate variabel state saldo global. |
| `getBalance()` | **View** | Public | - | Mengambil total saldo yang tersimpan di dalam smart contract secara real-time. |
| `getDonorCount()`| **View** | Public | - | Mengembalikan jumlah donatur unik yang pernah berpartisipasi dalam penggalangan dana. |
| `withdrawFunds()` | **Non-payable** | Public | `uint256 _amount` | Mentransfer dana dari kontrak ke dompet yayasan menggunakan standar keamanan `.call()`. |

**Tabel 4.3.2 Komponen Keamanan dan Logging**
| Nama Komponen | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `donorBalances` | **Mapping** | Melacak total kontribusi yang telah diberikan oleh setiap alamat dompet donatur secara individual. |
| `onlyOwner` | **Modifier** | Membatasi akses fungsi administratif agar hanya bisa dijalankan oleh administrator (Owner). |
| `DonationReceived` | **Event** | Mencatat log donatur, nominal, pesan, dan timestamp ke blockchain untuk transparansi. |
| `FundsWithdrawn` | **Event** | Mencatat riwayat penarikan dana oleh pihak yayasan untuk audit publik. |

> **Catatan Desain:** Variabel `totalDonations` dirancang sebagai metrik akumulasi historis (Total Impact) dan sengaja tidak dikurangi saat penarikan dana dilakukan. Hal ini bertujuan untuk memberikan transparansi mengenai total volume dana yang pernah dikelola institusi. Untuk pengecekan saldo aktif (*liquid balance*), sistem menggunakan fungsi `getBalance()`.

### 4.4 Sketsa Kode (Solidity Skeleton)
Berikut adalah kerangka kode *Smart Contract* EduFund yang telah mengadopsi standar keamanan terbaru, optimasi gas pada jalur penerimaan langsung, dan fitur transparansi pesan donatur:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract EduFund {
    address public owner;
    uint256 public totalDonations;
    uint256 public donorCount;
    
    mapping(address => uint256) public donorBalances;
    mapping(address => bool) private hasDonated;

    event DonationReceived(address indexed donor, uint256 amount, string message, uint256 timestamp);
    event FundsWithdrawn(address indexed owner, uint256 amount, uint256 timestamp);

    modifier onlyOwner() {
        require(msg.sender == owner, "Akses Ditolak: Hanya admin yayasan"); _;
    }

    constructor() { owner = msg.sender; }

    function donate(string memory _message) public payable {
        require(msg.value > 0, "Donasi harus > 0");
        totalDonations += msg.value;
        donorBalances[msg.sender] += msg.value;
        
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            donorCount++;
        }
        emit DonationReceived(msg.sender, msg.value, _message, block.timestamp);
    }

    function getBalance() public view returns (uint256) { return address(this).balance; }
    
    function getDonorCount() public view returns (uint256) { return donorCount; }

    function withdrawFunds(uint256 _amount) public onlyOwner {
        require(_amount <= address(this).balance, "Saldo tidak mencukupi");
        (bool success, ) = payable(owner).call{value: _amount}("");
        require(success, "Transfer gagal");
        emit FundsWithdrawn(owner, _amount, block.timestamp);
    }
    
    receive() external payable {
        totalDonations += msg.value;
        donorBalances[msg.sender] += msg.value;
        if (!hasDonated[msg.sender]) {
            hasDonated[msg.sender] = true;
            donorCount++;
        }
        emit DonationReceived(msg.sender, msg.value, "Direct Transfer", block.timestamp);
    }
}
```

### 4.5 Sketsa Antarmuka (UI Wireframe Layout)
Antarmuka didesain menggunakan komponen React untuk memastikan reaktivitas tinggi dan kemudahan penggunaan bagi wali murid dan donatur:

| Bagian | Komponen Visual & Fungsi |
| :--- | :--- |
| **Top Bar** | Logo EduFund | Button [Connect Wallet] | Status [Sepolia Testnet] |
| **Hero Card** | Judul Proyek | Display "Total Dana Terkumpul" (Update otomatis dari Smart Contract) |
| **Donation Box** | Input Field [Nominal ETH] | Button [Donasi Sekarang] -> Memicu Pop-up Konfirmasi MetaMask |
| **History Section** | Tabel: [Wallet Address] | [Jumlah ETH] | [Waktu] | [Link Transaksi Etherscan] |

---

## DAFTAR PUSTAKA

Ahmed, I., Fumimoto, K., Nakano, T., & Tran, T. H. (2023). Blockchain-Empowered Decentralized Philanthropic Charity for Social Good. *Sustainability*, 16(1), 210. DOI: [https://doi.org/10.3390/su16010210](https://doi.org/10.3390/su16010210)

Wu, H., & Zhu, X. (2020). Developing a reliable service system of charity donation during the Covid-19 outbreak. *IEEE Access*, 8, 154848-154860. DOI: [https://doi.org/10.1109/ACCESS.2020.3018287](https://doi.org/10.1109/ACCESS.2020.3018287)

Xu, L., Xu, C., Wang, Z., & Dai, F. (2020). A sustainable blockchain framework for the financial support of charitable organizations. *IEEE Access*, 8, 117624-117635. DOI: [https://doi.org/10.1109/ACCESS.2020.3004641](https://doi.org/10.1109/ACCESS.2020.3004641)

Mattew, A., & Suwarno, M. A. (2022). Rancang Bangun Aplikasi Donasi Terdesentralisasi Berbasis Blockchain. *Jurnal IKRAITH-INFORMATIKA*, 7(2). DOI: [https://doi.org/10.37817/ikraith-informatika.v7i2.2247](https://doi.org/10.37817/ikraith-informatika.v7i2.2247)

Rizky, M., & Dirgahayu, T. (2025). Blockchain for Philanthropic Crowdfunding in Indonesia: Enhancing Transparency, Accountability, and Public Trust. *JUITA: Jurnal Informatika*, 13(3). DOI: [https://doi.org/10.30595/juita.v13i3.27342](https://doi.org/10.30595/juita.v13i3.27342)

---
**PANDUAN EXPORT KE WORD:**
1. Copy seluruh teks di atas.
2. Paste ke Microsoft Word menggunakan opsi **"Merge Formatting"** atau **"Keep Text Only"**.
3. Gunakan fitur **"Styles"** di Word (Heading 1 untuk BAB, Heading 2 untuk Sub-bab).
4. Gunakan Font **Arial 11pt** atau **Times New Roman 12pt** dengan spasi **1.15**.
5. Render diagram Mermaid di *mermaid.live* dan tempelkan sebagai gambar di Bab 4.1.
