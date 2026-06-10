import React from "react";
import { STATUS } from "../constants/blockchain";

export function AdminDashboard({
  setIsAdminMode,
  balanceDisplay,
  balance,
  ethToIdr,
  donorDisplay,
  isPaused,
  shortAddr,
  account,
  withdrawAmount,
  setWithdrawAmount,
  isWithdrawing,
  handleWithdraw,
  withdrawStatus,
  withdrawError,
  withdrawTxHash,
  handleTogglePause,
  pauseStatus,
  pauseError,
  ownerAddress,
  network,
}) {
  return (
    <main className="py-12 bg-surface-container-low min-h-screen">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        {/* Header Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Dashboard Yayasan EduFund
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Workspace khusus pengelola Smart Contract. Transparan, aman, dan langsung.
            </p>
          </div>
          <button
            onClick={() => setIsAdminMode(false)}
            className="px-6 py-3 rounded-full font-label-md text-label-md border-2 border-primary text-primary hover:bg-surface-container transition-all flex items-center gap-2"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Halaman Donatur
          </button>
        </div>

        {/* Quick Cards Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-3 text-primary mb-3">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              <h4 className="font-label-md text-label-md text-on-surface-variant">Saldo Kas Yayasan</h4>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">{balanceDisplay} ETH</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              ≈ Rp {(Number(balance) * ethToIdr).toLocaleString("id-ID")}
            </p>
          </div>
          <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-3 text-secondary mb-3">
              <span className="material-symbols-outlined text-3xl">diversity_3</span>
              <h4 className="font-label-md text-label-md text-on-surface-variant">Partisipan Donatur</h4>
            </div>
            <p className="font-headline-lg text-headline-lg text-on-surface">{donorDisplay} Orang</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Unik & Tercatat on-chain</p>
          </div>
          <div className="bg-surface-container-lowest rounded-[24px] p-6 border border-outline-variant/60 shadow-sm">
            <div className="flex items-center gap-3 text-tertiary mb-3">
              <span className="material-symbols-outlined text-3xl">shield_heart</span>
              <h4 className="font-label-md text-label-md text-on-surface-variant">Status Kontrak</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${isPaused ? 'bg-error animate-pulse' : 'bg-primary'}`} />
              <p className="font-headline-sm text-headline-sm text-on-surface">
                {isPaused ? "Paused (Dijeda)" : "Active (Aktif)"}
              </p>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Kontrol darurat di bawah</p>
          </div>
        </div>

        {/* Admin Action Forms */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdraw Section */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 border border-outline-variant/60 shadow-sm">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Tarik Dana Donasi
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
              Setiap dana yang ditarik akan langsung masuk ke wallet aktif Anda ({shortAddr(account)}).
            </p>
            <div className="space-y-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface mb-2">
                  Jumlah Penarikan (ETH)
                </label>
                <input
                  className="w-full px-4 py-4 rounded-lg border-2 border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-0 transition-colors font-body-md text-body-md text-on-surface placeholder-outline"
                  placeholder="0.5"
                  step="0.001"
                  type="number"
                  value={withdrawAmount}
                  onChange={(event) => {
                    setWithdrawAmount(event.target.value);
                  }}
                  disabled={isWithdrawing}
                />
              </div>
              <button
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-md text-label-md hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                type="button"
                onClick={handleWithdraw}
                disabled={isWithdrawing || !withdrawAmount}
              >
                {isWithdrawing ? (
                  withdrawStatus === STATUS.WAITING_WALLET ? "Konfirmasi di Wallet..." : "Memproses..."
                ) : "Tarik Dana Sekarang"}
              </button>
              {withdrawStatus === STATUS.ERROR && withdrawError && (
                <p className="text-body-sm font-body-sm text-error text-center mt-2">{withdrawError}</p>
              )}
              {withdrawStatus === STATUS.SUCCESS && withdrawTxHash && (
                <p className="text-body-sm font-body-sm text-primary text-center mt-2">
                  Berhasil! Lacak di{" "}
                  <a href={`https://sepolia.etherscan.io/tx/${withdrawTxHash}`} target="_blank" rel="noreferrer" className="underline font-semibold">
                    Etherscan
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Pause & General Controls */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 border border-outline-variant/60 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                Emergency Break (Jeda Kontrak)
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-6">
                Menjeda kontrak akan menghentikan sementara seluruh aktivitas donasi dari donatur demi keamanan.
              </p>
              <div className="space-y-4">
                <button
                  onClick={handleTogglePause}
                  className={`w-full py-4 rounded-xl font-label-md text-label-md transition-colors shadow-sm flex items-center justify-center gap-2 ${
                    isPaused
                      ? "bg-primary text-on-primary hover:bg-primary/90"
                      : "bg-error text-on-error hover:bg-error/90"
                  }`}
                  type="button"
                  disabled={pauseStatus === STATUS.WAITING_WALLET || pauseStatus === STATUS.PENDING}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {isPaused ? "play_arrow" : "pause"}
                  </span>
                  {pauseStatus === STATUS.WAITING_WALLET || pauseStatus === STATUS.PENDING
                    ? "Menunggu Konfirmasi..."
                    : isPaused
                    ? "Aktifkan Kembali Kontrak"
                    : "Jeda Seluruh Donasi"}
                </button>
                {pauseError && (
                  <p className="text-body-sm font-body-sm text-error text-center mt-2">{pauseError}</p>
                )}
              </div>
            </div>

            <div className="border-t border-outline-variant/40 pt-6 mt-6 space-y-2 text-body-sm text-on-surface-variant">
              <div className="flex justify-between">
                <span>Pemilik Kontrak:</span>
                <span className="font-mono text-on-surface font-semibold">{shortAddr(ownerAddress)}</span>
              </div>
              <div className="flex justify-between">
                <span>Jaringan Aktif:</span>
                <span className="text-on-surface font-semibold">{network || "Sepolia"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
