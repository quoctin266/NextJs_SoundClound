"use client";

import { Theme, useTheme } from "@mui/material/styles";
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { sendRequest } from "@/utils/fetchWrapper";
import { useToast } from "@/utils/toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(
  trackId: string,
  selectedTracks: readonly string[],
  theme: Theme
) {
  return {
    fontWeight:
      selectedTracks.indexOf(trackId) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
  playlists: IPlaylist[];
  tracks: ITrackTop[];
}

function AddTrackModal(props: IProps) {
  const { open, setOpen, playlists, tracks } = props;

  const [playlist, setPlaylist] = useState("");
  const [selectedTracks, setSelectedTracks] = useState<string[]>([]);

  const { data: session } = useSession();
  const theme = useTheme();
  const toast = useToast();
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent<typeof selectedTracks>) => {
    const {
      target: { value },
    } = event;
    setSelectedTracks(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClose = (
    event?: object,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
    setPlaylist("");
    setSelectedTracks([]);
  };

  const handleSave = async () => {
    const playlistDetail = playlists.find((item) => item._id === playlist);
    if (playlistDetail) {
      const currentTracks = playlistDetail.tracks.map((item) => item._id);

      const response = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: "api/v1/playlists",
        body: {
          id: playlistDetail._id,
          title: playlistDetail.title,
          isPublic: playlistDetail.isPublic,
          tracks: [...currentTracks, ...selectedTracks],
        },
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (response.data) {
        handleClose();
        router.refresh();
        toast.success("Thêm track thành công");
      } else toast.error(response.message);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          event.preventDefault();
          handleSave();
        },
      }}
    >
      <DialogTitle>Thêm track to playlist:</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="standard">
          <InputLabel>Chọn playlist</InputLabel>
          <Select
            value={playlist}
            label="Chọn playlist"
            onChange={(e) => setPlaylist(e.target.value)}
          >
            <MenuItem value={""} disabled>
              Chọn playlist
            </MenuItem>
            {playlists.map((item) => {
              return (
                <MenuItem key={item._id} value={item._id}>
                  {item.title}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl sx={{ mt: 5 }} fullWidth>
          <InputLabel>Track</InputLabel>
          <Select
            multiple
            value={selectedTracks}
            onChange={handleChange}
            input={<OutlinedInput label="Track" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => {
                  const title = tracks.find(
                    (item) => item._id === value
                  )?.title;

                  return <Chip key={value} label={title} />;
                })}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {tracks.map((item) => (
              <MenuItem
                key={item._id}
                value={item._id}
                style={getStyles(item._id, selectedTracks, theme)}
              >
                {item.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddTrackModal;
