"use client";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider, { Settings } from "react-slick";
import SlideItem from "./SlideItem";
import { Box, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

interface IProps {
  data: ITrackTop[];

  title: string;
}

function CustomPrevArrow(props: any) {
  const { className, style, onClick } = props;

  return (
    <Button
      color="inherit"
      variant="contained"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "35%",
        left: 0,
        minWidth: "40px",
        paddingX: 0,
        zIndex: 2,
      }}
    >
      <ArrowBackIosIcon />
    </Button>
  );
}

function CustomNextArrow(props: any) {
  const { className, style, onClick } = props;

  return (
    <Button
      color="inherit"
      variant="contained"
      onClick={onClick}
      sx={{
        position: "absolute",
        top: "35%",
        right: 0,
        minWidth: "40px",
        paddingX: 0,
      }}
    >
      <ArrowForwardIosIcon />
    </Button>
  );
}

function MainSlider(props: IProps) {
  const { data, title } = props;

  const settings: Settings = {
    dots: false,
    infinite: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Box className="slider-container">
      <h2>{title}</h2>
      <Slider {...settings}>
        {data.map((item) => {
          return <SlideItem key={item._id} item={item} />;
        })}
      </Slider>

      <Divider />
    </Box>
  );
}

export default MainSlider;
