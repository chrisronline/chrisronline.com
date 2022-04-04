import React, { useContext, useEffect, useState } from 'react';
import { ConfigContext } from '../../../../context';
import { YoutubeApiResponse, YoutubeVideos } from './types';

export const YouTubeGalleryReact = () => {
  const { googleApiKey } = useContext(ConfigContext);
  // curl "https://api.twitter.com/2/users/14355027/tweets?expansions=attachments.media_keys&media.fields=media_key,height,preview_image_url,type,url,width" -H "Authorization: Bearer $BEARER_TOKEN"
  const [videos, setVideos] = useState<YoutubeVideos[]>();
  const [nextPageToken, setNextPageToken] = useState<string>();

  async function fetchTweets() {
    const queryParams = new URLSearchParams();
    queryParams.set('part', 'snippet');
    queryParams.set('q', 'golf');
    queryParams.set('key', googleApiKey as string);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?${queryParams.toString()}`
    );
    const body: YoutubeApiResponse = await response.json();
    setNextPageToken(body.nextPageToken);
    setVideos(body.items);
    // console.log(body);
  }

  useEffect(() => {
    fetchTweets();
  }, []);

  return (
    <article>
      <div className="grid">
        {videos.map((video) => (
          <div className="grid-cell video">
            
          </div>
        ))}
      </div>
    </article>
  );
};
