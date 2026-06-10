import React from "react";

export function Footer() {
  return (
    <footer
      id="about"
      className="bg-surface-container-lowest dark:bg-on-background py-12 border-t border-outline-variant dark:border-outline"
    >
      <div className="flex flex-col md:flex-row justify-between items-start w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-gutter">
        <div className="flex flex-col gap-4 max-w-xs">
          <a
            className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed flex items-center gap-2"
            href="#"
          >
            <span
              className="material-symbols-outlined"
              data-weight="fill"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              school
            </span>
            EduFund Chain
          </a>
          <p className="font-body-md text-body-md text-on-surface-variant dark:text-surface-variant">
            © 2024 EduFund Chain. Empowering early learners through transparent
            blockchain giving.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <a
            className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Whitepaper
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Smart Contracts
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
            href="#"
          >
            PAUD Partners
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="font-label-sm text-label-sm text-on-surface-variant dark:text-surface-variant hover:text-secondary dark:hover:text-secondary-fixed transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
