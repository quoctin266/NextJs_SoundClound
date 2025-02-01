"use client";

import { Container, Grid } from "@mui/material";
import React from "react";
import MediaCard from "./MediaCard";
import { useTrackContext } from "@/lib/track.wrapper";

interface IProps {
  trackLists: ITrackTop[];
}

function ProfilePlaylist(props: IProps) {
  const { setTrack } = useTrackContext() as ITrackContext;
  const { trackLists } = props;

  const handlePrev = (id: string) => {
    const index = trackLists.findIndex((item) => item._id === id);
    if (index !== -1) {
      if (index === 0) {
        setTrack({ ...trackLists[trackLists.length - 1], isPlaying: true });
      } else setTrack({ ...trackLists[index - 1], isPlaying: true });
    }
  };

  const handleNext = (id: string) => {
    const index = trackLists.findIndex((item) => item._id === id);
    if (index !== -1) {
      if (index === trackLists.length - 1) {
        setTrack({ ...trackLists[0], isPlaying: true });
      } else setTrack({ ...trackLists[index + 1], isPlaying: true });
    }
  };

  return (
    <Container>
      <Grid container py={6} spacing={6}>
        {trackLists.map((item) => {
          return (
            <Grid item xs={12} md={6} key={item._id}>
              <MediaCard
                track={item}
                handlePrev={handlePrev}
                handleNext={handleNext}
              />
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}

export default ProfilePlaylist;
