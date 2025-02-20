import WaveSurfer from "wavesurfer.js";

export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }

  interface ITrackTop {
    _id: string;

    title: string;

    description: string;

    category: string;

    imgUrl: string;

    trackUrl: string;

    countLike: number;

    countPlay: number;

    uploader: {
      _id: string;

      email: string;

      name: string;

      role: string;

      type: string;
    };

    isDeleted: boolean;

    createdAt: string;

    updatedAt: string;
  }

  interface ILikeTrack {
    _id: string;

    title: string;

    description: string;

    category: string;

    imgUrl: string;

    trackUrl: string;

    countLike: number;

    countPlay: number;
  }

  interface ICurrentTrack extends ITrackTop {
    isPlaying: boolean;
    time?: number;
    commentTime?: number;
  }

  interface ITrackContext {
    track: ICurrentTrack | null;
    setTrack: (v: ICurrentTrack) => void;
    wavesurfer: WaveSurfer | null;
    setWavesurfer: (v: WaveSurfer) => void;
  }

  export interface IComment {
    _id: string;

    content: string;

    moment: number;

    user: {
      _id: string;

      email: string;

      name: string;

      role: string;

      type: string;
    };

    track: {
      _id: string;

      title: string;

      description: string;

      trackUrl: string;
    };

    createdAt: string;

    updatedAt: string;
  }

  interface IPlaylist {
    _id: string;

    title: string;

    isPublic: boolean;

    user: string;

    tracks: ILikeTrack[];

    createdAt: string;

    updatedAt: string;
  }
}
