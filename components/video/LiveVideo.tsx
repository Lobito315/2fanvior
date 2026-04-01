"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useTracks,
  ConnectionState,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useEffect, useState } from "react";

interface LiveVideoProps {
  room: string;
  token: string;
  onDisconnected?: () => void;
}

export default function LiveVideo({ room, token, onDisconnected }: LiveVideoProps) {
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || "wss://fanvior-cjhwcz70.livekit.cloud";

  return (
    <LiveKitRoom
      video={true}
      audio={true}
      token={token}
      serverUrl={serverUrl}
      onDisconnected={onDisconnected}
      data-lk-theme="default"
      className="flex-1 flex flex-col relative overflow-hidden rounded-2xl border border-outline-variant/20 shadow-2xl bg-black"
    >
      <VideoConference />
      <RoomAudioRenderer />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
        <ControlBar variation="minimal" />
      </div>
    </LiveKitRoom>
  );
}

function VideoConference() {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, filterByFocus: false },
      { source: Track.Source.ScreenShare, filterByFocus: false },
    ],
    { onlyShowingFacets: true }
  );

  return (
    <GridLayout tracks={tracks} className="flex-1 bg-surface-container-lowest">
      <ParticipantTile />
    </GridLayout>
  );
}
