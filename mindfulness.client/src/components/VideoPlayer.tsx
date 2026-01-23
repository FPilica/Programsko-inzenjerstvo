import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Poster } from "@vidstack/react";
import "./VideoPlayer.css";
import { useState } from "react";

function VideoPlayer({
  videoLink,
  videoName,
  subtitlesLink = "",
  subtitlesLanguage = "",
  thumbnailsLink = "",
  posterLink = "",
}: {
  videoLink: string;
  videoName: string;
  subtitlesLink?: string;
  subtitlesLanguage?: string;
  thumbnailsLink?: string;
  posterLink?: string;
}) {
  const [posterError, setPosterError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Validate links
  const isValidUrl = (url: string) => {
    if (!url || url.trim() === "") return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const validVideoLink = isValidUrl(videoLink) ? videoLink : "";
  const validPosterLink = isValidUrl(posterLink) && !posterError ? posterLink : "";
  const validSubtitlesLink = isValidUrl(subtitlesLink) ? subtitlesLink : "";
  const validThumbnailsLink = isValidUrl(thumbnailsLink) ? thumbnailsLink : undefined;

  if (!validVideoLink) {
    return (
      <div className="video-player-error">
        <p>Video link nije dostupan</p>
      </div>
    );
  }

  return (
    <MediaPlayer
      playsInline
      className="video-player-custom"
      title={videoName}
      src={validVideoLink}
      hideControlsOnMouseLeave
      onError={() => setVideoError(true)}
    >
      <MediaProvider>
        {validPosterLink && (
          <Poster 
            className="media-poster" 
            src={validPosterLink} 
            alt="Thumbnail"
            onError={() => setPosterError(true)}
          />
        )}

        {validSubtitlesLink && (
          <Track
            kind="captions"
            src={validSubtitlesLink}
            label={subtitlesLanguage}
            default
          />
        )}
      </MediaProvider>
      <PlyrLayout
        thumbnails={validThumbnailsLink}
        icons={plyrLayoutIcons}
      />
      {videoError && (
        <div className="video-player-error-overlay">
          <p>Greška pri učitavanju videa</p>
        </div>
      )}
    </MediaPlayer>
  );
}

export default VideoPlayer;
