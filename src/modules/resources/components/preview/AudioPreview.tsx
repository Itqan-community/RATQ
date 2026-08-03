'use client';

interface AudioPreviewProps {
  data: {
    audio_url?: string;
    audio_thumbnail?: string;
  };
}

export function AudioPreview({ data }: AudioPreviewProps) {
  const { audio_url, audio_thumbnail } = data;

  if (!audio_url) return null;

  return (
    <div className="space-y-3">
      {audio_thumbnail && (
        <img
          src={audio_thumbnail}
          alt="Audio thumbnail"
          className="w-full rounded-md object-cover max-h-48"
        />
      )}
      <audio
        controls
        className="w-full"
        src={audio_url}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
