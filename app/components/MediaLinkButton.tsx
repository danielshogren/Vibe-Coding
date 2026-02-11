"use client";

import { useState, useEffect, useTransition } from "react";
import { updateProjectItemField } from "@/app/actions";
import { getEmbedInfo } from "@/lib/embedUtils";

export function MediaLinkButton({
  itemId,
  mediaUrl,
}: {
  itemId: string;
  mediaUrl: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [urlValue, setUrlValue] = useState(mediaUrl);
  const [isPending, startTransition] = useTransition();

  // Sync urlValue when mediaUrl prop changes
  useEffect(() => {
    setUrlValue(mediaUrl);
  }, [mediaUrl]);

  // Close on Escape
  useEffect(() => {
    if (!isModalOpen && !isVideoOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setIsVideoOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isModalOpen, isVideoOpen]);

  function handleSave() {
    const trimmed = urlValue.trim();
    if (!trimmed) return;
    startTransition(async () => {
      await updateProjectItemField(itemId, "mediaUrl", trimmed);
      setIsModalOpen(false);
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await updateProjectItemField(itemId, "mediaUrl", "");
      setIsModalOpen(false);
    });
  }

  const hasLink = mediaUrl !== "";

  return (
    <>
      <div
        className="group/media flex items-center gap-1.5 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {hasLink ? (
          <>
            <button
              type="button"
              onClick={() => {
                const embed = getEmbedInfo(mediaUrl);
                if (embed) {
                  setIsVideoOpen(true);
                } else {
                  window.open(mediaUrl, "_blank", "noopener,noreferrer");
                }
              }}
              className="flex items-center gap-1.5 text-primary hover:text-primary-hover transition-colors duration-200"
              aria-label="Open media link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                {/* Rounded rectangle */}
                <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
                {/* Filled play triangle */}
                <path
                  fill="currentColor"
                  stroke="none"
                  d="M10 8.5v7l5.5-3.5L10 8.5Z"
                />
              </svg>
              <span className="text-xs font-medium">REVIEW</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setUrlValue(mediaUrl);
                setIsModalOpen(true);
              }}
              className="p-0.5 rounded text-ink-faint opacity-0 group-hover/media:opacity-100 hover:text-primary transition-all duration-200"
              aria-label="Edit media link"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                />
              </svg>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => {
              setUrlValue("");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-ink-faint hover:text-ink-muted transition-colors duration-200"
            aria-label="Add media link"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              {/* Rounded rectangle */}
              <rect x="3" y="4" width="18" height="16" rx="3" ry="3" />
              {/* Play triangle outline */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 8.5v7l5.5-3.5L10 8.5Z"
              />
              {/* Small "+" overlay at bottom-right */}
              <circle cx="18" cy="17" r="3.5" fill="currentColor" className="text-surface-card" />
              <path
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                d="M18 15.5v3M16.5 17h3"
              />
            </svg>
            <span className="text-xs font-medium">REVIEW</span>
          </button>
        )}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
          }}
        >
          <div
            className="bg-surface-card rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-edge"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink mb-4">
                {hasLink ? "Edit Media Link" : "Add Media Link"}
              </h3>
              <input
                type="url"
                value={urlValue}
                onChange={(e) => setUrlValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                }}
                placeholder="https://example.com/media"
                autoFocus
                className="w-full px-3 py-2 text-sm border border-edge-strong rounded-lg bg-surface-input text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary mb-6"
              />
              <div className="flex gap-3 w-full">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-ink-secondary bg-surface-card border border-edge rounded-lg hover:bg-surface-hover transition-colors duration-200"
                >
                  Cancel
                </button>
                {hasLink && (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 text-sm font-medium text-danger-text bg-surface-card border border-danger rounded-lg hover:bg-danger-light disabled:opacity-50 transition-colors duration-200"
                  >
                    {isPending ? "Removing..." : "Remove"}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isPending || !urlValue.trim()}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-hover disabled:opacity-50 transition-colors duration-200"
                >
                  {isPending ? "Saving..." : "OK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isVideoOpen && (() => {
        const embed = getEmbedInfo(mediaUrl);
        if (!embed) return null;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsVideoOpen(false);
            }}
          >
            <div
              className="bg-surface-card rounded-2xl shadow-2xl max-w-3xl w-full mx-4 border border-edge overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
                <span className="text-sm text-ink-secondary truncate mr-4">{mediaUrl}</span>
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(false)}
                  className="shrink-0 p-1 rounded-lg text-ink-faint hover:text-ink hover:bg-surface-hover transition-colors duration-200"
                  aria-label="Close video preview"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={embed.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="px-4 py-3 border-t border-edge">
                <a
                  href={mediaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:text-primary-hover transition-colors duration-200"
                >
                  Open in new tab &#8599;
                </a>
              </div>
            </div>
          </div>
        );
      })()}
    </>
  );
}
