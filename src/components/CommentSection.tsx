"use client";

import { fetchDefaultImages, sendRequest } from "@/utils/fetchWrapper";
import dayjs from "dayjs";
import { useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useTrackContext } from "@/lib/track.wrapper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Image from "next/image";

dayjs.extend(relativeTime);

interface IProps {
  track: ITrackTop | null;

  comments: IComment[];
}

function CommentSection(props: IProps) {
  const {
    setTrack: setCurrentTrack,
    track: currentTrack,
    wavesurfer,
  } = useTrackContext() as ITrackContext;

  const { track, comments } = props;

  const [newComment, setNewComment] = useState("");

  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!newComment) {
      toast.error("Missing comment");
      return;
    }

    if (track && wavesurfer) {
      const res = await sendRequest<IBackendRes<IComment>>({
        method: "POST",
        url: "api/v1/comments",
        body: {
          content: newComment,
          moment: Math.round(wavesurfer.getCurrentTime()),
          track: track._id,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res.data) {
        setNewComment("");
        router.refresh();
      }
    }
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  return (
    <Grid container pt={5} pb={10} justifyContent={"space-between"}>
      <form
        style={{ width: "100%" }}
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <TextField
          fullWidth
          variant="standard"
          label="Comments"
          sx={{ mb: 4 }}
          value={newComment}
          onChange={(e) => {
            setNewComment(e.target.value);
          }}
        />
      </form>

      <Grid item xs={1.5} textAlign={"center"}>
        {track && (
          <Box width={"100%"} position={"relative"} height={"50%"}>
            <Image
              src={fetchDefaultImages(track.uploader.type)}
              alt="uploader avatar"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
        <div>{track?.uploader.email}</div>
      </Grid>

      <Grid item xs={10}>
        {comments.map((item) => {
          return (
            <Grid key={item._id} container gap={3} alignItems={"center"} mb={4}>
              <Grid item>
                <Avatar src={fetchDefaultImages(item.user.type)} />
              </Grid>

              <Grid container item flex={1} justifyContent={"space-between"}>
                <Grid item sx={{ fontSize: "0.9rem", color: "gray" }}>
                  {item.user.email} at{" "}
                  <Box
                    component={"span"}
                    sx={{
                      cursor: "pointer",
                      ":hover": { textDecoration: "underline" },
                    }}
                    onClick={() => {
                      if (currentTrack)
                        setCurrentTrack({ ...currentTrack, time: item.moment });
                    }}
                  >
                    {formatTime(item.moment)}
                  </Box>
                </Grid>

                <Grid item sx={{ fontSize: "0.9rem", color: "gray" }}>
                  {dayjs(item.createdAt).fromNow()}
                </Grid>

                <Grid container>{item.content}</Grid>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    </Grid>
  );
}

export default CommentSection;
