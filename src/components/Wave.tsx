"use client";

import styles from "./Wave.module.scss";
import { drawProgressColor, drawWaveColor } from "@/utils/gradients";
// import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
// import IconButton from "@mui/material/IconButton";
// import Tooltip from "@mui/material/Tooltip";
import { useWavesurfer } from "@wavesurfer/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";
import { fetchDefaultImages, sendRequest } from "@/utils/fetchWrapper";
import { useTrackContext } from "@/lib/track.wrapper";
import Image from "next/image";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";

interface IProps {
  comments: IComment[];

  id: string;
}

const Wave = (props: IProps) => {
  const { comments, id } = props;

  const [duration, setDuration] = useState("0:00");
  const [current, setCurrent] = useState("0:00");
  const [hoverWidth, setHoverWidth] = useState(0);
  const [track, setTrack] = useState<ITrackTop | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const firstViewRef = useRef(true);

  const searchParams = useSearchParams();
  const audioName = searchParams.get("audio");

  const router = useRouter();

  const {
    setTrack: setCurrentTrack,
    track: currentTrack,
    setWavesurfer,
  } = useTrackContext() as ITrackContext;

  const waveColor = useMemo(() => {
    return drawWaveColor();
  }, []);

  const progressColor = useMemo(() => {
    return drawProgressColor();
  }, []);

  const renderFunction = useCallback(
    (channels: (Float32Array | number[])[], ctx: CanvasRenderingContext2D) => {
      const { width, height } = ctx.canvas;
      const barWidth = 3;
      const barGap = 1;

      const barCount = Math.floor(width / (barWidth + barGap));
      const step = Math.floor(channels[0].length / barCount);

      const topPartHeight = height * 0.7; // Define top part height
      const bottomPartHeight = height * 0.3; // Define bottom part height

      ctx.beginPath();

      for (let i = 0; i < barCount; i++) {
        let sumTop = 0;
        let sumBottom = 0;

        for (let j = 0; j < step; j++) {
          const index = i * step + j;
          const topValue = Math.abs(channels[0][index] || 0);
          const bottomValue = Math.abs(channels[1]?.[index] || 0);

          sumTop += topValue;
          sumBottom += bottomValue;
        }

        const avgTop = sumTop / step;
        const avgBottom = sumBottom / step;

        // const barHeight = (avgTop + avgBottom)/2;

        const barHeight = (avgTop + avgBottom) * 1.2;

        // Vertical alignment
        let yTop = topPartHeight - barHeight * topPartHeight;
        let yBottom = topPartHeight + barHeight * bottomPartHeight;

        ctx.rect(
          i * (barWidth + barGap),
          yTop,
          barWidth,
          barHeight * topPartHeight
        );
        ctx.rect(
          i * (barWidth + barGap),
          yBottom - barHeight * bottomPartHeight,
          barWidth,
          barHeight * bottomPartHeight
        );
      }

      ctx.fill();
      ctx.closePath();
    },
    []
  );

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 150,
    waveColor: waveColor,
    progressColor: progressColor,
    barWidth: 3,
    url: `/api?audio=${audioName}`,
    renderFunction: renderFunction,
    // plugins: useMemo(() => [Timeline.create()], []),
  });

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause();
  }, [wavesurfer]);

  const handleIncreaseView = async () => {
    if (track && firstViewRef.current) {
      await sendRequest<IBackendRes<string>>({
        method: "POST",
        url: `api/v1/tracks/increase-view`,
        body: {
          trackId: track._id,
        },
      });

      firstViewRef.current = false;
      router.refresh();
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const calLeft = (moment: number) => {
    if (wavesurfer) {
      const duration = wavesurfer.getDuration();
      const percentage = (moment / duration) * 100;
      return `${percentage}%`;
    }
  };

  useEffect(() => {
    if (wavesurfer) {
      const unSub = wavesurfer.on("click", () => {
        wavesurfer.play();
      });

      const unsubDecode = wavesurfer.on("decode", (duration) =>
        setDuration(formatTime(duration))
      );

      const unsubUpdate = wavesurfer.on("timeupdate", (currentTime) => {
        setCurrent(formatTime(currentTime));
      });

      const unSubSeek = wavesurfer.on("seeking", (currentTime) => {
        if (currentTrack)
          setCurrentTrack({ ...currentTrack, time: currentTime });
      });

      return () => {
        unSub();
        unsubDecode();
        unsubUpdate();
        unSubSeek();
      };
    }
  }, [wavesurfer]);

  useEffect(() => {
    (async () => {
      const res = await sendRequest<IBackendRes<ITrackTop>>({
        method: "GET",
        url: `api/v1/tracks/${id}`,
      });

      if (res.data) {
        setTrack(res.data);
        setCurrentTrack({ ...res.data, isPlaying: false });
      }
    })();
  }, [id]);

  useEffect(() => {
    if (currentTrack && wavesurfer) {
      if (currentTrack.time) wavesurfer.setTime(currentTrack.time);

      if (currentTrack.isPlaying) wavesurfer.play();
      else wavesurfer.pause();
    }
  }, [currentTrack, wavesurfer]);

  useEffect(() => {
    if (wavesurfer) {
      wavesurfer.setMuted(true);
      setWavesurfer(wavesurfer);
    }
  }, [wavesurfer]);

  // useEffect(() => {
  //   if (waveRef.current) {
  //     const wavesurfer = WaveSurfer.create({
  //       container: waveRef.current,
  //       waveColor: "rgb(200, 0, 200)",
  //       progressColor: "rgb(100, 0, 100)",
  //       url: `/api?audio=${audioName}`,
  //     });

  //     wavesurfer.on("click", () => {
  //       wavesurfer.play();
  //     });
  //   }
  // }, []);

  return (
    <div>
      <Grid
        container
        justifyContent={"space-between"}
        p={3}
        sx={{
          background:
            "linear-gradient(135deg, rgb(120, 95, 89) 0%, rgb(34, 34, 37) 100%)",
        }}
      >
        <Grid item xs={9}>
          <Grid container gap={3} height={200}>
            <Grid item>
              <IconButton
                sx={{
                  backgroundColor: "#ff4a00",
                  color: "white",
                  ":hover": { backgroundColor: "#EE772F" },
                }}
                onClick={() => {
                  onPlayPause();

                  handleIncreaseView();

                  if (currentTrack)
                    setCurrentTrack({
                      ...currentTrack,
                      isPlaying: !currentTrack.isPlaying,
                    });
                }}
              >
                {isPlaying ? <PauseRoundedIcon /> : <PlayArrowRoundedIcon />}
              </IconButton>
            </Grid>

            <Grid item>
              <Box
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  px: 1,
                  fontSize: "1.5rem",
                  mb: 2,
                }}
              >
                {track?.title}
              </Box>
              <Box
                component={"span"}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  px: 1,
                  py: 0.5,
                }}
              >
                {track?.description}
              </Box>
            </Grid>
          </Grid>

          <div
            className={styles.waveform}
            ref={containerRef}
            onPointerMove={(e) => {
              if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;

                setHoverWidth(offsetX);
              }
            }}
          >
            <div className={styles.time}>{current}</div>
            <div className={styles.duration}>{duration}</div>
            <div className={styles.hover} style={{ width: hoverWidth }}></div>
            <div>
              {comments.map((item) => {
                return (
                  <Tooltip arrow title={item.content} key={item._id}>
                    <Image
                      className={styles.userImage}
                      src={fetchDefaultImages(item.user.type)}
                      alt="comment avatar"
                      width={20}
                      height={20}
                      style={{
                        left: calLeft(item.moment),
                      }}
                    />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </Grid>

        <Grid container item xs={2.5} alignItems={"center"}>
          <Box position={"relative"} height={"70%"} width={"100%"}>
            <Image
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track?.imgUrl}`}
              alt="track cover image"
              fill
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default Wave;
