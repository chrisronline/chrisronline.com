export enum ThumnbnailType {
  default = 'default',
  medium = 'medium',
  high = 'high',
}

export interface YoutubeVideos {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      [type in ThumnbnailType]: {
        url: string;
        width: string;
        height: string;
      };
    };
  };
}

export interface YoutubeApiResponse {
  etag: string;
  nextPageToken: string;
  // prevPageToken: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: YoutubeVideos[];
}
