import React from "react";

export function HistorySection({ history, shortAddr, formatEth, formatTime }) {
  return (
    <section id="transparency" className="py-16 bg-surface-container-lowest">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Riwayat Donasi On-Chain
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Data diambil dari event DonationReceived pada smart contract.
          </p>
        </div>
        <div className="rounded-[24px] border border-outline-variant bg-surface-container-lowest overflow-hidden">
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-4 bg-surface-container text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider">
            <span>Wallet</span>
            <span>Jumlah ETH</span>
            <span>Pesan</span>
            <span>Waktu</span>
            <span>Etherscan</span>
          </div>
          <div className="divide-y divide-outline-variant/60">
            {history.length === 0 ? (
              <div className="px-6 py-6 text-center text-body-sm font-body-sm text-on-surface-variant">
                Belum ada transaksi yang tercatat.
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={`${item.txHash}-${item.timestamp}`}
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 px-6 py-4 text-body-sm font-body-sm text-on-surface-variant hover:bg-surface-container/50 transition-colors"
                >
                  <span className="font-mono text-on-surface">
                    {shortAddr(item.donor)}
                  </span>
                  <span className="text-on-surface font-semibold">
                    {formatEth(item.amount)} ETH
                  </span>
                  <span className="text-on-surface italic truncate" title={item.message}>
                    {item.message || <span className="text-outline">—</span>}
                  </span>
                  <span>{formatTime(item.timestamp)}</span>
                  <a
                    className="text-primary hover:underline inline-flex items-center gap-1"
                    href={`https://sepolia.etherscan.io/tx/${item.txHash}`}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Lihat ↗
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
