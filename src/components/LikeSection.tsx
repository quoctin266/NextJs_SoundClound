"use client";
import { Chip, Grid } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import React from "react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/fetchWrapper";
import { useSession } from "next-auth/react";

interface IProps {
  track: ILikeTrack | null;

  likedTracks: ILikeTrack[];
}

function LikeSection(props: IProps) {
  const { track, likedTracks } = props;

  const router = useRouter();
  const { data: session } = useSession();

  const handleClickLike = async () => {
    if (session && track) {
      const quantity = likedTracks.find((item) => item._id === track._id)
        ? -1
        : 1;

      const res = await sendRequest<IBackendRes<{ d: string }>>({
        method: "POST",
        url: `api/v1/likes`,
        body: {
          track: track._id,
          quantity,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (res.data) {
        router.refresh();
      }
    }
  };

  return (
    <Grid container justifyContent={"space-between"} mt={3}>
      <Grid item>
        <Chip
          icon={<FavoriteRoundedIcon />}
          label="Like"
          variant="outlined"
          color={
            likedTracks.find((item) => item._id === track?._id)
              ? "error"
              : undefined
          }
          sx={{
            borderRadius: 1,
            cursor: "pointer",
            ":hover": { opacity: 0.5 },
          }}
          onClick={handleClickLike}
        />
      </Grid>

      <Grid item>
        <Chip
          icon={<PlayArrowRoundedIcon color="inherit" />}
          label={track?.countPlay}
          variant="outlined"
          sx={{
            border: "none",
            cursor: "pointer",
            fontSize: "1.2rem",
            color: "gray",
          }}
        />

        <Chip
          icon={<FavoriteRoundedIcon color="inherit" />}
          label={track?.countLike}
          variant="outlined"
          sx={{
            border: "none",
            cursor: "pointer",
            ml: 2,
            fontSize: "1.2rem",
            color: "gray",
          }}
        />
      </Grid>
    </Grid>
  );
}

export default LikeSection;
