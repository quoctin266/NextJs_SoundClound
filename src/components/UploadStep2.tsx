"use client";

import { useEffect, useState } from "react";
import Progress from "./Progress";
import UploadButton from "./UploadButton";
import { useSession } from "next-auth/react";
import axios from "axios";
import { sendRequest } from "@/utils/fetchWrapper";
import { useToast } from "@/utils/toast";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Image from "next/image";
import sample from "../../public/image/sample.jpg";

interface IProps {
  progress: number;

  trackName: string;

  trackUrl: string;

  setValue: (v: string) => void;
}

interface INewTrack {
  title: string;

  description: string;

  imgUrl: string;

  category: string;
}

function UploadStep2(props: IProps) {
  const { progress, trackName, trackUrl, setValue } = props;

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [info, setInfo] = useState<INewTrack>({
    title: "",
    description: "",
    category: "",
    imgUrl: "",
  });

  const { data: session } = useSession();
  const toast = useToast();

  const handleSave = async () => {
    if (
      trackUrl &&
      info.imgUrl &&
      info.title &&
      info.description &&
      info.category
    ) {
      const res = await sendRequest<IBackendRes<ITrackTop[]>>({
        method: "POST",
        url: "api/v1/tracks",
        body: {
          ...info,
          trackUrl,
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (res.data) {
        setValue("1");
        toast.success("Upload track success");
      } else toast.error(res.message);
    } else toast.error("Missing fields");
  };

  useEffect(() => {
    (async () => {
      if (imageFile) {
        const formdata = new FormData();
        formdata.append("fileUpload", imageFile);

        const response = await axios.post<
          unknown,
          { data: IBackendRes<{ fileName: string }> }
        >(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/v1/files/upload`,
          formdata,
          {
            headers: {
              target_type: "images",
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        const imgUrl = response.data.data?.fileName;
        if (imgUrl)
          setInfo((state) => ({
            ...state,
            imgUrl,
          }));
      }
    })();
  }, [imageFile]);

  return (
    <div>
      <div>{trackName}</div>
      <Progress progress={progress} />

      <Grid container justifyContent={"space-between"}>
        <Grid item xs={12} sm={6} md={3.5} p={5} pb={0} textAlign={"center"}>
          <Box sx={{ height: 250, mb: 2 }} position={"relative"} width={"100%"}>
            <Image
              src={
                info.imgUrl
                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info?.imgUrl}`
                  : sample
              }
              alt="track cover image"
              fill
              style={{ objectFit: "contain" }}
            />
          </Box>
          <UploadButton setFile={setImageFile} />
        </Grid>

        <Grid item xs={12} sm={6} md={8} pt={6}>
          <TextField
            value={info.title}
            onChange={(e) => {
              setInfo((state) => ({
                ...state,
                title: e.target.value,
              }));
            }}
            label="Title"
            fullWidth
            variant="standard"
            sx={{ mb: 2 }}
          />
          <TextField
            value={info.description}
            onChange={(e) => {
              setInfo((state) => ({
                ...state,
                description: e.target.value,
              }));
            }}
            label="Description"
            fullWidth
            variant="standard"
            sx={{ mb: 4 }}
          />
          <FormControl fullWidth variant="standard">
            <InputLabel>Category</InputLabel>
            <Select
              value={info.category}
              onChange={(e) => {
                setInfo((state) => ({
                  ...state,
                  category: e.target.value,
                }));
              }}
              label="Category"
            >
              <MenuItem value="" disabled>
                <em>Choose a category</em>
              </MenuItem>
              <MenuItem value={"CHILL"}>CHILL</MenuItem>
              <MenuItem value={"PARTY"}>PARTY</MenuItem>
              <MenuItem value={"WORKOUT"}>WORKOUT</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" sx={{ mt: 5 }} onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default UploadStep2;
