import ProfilePlaylist from "@/components/ProfilePlaylist";
import { sendRequest } from "@/utils/fetchWrapper";
import React from "react";

async function ProfilePage(props: { params: { slug: string } }) {
  const { params } = props;

  const response = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    method: "POST",
    url: "api/v1/tracks/users",
    body: { id: params.slug },
    queryParams: {
      current: 1,
      pageSize: 10,
    },
  });

  return <ProfilePlaylist trackLists={response.data?.result ?? []} />;
}

export default ProfilePage;
