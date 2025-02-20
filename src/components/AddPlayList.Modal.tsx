"use client";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { sendRequest } from "@/utils/fetchWrapper";
import { useSession } from "next-auth/react";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";

const initError = {
  title: "",
};

interface IProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

function AddPlayListModal(props: IProps) {
  const { open, setOpen } = props;

  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState(initError);

  const { data: session } = useSession();
  const toast = useToast();
  const router = useRouter();

  const handleClose = (
    event?: object,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (reason && reason === "backdropClick") return;
    setOpen(false);
    setError(initError);
    setTitle("");
    setIsPublic(true);
  };

  const handleSave = async () => {
    const response = await sendRequest<IBackendRes<IPlaylist>>({
      method: "POST",
      url: "api/v1/playlists/empty",
      body: { title, isPublic },
      headers: {
        Authorization: `Bearer ${session?.access_token}`,
      },
    });

    if (response.data) {
      handleClose();
      toast.success("Tạo mới thành công");
      router.refresh();
    } else toast.error(response.message);
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
      <DialogTitle>Thêm mới playlist:</DialogTitle>
      <DialogContent>
        <TextField
          value={title}
          onChange={(e) => {
            if (!e.target.value) {
              setError((state) => ({
                ...state,
                title: "* Tiêu đề không được trống",
              }));
            } else setError((state) => ({ ...state, title: "" }));

            setTitle(e.target.value);
          }}
          autoFocus
          required
          label="Tiêu đề"
          fullWidth
          variant="standard"
          helperText={error.title ? error.title : undefined}
          FormHelperTextProps={{ error: true }}
        />

        <FormControlLabel
          sx={{ mt: 3 }}
          control={
            <Switch
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
          }
          label={isPublic ? "Public" : "Private"}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddPlayListModal;
