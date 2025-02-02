"use client";

import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { useTrackContext } from "@/lib/track.wrapper";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { useRouter } from "next/navigation";

interface IProps {
  track: ITrackTop;

  handlePrev: (v: string) => void;

  handleNext: (v: string) => void;
}

export default function MediaCard(props: IProps) {
  const { track: currentTrack, setTrack } = useTrackContext() as ITrackContext;
  const { track, handlePrev, handleNext } = props;

  const theme = useTheme();
  const router = useRouter();

  return (
    <Card
      sx={{
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
      }}
      onClick={() => {
        router.push(
          `/track/${track._id}?audio=${track.trackUrl}&id=${track._id}`
        );
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {track.title}
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            {track.description}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <IconButton
            aria-label="previous"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev(track._id);
            }}
          >
            {theme.direction === "rtl" ? (
              <SkipNextIcon />
            ) : (
              <SkipPreviousIcon />
            )}
          </IconButton>
          {currentTrack?.isPlaying && track._id === currentTrack._id ? (
            <IconButton
              aria-label="pause"
              onClick={(e) => {
                e.stopPropagation();
                setTrack({ ...track, isPlaying: false });
              }}
            >
              <PauseRoundedIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
          ) : (
            <IconButton
              aria-label="play"
              onClick={(e) => {
                e.stopPropagation();
                setTrack({ ...track, isPlaying: true });
              }}
            >
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
          )}

          <IconButton
            aria-label="next"
            onClick={(e) => {
              e.stopPropagation();
              handleNext(track._id);
            }}
          >
            {theme.direction === "rtl" ? (
              <SkipPreviousIcon />
            ) : (
              <SkipNextIcon />
            )}
          </IconButton>
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
        alt="Live from space album cover"
      />
    </Card>
  );
}
