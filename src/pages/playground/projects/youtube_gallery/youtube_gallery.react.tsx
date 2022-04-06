import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../../context';
import { ThumnbnailType, YoutubeApiResponse, YoutubeVideos } from './types';
import './youtube_gallery.scss';

export const YouTubeGalleryReact = () => {
  const { googleApiKey } = useContext(ConfigContext);
  // curl "https://api.twitter.com/2/users/14355027/tweets?expansions=attachments.media_keys&media.fields=media_key,height,preview_image_url,type,url,width" -H "Authorization: Bearer $BEARER_TOKEN"
  const [videos, setVideos] = useState<YoutubeVideos[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string>();

  async function fetchTweets() {
    const queryParams = new URLSearchParams();
    queryParams.set('part', 'snippet');
    queryParams.set('q', 'golf');
    queryParams.set('order', 'rating');
    queryParams.set('key', googleApiKey as string);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${queryParams.toString()}`
    );
    const body: YoutubeApiResponse = await response.json();
    setNextPageToken(body.nextPageToken);
    setVideos(body.items);
    console.log(body);
  }

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <article>
      <div className="grid">
        {videos.map((video) => (
          <div className="grid-cell video" key={video.id.videoId}>
            <header>
              <h4 className="video-title">{video.snippet.title}</h4>
              <img
                src={video.snippet.thumbnails[ThumnbnailType.high].url}
                width={video.snippet.thumbnails[ThumnbnailType.high].width}
                height={video.snippet.thumbnails[ThumnbnailType.high].height}
              />
            </header>
          </div>
        ))}
      </div>
    </article>
  );
};
