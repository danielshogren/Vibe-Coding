"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "@/app/providers/ThemeProvider";

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-1.5 rounded-md text-ink-faint hover:text-ink-secondary hover:bg-surface-hover transition-colors duration-200"
        aria-label="Settings"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
          />
        </svg>
      </button>

      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-surface-card rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-edge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold text-ink mb-1">
                Settings
              </h3>
              <p className="text-xs text-ink-muted mb-5">Appearance</p>

              <div className="flex gap-3 w-full mb-6">
                {/* Metropolis (Light) */}
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === "light"
                      ? "border-primary ring-2 ring-primary/30 bg-surface-hover"
                      : "border-edge hover:border-edge-strong bg-surface-card"
                  }`}
                >
                  {/* Sun icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-amber-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    />
                  </svg>
                  {/* Color preview */}
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#F7F3EB" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#2563EB" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#D97706" }} />
                  </div>
                  <span className="text-sm font-medium text-ink">Metropolis</span>
                </button>

                {/* Bond (Dark) */}
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === "dark"
                      ? "border-primary ring-2 ring-primary/30 bg-surface-hover"
                      : "border-edge hover:border-edge-strong bg-surface-card"
                  }`}
                >
                  {/* Moon icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6 text-blue-400"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
                    />
                  </svg>
                  {/* Color preview */}
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#141824" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#5B8DC6" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#C9A84C" }} />
                  </div>
                  <span className="text-sm font-medium text-ink">Bond</span>
                </button>

                {/* Atomic (Amber Plasma) */}
                <button
                  type="button"
                  onClick={() => setTheme("atomic")}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                    theme === "atomic"
                      ? "border-primary ring-2 ring-primary/30 bg-surface-hover"
                      : "border-edge hover:border-edge-strong bg-surface-card"
                  }`}
                >
                  {/* Terminal/monitor icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                    style={{ color: "#FF930F" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z"
                    />
                  </svg>
                  {/* Color preview */}
                  <div className="flex gap-1">
                    <span className="w-3 h-3 rounded-full" style={{ background: "#0D0A00" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#FF930F" }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: "#3D2B00" }} />
                  </div>
                  <span className="text-sm font-medium text-ink">Atomic</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-ink-secondary bg-surface-card border border-edge rounded-lg hover:bg-surface-hover transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
