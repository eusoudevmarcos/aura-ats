// src/components/VideoPlayer/VideoPlayer.tsx
import React, { useEffect, useRef } from "react";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  src: string;
  title: string;
  width?: number;
  height?: number;
  autoplay?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  title,
  width = 560,
  height = 315,
  autoplay = true,
  muted = true,
  controls = true,
  className = "",
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Garante que o vídeo seja reproduzido quando o modal abrir
    if (autoplay && iframeRef.current) {
      const iframe = iframeRef.current;
      const currentSrc = iframe.src;

      // Recarrega o iframe para garantir a reprodução automática
      if (currentSrc.includes("autoplay=1")) {
        iframe.src = currentSrc;
      }
    }
  }, [autoplay]);

  // Função para construir a URL do YouTube com parâmetros otimizados
  const buildYouTubeUrl = (url: string) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const baseUrl = url.includes("embed")
        ? url
        : url.replace("watch?v=", "embed/");
      const separator = baseUrl.includes("?") ? "&" : "?";
      return `${baseUrl}${separator}autoplay=${autoplay ? "1" : "0"}&mute=${
        muted ? "1" : "0"
      }&rel=0&modestbranding=1&controls=${controls ? "1" : "0"}`;
    }
    return url;
  };

  const videoUrl = buildYouTubeUrl(src);

  return (
    <div className={`${styles.videoWrapper} ${className}`}>
      <iframe
        ref={iframeRef}
        width={width}
        height={height}
        src={videoUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        className={styles.videoIframe}
      />
    </div>
  );
};

export default VideoPlayer;
