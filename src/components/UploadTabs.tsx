"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import UploadStep1 from "./UploadStep1";
import UploadStep2 from "./UploadStep2";

function UploadTabs() {
  const [value, setValue] = React.useState("1");
  const [progress, setProgress] = React.useState(0);
  const [trackName, setTrackName] = React.useState("");
  const [trackUrl, setTrackUrl] = React.useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", border: "1px solid #ccc" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Tracks" value="1" disabled={value === "2"} />
            <Tab label="Basic information" value="2" disabled={value === "1"} />
          </TabList>
        </Box>
        <TabPanel value="1">
          <UploadStep1
            setProgress={setProgress}
            setValue={setValue}
            setTrackName={setTrackName}
            setTrackUrl={setTrackUrl}
          />
        </TabPanel>
        <TabPanel value="2">
          <UploadStep2
            progress={progress}
            trackName={trackName}
            trackUrl={trackUrl}
            setValue={setValue}
          />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default UploadTabs;
