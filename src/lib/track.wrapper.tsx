"use client";

import { createContext, useContext, useState } from "react";
import WaveSurfer from "wavesurfer.js";

const TrackContext = createContext<ITrackContext | null>(null);

export const TrackContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [track, setTrack] = useState<ICurrentTrack | null>(null);
  const [wavesurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

  return (
    <TrackContext.Provider
      value={{ track, setTrack, wavesurfer, setWavesurfer }}
    >
      {children}
    </TrackContext.Provider>
  );
};

export const useTrackContext = () => useContext(TrackContext);
