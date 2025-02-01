"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useHasMounted } from "@/utils/customHook";
import { useTrackContext } from "@/lib/track.wrapper";

function Footer() {
  const hasMounted = useHasMounted();

  const { track, setTrack } = useTrackContext() as ITrackContext;

  const player = React.useRef<AudioPlayer>(null);

  React.useEffect(() => {
    if (track?.isPlaying) player.current?.audio.current?.play();
    if (!track?.isPlaying) player.current?.audio.current?.pause();
  }, [track]);

  if (!hasMounted) return <></>;

  return (
    <AppBar
      position="fixed"
      color="primary"
      sx={{
        top: "auto",
        bottom: 0,
        background: "#f2f2f2",
        ".author": {
          color: "gray",
        },
        ".track-title": {
          color: "black",
        },
      }}
    >
      <Toolbar>
        <Container
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 6,
            ".rhap_main": { gap: "30px" },
          }}
        >
          <AudioPlayer
            layout="horizontal-reverse"
            style={{
              boxShadow: "none",
              flex: 6,
              padding: 20,
              background: "#f2f2f2",
            }}
            src={
              track?.trackUrl
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${track.trackUrl}`
                : ""
            }
            onPlay={(e) => {
              if (track)
                setTrack({
                  ...track,
                  isPlaying: true,
                });
            }}
            autoPlayAfterSrcChange={false}
            onPause={() => {
              if (track)
                setTrack({
                  ...track,
                  isPlaying: false,
                });
            }}
            ref={player}
            onSeeked={(e) => {
              if (track)
                setTrack({
                  ...track,
                  time: player.current?.audio.current?.currentTime,
                });
            }}
            // other props here
          />
          <Box
            sx={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div className="author">{track?.title ?? "N/A"}</div>
            <div className="track-title">{track?.description ?? "N/A"}</div>
          </Box>
        </Container>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;
