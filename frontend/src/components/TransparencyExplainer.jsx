import React from "react";

export function TransparencyExplainer() {
  return (
    <section className="py-20 bg-surface-container-lowest border-y border-outline-variant/30">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
          <div className="space-y-4 pt-8">
            <img
              alt="Children learning"
              className="rounded-[24px] object-cover h-48 w-full ambient-shadow"
              data-alt="A warm, bright image of young children sitting in a circle on a colorful rug in a well-lit early childhood classroom. The aesthetic is clean, soft, and inviting, with natural light pouring in. The mood is joyful and collaborative, highlighting the impact of quality education facilities."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPAQI9Y6F_7TQbXvsoAUgPEdfdMu11-pOy3CT7e__bKx9sFipqRSQodA3d9XjzZbCe0Wu4D4TCy72XAjuuNo28fTpYL1S6YINlOeiBoGXMMPR_unaOBjRxiamYKv7gnAuxAsAKsZVhkLPor-3iiv4XLCEua5yKyRHtOgM4B37ex5SURuHSONtKglFke6RjDVyvQt_ngPcm2Pj_issLC6Xnwmgky8kJuB9TMibQlVkqZDQuGZ6yCjGBAe_u1PE5ijJbs2RJ1JoYr8k"
            />
            <div className="bg-primary-container p-6 rounded-[24px] text-on-primary-container ambient-shadow">
              <span className="material-symbols-outlined text-3xl mb-2">
                verified_user
              </span>
              <h4 className="font-headline-md text-headline-md">100% Transparan</h4>
            </div>
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container p-6 rounded-[24px] text-on-surface ambient-shadow">
              <span className="material-symbols-outlined text-3xl mb-2 text-primary">
                receipt_long
              </span>
              <h4 className="font-headline-md text-headline-md">Laporan Publik</h4>
            </div>
            <img
              alt="Teacher and child"
              className="rounded-[24px] object-cover h-64 w-full ambient-shadow"
              data-alt="Close up of a teacher gently guiding a toddler's hand as they paint on an easel. The setting is a modern, light-filled classroom with soft wooden furniture and pastel educational materials. The focus is on the nurturing interaction, radiating warmth and safety."
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4ZsBHD46QFrOv4lKLuSdGCmtve6f_gWnS--Igb0UIgUI6Uj8sMrVHz4dT9_z24Zm6MehR3Ake3gTN3aW5ayUCu46dptH93pOdcBv6jTdQ9bLnxUGjuXv7UeHJyhItCQSHCiGXDF6AtyPHJtBWBuUXRSNrB7Mc2BeFo9owrn5Zu-8vLb67yy2-rqs8mBNimJt55Y_kTWL1NgOJHBKph0pPnQyNc2t5bEf9f4rSfIIs1pNk2zdw4QexViuL6Z5MM9Qifs52TFUpygs"
            />
          </div>
        </div>
        <div className="order-1 md:order-2 flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-high rounded-full w-max">
            <span className="material-symbols-outlined text-[18px] text-primary">block</span>
            <span className="font-label-sm text-label-sm text-on-surface">Teknologi Blockchain</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Jejak Kebaikan yang Dapat Dilacak
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Kami menggunakan teknologi Ethereum untuk memastikan setiap Rupiah
            yang Anda donasikan tercatat secara permanen dan publik. Tidak ada
            biaya tersembunyi.
          </p>
          <ul className="space-y-4 mt-2">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">
                  Smart Contract Otomatis
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Dana langsung disalurkan ke dompet sekolah setelah target
                  tercapai.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="material-symbols-outlined text-primary text-sm">check</span>
              </div>
              <div>
                <h4 className="font-label-md text-label-md text-on-surface">
                  Laporan Belanja Terverifikasi
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Sekolah wajib mengunggah bukti pembelian yang diverifikasi
                  komunitas.
                </p>
              </div>
            </li>
          </ul>
          <a
            className="inline-flex items-center gap-2 text-primary font-label-md text-label-md mt-4 hover:underline"
            href="#"
          >
            Lihat Cara Kerjanya
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </div>
    </section>
  );
}
