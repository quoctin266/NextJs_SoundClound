import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: "SoundCloud",
    name: "SoundCloud",
    description: "SoundCloud - Play Music, Audio & New Songs",
    icons: [
      {
        src: "https://salt.tikicdn.com/ts/upload/2f/51/80/5643672027a54bfa593300f53c91c12a.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "https://salt.tikicdn.com/ts/upload/2f/51/80/5643672027a54bfa593300f53c91c12a.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    related_applications: [
      {
        platform: "play",
        url: "https://play.google.com/store/apps/details?id=vn.tiki.app.tikiandroid",
        id: "vn.tiki.app.tikiandroid",
      },
      {
        platform: "itunes",
        url: "https://apps.apple.com/vn/app/tiki-shopping-fast-shipping/id958100553",
      },
      {
        platform: "webapp",
        url: "https://tiki.vn/manifest.json",
      },
    ],
    scope: "/",
    background_color: "#FF5500",
    theme_color: "#FF5500",
  };
}
