export type EmbedInfo = {
  provider: "youtube" | "vimeo";
  embedUrl: string;
};

export function getEmbedInfo(url: string): EmbedInfo | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname === "/watch") {
        const id = parsed.searchParams.get("v");
        if (id) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
      }
      const embedMatch = parsed.pathname.match(/^\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${embedMatch[1]}` };
    }

    if (host === "youtu.be") {
      const id = parsed.pathname.slice(1);
      if (id) return { provider: "youtube", embedUrl: `https://www.youtube.com/embed/${id}` };
    }

    // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
    if (host === "vimeo.com") {
      const match = parsed.pathname.match(/^\/(\d+)/);
      if (match) return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${match[1]}` };
    }

    if (host === "player.vimeo.com") {
      const match = parsed.pathname.match(/^\/video\/(\d+)/);
      if (match) return { provider: "vimeo", embedUrl: `https://player.vimeo.com/video/${match[1]}` };
    }

    return null;
  } catch {
    return null;
  }
}
