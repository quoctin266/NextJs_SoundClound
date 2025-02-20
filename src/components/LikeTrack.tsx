"use client";

import { convertSlugUrl } from "@/utils/fetchWrapper";
import { Box, Grid } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IProps {
  data: ILikeTrack;
}

function LikeTrack(props: IProps) {
  const { data } = props;

  const router = useRouter();

  return (
    <Grid
      item
      xs={2.2}
      onClick={() =>
        router.push(
          `/track/${convertSlugUrl(data.title)}-${data._id}.html?audio=${
            data?.trackUrl
          }`
        )
      }
      sx={{ cursor: "pointer" }}
    >
      <Box position={"relative"} height={220} mb={2}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${data?.imgUrl}`}
          alt="track cover image"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>

      {data.title}
    </Grid>
  );
}

export default LikeTrack;
