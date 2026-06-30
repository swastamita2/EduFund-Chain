import React, { useMemo, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { STATUS } from "../constants/blockchain";

// Target kampanye dalam ETH (sesuaikan dengan kebutuhan)
const CAMPAIGN_TARGET_ETH = 1.0;

/**
 * ProgressBar — Menampilkan progres pengumpulan dana terhadap target kampanye.
 */
function ProgressBar({ balance }) {
  const { percent, isNearGoal, isReached } = useMemo(() => {
    const current = Number.parseFloat(balance) || 0;
    const raw = Math.min((current / CAMPAIGN_TARGET_ETH) * 100, 100);
    return {
      percent: raw,
      isNearGoal: raw >= 80 && raw < 100,
      isReached: raw >= 100,
    };
  }, [balance]);

  const barColor = isReached
    ? "bg-primary"
    : isNearGoal
    ? "bg-secondary"
    : "bg-primary";

  const labelColor = isReached
    ? "text-primary"
    : isNearGoal
    ? "text-secondary"
    : "text-primary";

  return (
    <div className="w-full">
      {/* Label atas */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {isReached ? "🎉 Target Tercapai!" : isNearGoal ? "🔥 Hampir Tercapai!" : "🎯 Progres Kampanye"}
        </span>
        <span className={`font-label-sm text-label-sm font-semibold ${labelColor}`}>
          {percent.toFixed(1)}%
        </span>
      </div>

      {/* Track */}
      <div className="w-full h-2.5 bg-surface-container rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor} ${isReached ? "animate-pulse" : ""}`}
          style={{ width: `${Math.max(percent, 2)}%` }}
        />
      </div>

      {/* Label bawah */}
      <div className="flex justify-between items-center mt-2">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Terkumpul:{" "}
          <span className="font-semibold text-on-surface">
            {(Number.parseFloat(balance) || 0).toFixed(4)} ETH
          </span>
        </span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Target:{" "}
          <span className="font-semibold text-on-surface">
            {CAMPAIGN_TARGET_ETH} ETH
          </span>
        </span>
      </div>
    </div>
  );
}

export function HeroSection({
  amount,
  setAmount,
  message,
  setMessage,
  idrEstimate,
  isLoading,
  isWrongNetwork,
  switchToSepolia,
  handleDonate,
  status,
  setStatus,
  setErrorMsg,
  errorMsg,
  txHash,
  balance,
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  // Parallax effects for the background image
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacityFade = useTransform(scrollYProgress, [0, 1], [0.2, 0]);

  // Stagger variants for the left content
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    },
  };

  return (
    <header ref={ref} id="campaigns" className="relative pt-24 pb-32 overflow-hidden bg-surface-container-low">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          style={{ y: backgroundY, opacity: opacityFade }}
          alt="Hero background of children learning"
          className="w-full h-[120%] object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9CzyuqdMUk4F0bl9PZ5VXL9LUYauwBVUtRlSudyFOZuZdij95Vm2XHVxmeVeY3RN-finE2YvYapWru1VzQDUpfRYWPY_VGm5gUdJ1EQAVl-t1eUi3iJ1-GhtRCdeEcOothL1JjeH2_i2VrL-MrVWYN7p8HjctU8CVeJm0koH1pfIbEQcYE0EZ-aEhB6rGpXDbYNHgckL8kH3t-WC-uOzaNTYdmdWEH9z1Y934AkWSmDa0A3Lj9dS6wIBQw-p50o-ce7qh4U2NHSI"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/90 to-transparent"></div>
      </div>

      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-2 gap-gutter items-center">
        {/* LEFT: Copy + CTA */}
        <motion.div 
          className="flex flex-col gap-6 max-w-xl"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 bg-secondary-container/20 text-on-secondary-container rounded-full w-max">
            <span className="material-symbols-outlined text-[18px]">child_care</span>
            <span className="font-label-sm text-label-sm">Pendidikan Usia Dini (PAUD)</span>
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="font-headline-xl-mobile text-headline-xl-mobile md:font-headline-xl md:text-headline-xl text-on-surface">
            Wujudkan Masa Depan Cerah Melalui Pendidikan Usia Dini
          </motion.h1>
          
          <motion.p variants={itemVariants} className="font-body-lg text-body-lg text-on-surface-variant">
            Bantu anak-anak PAUD mendapatkan fasilitas belajar yang layak melalui
            sistem donasi Ethereum yang transparan dan aman. Setiap kontribusi
            Anda membangun fondasi belajar mereka.
          </motion.p>

          {/* PROGRESS BAR KAMPANYE */}
          <motion.div variants={itemVariants} className="bg-surface-container-lowest/80 backdrop-blur-sm rounded-2xl px-5 py-4 border border-outline-variant/40 shadow-sm hover:shadow-md transition-shadow">
            <ProgressBar balance={balance} />
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mt-2">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm ambient-shadow flex items-center gap-2"
              href="#donate"
            >
              <span>Mulai Berdonasi</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-full font-label-md text-label-md text-primary border-2 border-primary hover:bg-surface-container transition-colors"
              href="#transparency"
            >
              Pelajari Transparansi
            </motion.a>
          </motion.div>
        </motion.div>

        {/* RIGHT: Donation Card */}
        <motion.div
          id="donate"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: "spring", delay: 0.2 }}
          className="glass-card rounded-[24px] p-8 ambient-shadow relative mt-12 md:mt-0 max-w-md ml-auto border border-white"
        >
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-secondary-container rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary-container rounded-full blur-3xl opacity-30"></div>

          <h3 className="font-headline-md text-headline-md text-on-surface mb-1 relative z-10">
            Donasi untuk Pendidikan
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-5 relative z-10">
            Bantu sediakan alat tulis, buku, dan mainan edukatif.
          </p>

          <form
            className="space-y-5 relative z-10"
            onSubmit={(event) => {
              event.preventDefault();
              handleDonate();
            }}
          >
            {/* Input ETH */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Jumlah Donasi (ETH)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <img
                    alt="ETH"
                    className="w-5 h-5 opacity-70"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-s6FC5IzsHwzX7JO-TlTkxzi03h7ljpfzKIudZqnwB64hwQafIDIa7ved6GVYWMeBl_kNWk1DO50ypc8ZH_ZO_ZkGQDNWAT9cGeqmY3cJcCQ55B1mXHPkGQ1xxKd1B5UNHdZ8N65Yuna0xXJGMarBhkabwM4EtZvA7_a7BEoUphGnwQfjBll1UFpbeZzCcs-dEcwDw9MBPQk3PKThBd6P1z9_tTaA6pAZO-WXHiGGybriseZ3jnIMcP8AZfJ90s2Bel46uDR1v_k"
                  />
                </div>
                <input
                  className="w-full pl-12 pr-28 py-4 rounded-lg border-2 border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-0 transition-colors font-body-md text-body-md text-on-surface placeholder-outline"
                  placeholder="0.05"
                  step="0.001"
                  type="number"
                  value={amount}
                  onChange={(event) => {
                    setAmount(event.target.value);
                    if (status === STATUS.ERROR || status === STATUS.SUCCESS) {
                      setStatus(STATUS.IDLE);
                      setErrorMsg("");
                    }
                  }}
                  disabled={isLoading || isWrongNetwork}
                />
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <span className="text-outline font-body-sm text-body-sm">{idrEstimate}</span>
                </div>
              </div>
            </div>

            {/* Preset amounts */}
            <div className="flex gap-2">
              {["0.01", "0.05", "0.1"].map((preset) => (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  key={preset}
                  className="flex-1 py-2 px-3 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors font-label-sm text-label-sm text-on-surface border border-outline-variant"
                  type="button"
                  onClick={() => setAmount(preset)}
                >
                  {preset} ETH
                </motion.button>
              ))}
            </div>

            {/* Pesan Donatur */}
            <div>
              <label className="block font-label-md text-label-md text-on-surface mb-2">
                Pesan Donatur
                <span className="ml-2 text-outline font-body-sm text-body-sm">({(message || "").length}/120)</span>
              </label>
              <input
                className="w-full px-4 py-4 rounded-lg border-2 border-outline-variant bg-surface-container-lowest focus:border-primary focus:ring-0 transition-colors font-body-md text-body-md text-on-surface placeholder-outline"
                placeholder="Dari Alumni 2020"
                type="text"
                maxLength={120}
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                  if (status === STATUS.ERROR || status === STATUS.SUCCESS) {
                    setStatus(STATUS.IDLE);
                    setErrorMsg("");
                  }
                }}
                disabled={isLoading || isWrongNetwork}
              />
            </div>

            {/* Wrong network warning */}
            {isWrongNetwork && (
              <div className="flex items-center justify-between bg-error-container text-on-error-container rounded-lg px-4 py-3">
                <span className="font-body-sm text-body-sm">Gunakan Sepolia Testnet</span>
                <button
                  className="rounded-full bg-secondary-container text-on-secondary-container px-3 py-1 text-label-sm font-label-sm"
                  type="button"
                  onClick={switchToSepolia}
                >
                  Switch
                </button>
              </div>
            )}

            {/* Submit button */}
            <motion.button
              whileHover={(!isLoading && !isWrongNetwork) ? { scale: 1.02 } : {}}
              whileTap={(!isLoading && !isWrongNetwork) ? { scale: 0.98 } : {}}
              className={`w-full py-4 rounded-xl font-label-lg text-label-lg text-on-primary flex justify-center items-center gap-2 transition-colors ${
                isLoading || isWrongNetwork
                  ? "bg-on-surface/12 text-on-surface/38 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 ambient-shadow"
              }`}
              type="submit"
              disabled={isLoading || isWrongNetwork || !amount}
            >
              <span
                className="material-symbols-outlined"
                data-weight="fill"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                favorite
              </span>
              {isLoading
                ? status === STATUS.WAITING_WALLET
                  ? "Menunggu MetaMask…"
                  : "Memproses Transaksi…"
                : "Donasi Sekarang"}
            </motion.button>

            {/* Status messages */}
            {status === STATUS.WAITING_WALLET && (
              <p className="text-center text-body-sm font-body-sm text-on-surface-variant">
                Menunggu persetujuan di MetaMask.
              </p>
            )}
            {status === STATUS.PENDING && (
              <p className="text-center text-body-sm font-body-sm text-on-surface-variant">
                Transaksi sedang diproses di jaringan Sepolia…
              </p>
            )}
          </form>

          {/* Security badge */}
          <div className="mt-4 flex items-center justify-center gap-2 text-outline font-body-sm text-body-sm relative z-10">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Transaksi aman via Smart Contract
          </div>

          {/* Error / Success feedback */}
          {status === STATUS.ERROR && errorMsg && (
            <p className="mt-3 text-body-sm font-body-sm text-error text-center">
              {errorMsg}
            </p>
          )}
          {status === STATUS.SUCCESS && txHash && (
            <div className="mt-3 text-center text-body-sm font-body-sm text-on-surface-variant">
              ✅ Donasi berhasil! Lihat bukti di{" "}
              <a
                className="text-primary hover:underline font-semibold"
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                rel="noreferrer"
                target="_blank"
              >
                Etherscan ↗
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </header>
  );
}
