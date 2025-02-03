import CommentSection from "@/components/CommentSection";
import LikeSection from "@/components/LikeSection";
import Wave from "@/components/Wave";
import { sendRequest } from "@/utils/fetchWrapper";
import Container from "@mui/material/Container";
import { getServerSession } from "next-auth";
import { Metadata } from "next";
import { authOptions } from "@/utils/authOptions";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // read route params
  const slug = (await params).slug;
  const id = slug.split("-")[slug.split("-").length - 1].split(".")[0];

  const res = await sendRequest<IBackendRes<ITrackTop>>({
    method: "GET",
    url: `api/v1/tracks/${id}`,
  });

  return {
    title: res.data?.title,
    description: res.data?.description,
    openGraph: {
      title: "Hỏi Dân IT",
      description: "Beyond Your Coding Skills",
      type: "website",
      images: [
        `https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`,
      ],
    },
  };
}

async function DetailTrackPage(props: { params: { slug: string } }) {
  const { params } = props;

  const slug = params.slug;
  const id = slug.split("-")[slug.split("-").length - 1].split(".")[0];

  const session = await getServerSession(authOptions);

  const response = await sendRequest<IBackendRes<IModelPaginate<IComment>>>({
    method: "POST",
    url: `api/v1/tracks/comments`,
    queryParams: {
      current: 1,
      pageSize: 10,
      trackId: id,
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
    url: `api/v1/tracks/${id}`,
    nextOption: { cache: "no-store" },
  });

  return (
    <Container sx={{ py: "3rem" }}>
      <div>
        <Wave comments={response.data?.result ?? []} id={id} />
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
