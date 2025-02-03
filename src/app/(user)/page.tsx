import MainSlider from "@/components/MainSlider";
// import Container from "@mui/material/Container";
import { sendRequest } from "@/utils/fetchWrapper";
import { Container } from "@mui/material";

export default async function Home() {
  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    method: "POST",
    url: "api/v1/tracks/top",
    body: { category: "CHILL", limit: 10 },
  });

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    method: "POST",
    url: "api/v1/tracks/top",
    body: { category: "WORKOUT", limit: 10 },
  });

  const parties = await sendRequest<IBackendRes<ITrackTop[]>>({
    method: "POST",
    url: "api/v1/tracks/top",
    body: { category: "PARTY", limit: 10 },
  });

  return (
    <Container sx={{ paddingBottom: 20, paddingTop: 5 }}>
      <MainSlider data={chills?.data ?? []} title="Top Chill" />

      <MainSlider data={workouts?.data ?? []} title="Top Workout" />

      <MainSlider data={parties?.data ?? []} title="Top Party" />
    </Container>
  );
}
