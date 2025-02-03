"use client";

import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import UploadStep1 from "./UploadStep1";
import UploadStep2 from "./UploadStep2";
import { useState } from "react";

function UploadTabs() {
  const [value, setValue] = useState("1");
  const [progress, setProgress] = useState(0);
  const [trackName, setTrackName] = useState("");
  const [trackUrl, setTrackUrl] = useState("");

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue + 1 + "");
  };

  return (
    <Box sx={{ width: "100%", typography: "body1", border: "1px solid #ccc" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs onChange={handleChange} value={+value - 1}>
          <Tab label="Tracks" disabled={value === "2"} />
          <Tab label="Basic information" disabled={value === "1"} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={1}>
        <UploadStep1
          setProgress={setProgress}
          setValue={setValue}
          setTrackName={setTrackName}
          setTrackUrl={setTrackUrl}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <UploadStep2
          progress={progress}
          trackName={trackName}
          trackUrl={trackUrl}
          setValue={setValue}
        />
      </CustomTabPanel>
    </Box>
  );
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: string;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={+value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {+value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default UploadTabs;
