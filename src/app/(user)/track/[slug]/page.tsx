import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CommentSection from "@/components/CommentSection";
import LikeSection from "@/components/LikeSection";
import Wave from "@/components/Wave";
import { sendRequest } from "@/utils/fetchWrapper";
import { Container } from "@mui/material";
import { getServerSession } from "next-auth";
import React from "react";

async function DetailTrackPage(props: { params: { slug: string } }) {
  const { params } = props;

  const session = await getServerSession(authOptions);

  const response = await sendRequest<IBackendRes<IModelPaginate<IComment>>>({
    method: "POST",
    url: `api/v1/tracks/comments`,
    queryParams: {
      current: 1,
      pageSize: 10,
      trackId: params.slug,
      sort: "-createdAt",
    },
  });

  const likedTrackResponse = await sendRequest<
    IBackendRes<IModelPaginate<ILikeTrack>>
  >({
    method: "GET",
    url: `api/v1/likes`,
    queryParams: {
      current: 1,
      pageSize: 100,
    },
    headers: {
      Authorization: `Bearer ${session?.access_token}`,
    },
  });

  const trackRes = await sendRequest<IBackendRes<ITrackTop>>({
    method: "GET",
    url: `api/v1/tracks/${params.slug}`,
  });

  return (
    <Container sx={{ py: "3rem" }}>
      <div>
        <Wave comments={response.data?.result ?? []} />
      </div>
      <div>
        <LikeSection
          track={trackRes.data ?? null}
          likedTracks={likedTrackResponse.data?.result ?? []}
        />
      </div>
      <div>
        <CommentSection
          track={trackRes.data ?? null}
          comments={response.data?.result ?? []}
        />
      </div>
    </Container>
  );
}

export default DetailTrackPage;
