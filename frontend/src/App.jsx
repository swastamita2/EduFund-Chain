import React, { useState } from "react";
import { useBlockchain } from "./hooks/useBlockchain";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { ImpactSection } from "./components/ImpactSection";
import { HistorySection } from "./components/HistorySection";
import { TransparencyExplainer } from "./components/TransparencyExplainer";
import { AdminDashboard } from "./components/AdminDashboard";
import { Footer } from "./components/Footer";
import { ToastContainer } from "./components/ToastNotification";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const blockchain = useBlockchain();

  const {
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
    errorMsg,
    txHash,
    history,
    withdrawAmount,
    setWithdrawAmount,
    withdrawStatus,
    withdrawError,
    withdrawTxHash,
    handleWithdraw,
    isWithdrawing,
    handleTogglePause,
    pauseStatus,
    pauseError,
    ethToIdr,
    isAdminMode,
    setIsAdminMode,
    idrEstimate,
    balanceDisplay,
    donorDisplay,
    isLoading,
    isOwner,
    shortAddr,
    formatEth,
    formatTime,
    connectWallet,
    switchToSepolia,
    handleDonate,
    toasts,
    dismissToast,
  } = blockchain;

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* NAVIGATION BAR */}
      <Navbar
        account={account}
        network={network}
        isWrongNetwork={isWrongNetwork}
        isOwner={isOwner}
        isAdminMode={isAdminMode}
        setIsAdminMode={setIsAdminMode}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        connectWallet={connectWallet}
        switchToSepolia={switchToSepolia}
        shortAddr={shortAddr}
      />

      {/* CONDITIONAL MAIN VIEW (CLEAN ROUTER) */}
      {isAdminMode && isOwner ? (
        <AdminDashboard
          setIsAdminMode={setIsAdminMode}
          balanceDisplay={balanceDisplay}
          balance={balance}
          ethToIdr={ethToIdr}
          donorDisplay={donorDisplay}
          isPaused={isPaused}
          shortAddr={shortAddr}
          account={account}
          withdrawAmount={withdrawAmount}
          setWithdrawAmount={setWithdrawAmount}
          isWithdrawing={isWithdrawing}
          handleWithdraw={handleWithdraw}
          withdrawStatus={withdrawStatus}
          withdrawError={withdrawError}
          withdrawTxHash={withdrawTxHash}
          handleTogglePause={handleTogglePause}
          pauseStatus={pauseStatus}
          pauseError={pauseError}
          ownerAddress={ownerAddress}
          network={network}
        />
      ) : (
        <>
          {/* HERO SECTION / DONATION FORM */}
          <HeroSection
            amount={amount}
            setAmount={setAmount}
            message={message}
            setMessage={setMessage}
            idrEstimate={idrEstimate}
            isLoading={isLoading}
            isWrongNetwork={isWrongNetwork}
            switchToSepolia={switchToSepolia}
            handleDonate={handleDonate}
            status={status}
            errorMsg={errorMsg}
            txHash={txHash}
          />

          {/* IMPACT CARDS */}
          <ImpactSection
            balanceDisplay={balanceDisplay}
            donorDisplay={donorDisplay}
          />

          {/* ON-CHAIN TRANSACTION HISTORY */}
          <HistorySection
            history={history}
            shortAddr={shortAddr}
            formatEth={formatEth}
            formatTime={formatTime}
          />

          {/* BLOCKCHAIN EDUCATIONAL EXPLAINER */}
          <TransparencyExplainer />
        </>
      )}

      {/* FOOTER */}
      <Footer />
      
      {/* GLOBAL TOAST NOTIFICATIONS */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
