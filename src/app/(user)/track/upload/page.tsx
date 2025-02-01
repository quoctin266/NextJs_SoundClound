import UploadTabs from "@/components/UploadTabs";
import { Container } from "@mui/material";
import React from "react";

function UploadPage() {
  return (
    <Container sx={{ py: 6 }}>
      <UploadTabs />
    </Container>
  );
}

export default UploadPage;
