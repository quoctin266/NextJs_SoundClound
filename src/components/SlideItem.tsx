"use client";

import { convertSlugUrl } from "@/utils/fetchWrapper";
import Box from "@mui/material/Box";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IProps {
  item: ITrackTop;
}

function SlideItem(props: IProps) {
  const { item } = props;

  const router = useRouter();

  return (
    <Box
      sx={{
        paddingX: 2,
        paddingBottom: 2,
        h3: { height: 200, border: "1px solid #ccc" },
        img: {
          width: "100%",
          height: "inherit",
        },
        ".title": {
          color: "black",
          fontWeight: 600,
        },
        cursor: "pointer",
      }}
      onClick={() =>
        router.push(
          `/track/${convertSlugUrl(item.title)}-${item._id}.html?audio=${
            item?.trackUrl
          }`
        )
      }
    >
      <Box position={"relative"} height={200} width={"100%"} mb={1}>
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item?.imgUrl}`}
          alt="track cover image"
          fill
          style={{ objectFit: "cover" }}
        />
      </Box>
      <div className="title">{item?.title}</div>
      <div>{item?.description}</div>
    </Box>
  );
}

export default SlideItem;
