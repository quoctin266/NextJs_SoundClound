"use client";

import { Box } from "@mui/material";
import React from "react";
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
        router.push(`/track/${item._id}?audio=${item?.trackUrl}&id=${item._id}`)
      }
    >
      <h3>
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item?.imgUrl}`}
        />
      </h3>
      <div className="title">{item?.title}</div>
      <div>{item?.description}</div>
    </Box>
  );
}

export default SlideItem;
