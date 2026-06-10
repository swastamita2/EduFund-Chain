import React from "react";

export function ImpactSection({ balanceDisplay, donorDisplay }) {
  return (
    <section id="impact" className="py-16 bg-surface">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-12">
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-4">
            Dampak Kebaikan Bersama
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mx-auto">
            Setiap donasi disalurkan langsung untuk kebutuhan operasional PAUD
            yang terverifikasi.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest rounded-[24px] p-8 ambient-shadow text-center flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform border border-surface-container-high">
            <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
              <span
                className="material-symbols-outlined text-4xl"
                data-weight="fill"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                account_balance_wallet
              </span>
            </div>
            <div>
              <h4 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Total Dana Terkumpul
              </h4>
              <p className="font-headline-lg text-headline-lg text-on-surface text-primary">
                {balanceDisplay} ETH
              </p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-[24px] p-8 ambient-shadow text-center flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform border border-surface-container-high">
            <div className="w-16 h-16 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary-container">
              <span
                className="material-symbols-outlined text-4xl"
                data-weight="fill"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                domain
              </span>
            </div>
            <div>
              <h4 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Jumlah Sekolah Terbantu
              </h4>
              <p className="font-headline-lg text-headline-lg text-on-surface text-secondary-container">
                42 PAUD
              </p>
            </div>
          </div>
          <div className="bg-surface-container-lowest rounded-[24px] p-8 ambient-shadow text-center flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform border border-surface-container-high">
            <div className="w-16 h-16 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
              <span
                className="material-symbols-outlined text-4xl"
                data-weight="fill"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                groups
              </span>
            </div>
            <div>
              <h4 className="font-body-sm text-body-sm text-on-surface-variant uppercase tracking-wider mb-1">
                Donatur Peduli
              </h4>
              <p className="font-headline-lg text-headline-lg text-on-surface text-tertiary">
                {donorDisplay}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
