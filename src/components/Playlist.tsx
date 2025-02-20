"use client";

import styles from "./Playlist.module.scss";
import {
  Button,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddPlayListModal from "./AddPlayList.Modal";
import { useState } from "react";
import AddTrackModal from "./AddTrack.Modal";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useRouter } from "next/navigation";
import { convertSlugUrl } from "@/utils/fetchWrapper";
import { useTrackContext } from "@/lib/track.wrapper";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

interface IProps {
  playlists: IPlaylist[];

  tracks: ITrackTop[];
}

function Playlist(props: IProps) {
  const { playlists, tracks } = props;

  const [openAddPlaylist, setOpenAddPlaylist] = useState(false);
  const [openAddTrack, setOpenAddTrack] = useState(false);

  const { track: currentTrack, setTrack } = useTrackContext() as ITrackContext;

  const router = useRouter();

  return (
    <div className={styles.container}>
      <Grid container alignItems={"center"} justifyContent={"space-between"}>
        <Grid item className={styles.title}>
          Danh sách phát
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddPlaylist(true)}
          >
            Playlist
          </Button>
          <Button
            sx={{ ml: 2 }}
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddTrack(true)}
          >
            Tracks
          </Button>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 2, mb: 4 }} />

      {playlists.map((item) => {
        return (
          <Accordion key={item._id}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
            >
              <Typography
                component="span"
                sx={{ fontSize: "1.2rem", color: "gray" }}
              >
                {item.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              {item.tracks.length === 0 && "No data"}

              <List>
                {item.tracks.map((track) => {
                  return (
                    <ListItem
                      key={track._id}
                      sx={{
                        px: 0,
                        py: 2,
                        borderTop: "1px solid #ccc",
                      }}
                      secondaryAction={
                        currentTrack?.isPlaying &&
                        track._id === currentTrack._id ? (
                          <IconButton
                            aria-label="pause"
                            onClick={(e) => {
                              e.stopPropagation();

                              const trackDetail = tracks.find(
                                (item) => item._id === track._id
                              );

                              if (trackDetail)
                                setTrack({ ...trackDetail, isPlaying: false });
                            }}
                          >
                            <PauseRoundedIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="play"
                            onClick={(e) => {
                              e.stopPropagation();

                              const trackDetail = tracks.find(
                                (item) => item._id === track._id
                              );

                              if (trackDetail)
                                setTrack({ ...trackDetail, isPlaying: true });
                            }}
                          >
                            <PlayArrowIcon />
                          </IconButton>
                        )
                      }
                    >
                      <div
                        className={styles.trackTitle}
                        onClick={() => {
                          router.push(
                            `/track/${convertSlugUrl(track.title)}-${
                              track._id
                            }.html?audio=${track.trackUrl}`
                          );
                        }}
                      >
                        {track.title}
                      </div>
                    </ListItem>
                  );
                })}
              </List>
            </AccordionDetails>
          </Accordion>
        );
      })}

      <AddPlayListModal open={openAddPlaylist} setOpen={setOpenAddPlaylist} />

      <AddTrackModal
        open={openAddTrack}
        setOpen={setOpenAddTrack}
        playlists={playlists}
        tracks={tracks}
      />
    </div>
  );
}

export default Playlist;
