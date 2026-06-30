# EduFund Chain 

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Ethereum Sepolia](https://img.shields.io/badge/Network-Sepolia_Testnet-627EEA.svg)](https://sepolia.etherscan.io/)
[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB.svg)](https://reactjs.org/)

## 📖 Deskripsi Proyek
**EduFund Chain** adalah sebuah *Decentralized Application* (dApp) inovatif yang dirancang untuk merevolusi standar transparansi dan akuntabilitas dalam pengelolaan dana donasi publik, khususnya bagi pengembangan institusi Pendidikan Anak Usia Dini (PAUD).

Menjawab tantangan kurangnya transparansi pada platform penggalangan dana terpusat (*centralized*), EduFund Chain memanfaatkan ketangguhan teknologi **Smart Contract** di atas jaringan blockchain Ethereum. Sistem ini memastikan setiap kontribusi yang masuk tidak hanya tercatat secara permanen (*immutable*), tetapi juga dapat diverifikasi secara independen oleh publik kapan saja melalui *block explorer* tanpa adanya perantara (pihak ketiga).

### ✨ Fitur Utama
* **100% On-Chain Transparency:** Seluruh riwayat transaksi (wallet, jumlah ETH, dan pesan donatur) disimpan di dalam blockchain secara publik.
* **Real-time Event Synchronization:** Frontend tersinkronisasi langsung dengan jaringan Ethereum, memunculkan notifikasi dan rekam jejak seketika (*live*) saat donasi berhasil divalidasi oleh *miner*.
* **Premium UI/UX Experience:** Antarmuka responsif yang dibangun menggunakan pendekatan desain Web3 modern, mengadopsi estetika *Glassmorphism*, *Parallax Scrolling*, dan mikro-interaksi menggunakan *Framer Motion*.
* **Secure Admin Dashboard:** Portal manajemen tingkat tinggi (*owner-only*) untuk penarikan dana ke institusi dan kendali darurat (*emergency pause/unpause*).
* **Live Fiat Conversion:** Integrasi *price feed API* (CoinGecko) untuk menampilkan taksiran nilai kontribusi kripto ke mata uang lokal (Rupiah/IDR) secara *real-time*.

## 🛠️ Arsitektur & Tech Stack
Proyek ini mengimplementasikan pemisahan tugas (*separation of concerns*) yang ketat antara lapisan eksekusi bisnis dan antarmuka visual.

* **Smart Contract Layer:** Ditulis murni dalam bahasa `Solidity v0.8.18`. Mematuhi standar keamanan Web3 (termasuk *ReentrancyGuard* & *Checks-Effects-Interactions pattern*). *Deployed* pada jaringan **Ethereum Sepolia Testnet**.
* **Frontend Layer:** Dibangun dengan **React 19** & **Vite**. Desain di-styling sepenuhnya menggunakan **Tailwind CSS v4** dengan animasi dari **Framer Motion**.
* **Web3 Bridge:** Komunikasi *client-to-node* menggunakan **Ethers.js v6** dan injeksi provider via **MetaMask**.

## 📂 Struktur Repositori Utama
* `contracts/`: Menampung seluruh kode sumber logika *Smart Contract* on-chain.
* `frontend/`: Pusat direktori aplikasi klien berbasis React (berisi UI Components, Hooks abstraksi blockchain, dan *assets* visual).
* `docs/`: Ruang repositori untuk dokumen riset mendalam, ulasan literatur perbandingan arsitektur *Distributed Ledger Technology* (DLT) dengan basis data tradisional.

## 👨‍💻 Tim Pengembang (Kelompok 7 - Kelas A)
Proyek ini diwujudkan melalui kolaborasi spesialistik dengan pembagian peran yang fokus pada setiap pilar utama pembangunan dApp:

| Nama Pengembang | NIM | Peran Utama | Fokus Implementasi Sistem |
| :--- | :--- | :--- | :--- |
| **Achmad Sapta Megan Nugroho** | 202332119 | Frontend Architect & Web3 Integration | Membangun struktur *Clean Architecture* React, integrasi RPC via Ethers.js, *state management*, serta merancang UX animasi interaktif. |
| **Lulu El Maknun** | 202332124 | Researcher & Literature Review | Melakukan riset komparasi teknis arsitektur *Blockchain Database*, serta menyusun ringkasan publikasi jurnal akademik. |
| **Muhammad Kivlan Kusuma Bakti** | 202332128 | Smart Contract Developer | Merancang arsitektur Solidity (`EduFund.sol`), mengoptimasi algoritma pemakaian *Gas limit*, dan menguji mitigasi keamanan celah *Reentrancy*. |
| **Zhafira Aulia Descha Arianto** | 202332129 | Project Manager & Technical Writer | Menjaga stabilitas siklus rilis *Software Development Life Cycle* (SDLC), orkestrasi integrasi komponen, serta menyusun dokumentasi struktural proyek. |

## 📜 Lisensi
Kode sumber dalam repositori ini dirilis secara bebas di bawah [MIT License](LICENSE). Hal ini mendorong komunitas *open-source* untuk mengaudisi, mengembangkan ulang, maupun menjadikannya sebagai referensi bagi pengembangan inisiatif sosial berbasis blockchain di masa depan.
