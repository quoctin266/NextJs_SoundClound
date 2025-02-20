import LikeTrack from "@/components/LikeTrack";
import { authOptions } from "@/utils/authOptions";
import { sendRequest } from "@/utils/fetchWrapper";
import { Box, Container, Divider, Grid } from "@mui/material";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function LikePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/signin");
  }

  const dataLikedTracks = await sendRequest<
    IBackendRes<IModelPaginate<ILikeTrack>>
  >({
    method: "GET",
    url: "api/v1/likes",
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
      <Box sx={{ fontSize: "1.1rem", fontWeight: 600 }}>
        Hear the tracks you've liked:
      </Box>
      <Divider sx={{ my: 3 }} />

      <Grid container gap={3}>
        {dataLikedTracks.data?.result.map((item) => {
          return <LikeTrack key={item._id} data={item} />;
        })}
      </Grid>
    </Container>
  );
}

export default LikePage;
