import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer, MediaProvider, Track } from "@vidstack/react";
import {
  PlyrLayout,
  plyrLayoutIcons,
} from "@vidstack/react/player/layouts/plyr";
import { Poster } from "@vidstack/react";
import "./VideoPlayer.css";

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
  return (
    <MediaPlayer
      playsInline
      className="video-player-custom"
      title={videoName}
      src={videoLink}
      hideControlsOnMouseLeave
    >
      <MediaProvider>
        {posterLink.length !== 0 && (
          <Poster className="media-poster" src={posterLink} alt="Thumbnail" />
        )}

        {subtitlesLink.length != 0 && (
          <Track
            kind="captions"
            src={subtitlesLink}
            label={subtitlesLanguage}
            default
          />
        )}
      </MediaProvider>
      <PlyrLayout
        thumbnails={thumbnailsLink.length !== 0 ? thumbnailsLink : undefined}
        icons={plyrLayoutIcons}
      />
    </MediaPlayer>
  );
}

export default VideoPlayer;
