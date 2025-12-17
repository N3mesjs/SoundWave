export interface YouTubeResponse {
  pageInfo?: {
    resultsPerPage: number;
    totalResults: number;
  };
  items?: Array<{
    id?: {
      videoId: string;
    };
    snippet?: {
      title: string;
      description: string;
      thumbnails?: {
        default?: { url: string };
        medium?: { url: string };
        high?: { url: string };
      };
      channelTitle?: string;
    };
  }>;
}