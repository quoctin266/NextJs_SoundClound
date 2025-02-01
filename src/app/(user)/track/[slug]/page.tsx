import Wave from "@/components/Wave";
import { Container } from "@mui/material";
import React from "react";

function DetailTrackPage(props: { params: { slug: string } }) {
  const { params } = props;

  return (
    <Container sx={{ py: "3rem" }}>
      <div>
        <Wave />
      </div>
    </Container>
  );
}

export default DetailTrackPage;
