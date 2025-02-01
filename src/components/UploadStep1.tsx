"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone, FileWithPath } from "react-dropzone";
import styles from "./UploadStep1.module.scss";
import UploadButton from "./UploadButton";
import { useSession } from "next-auth/react";
import axios from "axios";

interface IProps {
  setTrackName: (v: string) => void;

  setProgress: (v: number) => void;

  setValue: (v: string) => void;

  setTrackUrl: (v: string) => void;
}

function UploadStep1(props: IProps) {
  const { setProgress, setValue, setTrackName, setTrackUrl } = props;

  const [trackFile, setTrackFile] = useState<File | null>(null);

  const { data: session } = useSession();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setValue("2");
        setTrackName(acceptedFiles[0].name);

        const track = acceptedFiles[0];

        const formdata = new FormData();
        formdata.append("fileUpload", track);

        const response = await axios.post<
          unknown,
          { data: IBackendRes<{ fileName: string }> }
        >("http://localhost:8000/api/v1/files/upload", formdata, {
          headers: {
            target_type: "tracks",
            Authorization: `Bearer ${session?.access_token}`,
            delay: 5000,
          },
          onUploadProgress(progressEvent) {
            const percentCompleted = Math.floor(
              (progressEvent.loaded * 100) / (progressEvent.total as number)
            );

            setProgress(percentCompleted);
          },
        });

        if (response.data.data) setTrackUrl(response.data.data?.fileName);
      }
    },
    [session]
  );

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      audio: [".mp3", ".m4a", ".wav"],
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  useEffect(() => {
    (async () => {
      if (trackFile && session) {
        setValue("2");
        setTrackName(trackFile.name);

        const formdata = new FormData();
        formdata.append("fileUpload", trackFile);

        const response = await axios.post<
          unknown,
          { data: IBackendRes<{ fileName: string }> }
        >("http://localhost:8000/api/v1/files/upload", formdata, {
          headers: {
            target_type: "tracks",
            Authorization: `Bearer ${session.access_token}`,
            delay: 5000,
          },
          onUploadProgress(progressEvent) {
            const percentCompleted = Math.floor(
              (progressEvent.loaded * 100) / (progressEvent.total as number)
            );

            setProgress(percentCompleted);
          },
        });

        if (response.data.data) setTrackUrl(response.data.data?.fileName);
      }
    })();
  }, [trackFile, session]);

  return (
    <section className={styles.container}>
      <div {...getRootProps({ className: styles.dropzone })}>
        <input {...getInputProps()} />

        <UploadButton setFile={setTrackFile} />

        <p>Drag 'n' drop a file here, or click to select file track</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}

export default UploadStep1;
