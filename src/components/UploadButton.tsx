"use client";

import React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface IProps {
  setFile?: (v: File) => void;
}

function UploadButton(props: IProps) {
  const { setFile } = props;

  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      Upload file
      <VisuallyHiddenInput
        type="file"
        onChange={(event) => {
          if (setFile && event.target.files && event.target.files.length > 0)
            setFile(event.target.files[0]);
        }}
      />
    </Button>
  );
}

export default UploadButton;
