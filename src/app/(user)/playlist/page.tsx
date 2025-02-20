import Playlist from "@/components/Playlist";
import { authOptions } from "@/utils/authOptions";
import { sendRequest } from "@/utils/fetchWrapper";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function PlaylistPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const dataPlaylist = await sendRequest<
    IBackendRes<IModelPaginate<IPlaylist>>
  >({
    method: "POST",
    url: "api/v1/playlists/by-user",
    queryParams: {
      current: 1,
      pageSize: 100,
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const dataTracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    method: "GET",
    url: "api/v1/tracks",
    queryParams: {
      current: 1,
      pageSize: 100,
    },
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  return (
    <Container sx={{ py: 6 }}>
      <Playlist
        playlists={dataPlaylist.data?.result ?? []}
        tracks={dataTracks.data?.result ?? []}
      />
    </Container>
  );
}

export default PlaylistPage;
