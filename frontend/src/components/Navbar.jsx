import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "impact", label: "Impact" },
  { id: "transparency", label: "Transparency" },
  { id: "about", label: "About" },
];

export function Navbar({
  account,
  network,
  isWrongNetwork,
  isOwner,
  isAdminMode,
  setIsAdminMode,
  isMenuOpen,
  setIsMenuOpen,
  connectWallet,
  switchToSepolia,
  shortAddr,
}) {
  const [activeTab, setActiveTab] = useState("campaigns");

  // Scroll spy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3; // Trigger earlier
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(NAV_ITEMS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="bg-surface/95 backdrop-blur-md shadow-sm top-0 sticky z-50 transition-all duration-300">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 max-w-container-max mx-auto">
        <a
          className="text-title-lg md:text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed flex items-center gap-2 whitespace-nowrap"
          href="#"
        >
          <span
            className="material-symbols-outlined text-[28px]"
            data-weight="fill"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            school
          </span>
          EduFund Chain
        </a>
        <div className="hidden lg:flex items-center gap-2 lg:gap-8">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-1 py-2 font-label-md text-label-md transition-colors ${
                activeTab === item.id 
                  ? "text-primary dark:text-primary-fixed font-bold" 
                  : "text-on-surface-variant dark:text-surface-variant hover:text-primary"
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute left-0 right-0 bottom-0 h-[3px] rounded-t-sm bg-primary dark:bg-primary-fixed"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          {account && (
            <span
              className={`rounded-full px-3 py-1 text-label-sm font-label-sm ${
                isWrongNetwork
                  ? "bg-error-container text-on-error-container"
                  : "bg-surface-container text-on-surface"
              }`}
            >
              {isWrongNetwork ? "Salah Jaringan" : network || "Sepolia"}
            </span>
          )}
          {isOwner && (
            <button
              className="px-6 py-3 rounded-full font-label-md text-label-md bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors flex items-center gap-2 active:scale-95"
              onClick={() => setIsAdminMode((prev) => !prev)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAdminMode ? "home" : "admin_panel_settings"}
              </span>
              {isAdminMode ? "Portal Donatur" : "Dashboard Admin"}
            </button>
          )}
          <button
            className="px-6 py-3 rounded-full font-label-md text-label-md text-primary border border-primary hover:bg-surface-container-low transition-colors active:scale-95"
            onClick={connectWallet}
            type="button"
          >
            {account ? shortAddr(account) : "Connect Wallet"}
          </button>
          {isWrongNetwork ? (
            <button
              className="px-6 py-3 rounded-full font-label-md text-label-md bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed transition-colors"
              onClick={switchToSepolia}
              type="button"
            >
              Ganti Sepolia
            </button>
          ) : (
            !isAdminMode && (
              <a
                className="px-6 py-3 rounded-full font-label-md text-label-md bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-sm ambient-shadow active:scale-95"
                href="#donate"
              >
                Donate Now
              </a>
            )
          )}
        </div>
        <button
          className="md:hidden text-on-surface p-2"
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{isMenuOpen ? "close" : "menu"}</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface/98 backdrop-blur-md px-margin-mobile py-4 flex flex-col gap-3">
          {[{ href: "#campaigns", label: "Campaigns" }, { href: "#impact", label: "Impact" }, { href: "#transparency", label: "Transparency" }, { href: "#about", label: "About" }].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-on-surface font-label-md text-label-md py-2 hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          {isOwner && (
            <button
              className="px-6 py-3 rounded-full font-label-md text-label-md bg-secondary-container text-on-secondary-container flex items-center justify-center gap-2"
              onClick={() => {
                setIsAdminMode((prev) => !prev);
                setIsMenuOpen(false);
              }}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAdminMode ? "home" : "admin_panel_settings"}
              </span>
              {isAdminMode ? "Portal Donatur" : "Dashboard Admin"}
            </button>
          )}
          <button
            className="mt-2 px-6 py-3 rounded-full font-label-md text-label-md bg-primary text-on-primary"
            onClick={() => {
              connectWallet();
              setIsMenuOpen(false);
            }}
            type="button"
          >
            {account ? shortAddr(account) : "Connect Wallet"}
          </button>
        </div>
      )}
    </nav>
  );
}
