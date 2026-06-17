/**
 * StreamVideoProvider
 *
 * Connects the signed-in Clerk user to Stream once per session and makes the
 * `StreamVideoClient` available to every screen below it (so the audio-lesson
 * screen can join a call). Mounted high in `app/_layout.tsx`, inside Clerk.
 *
 * Design choices (per the Stream RN rules):
 *   - one client per session via `StreamVideoClient.getOrCreateInstance` (never
 *     `new StreamVideoClient`), built in an effect keyed on the user id and torn
 *     down on sign-out;
 *   - a `tokenProvider` that re-hits our API route, so the SDK refreshes tokens
 *     and the device never holds the Stream secret;
 *   - device safe-area insets bridged into the SDK theme.
 *
 * When there is no signed-in user (or the Stream key is missing), it simply
 * renders its children — the rest of the app keeps working and only the call
 * screen needs the client.
 */
import { useAuth, useUser } from "@clerk/expo";
import {
  StreamVideo,
  StreamVideoClient,
  type DeepPartial,
  type Theme,
  type User,
} from "@stream-io/video-react-native-sdk";
import { useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fetchStreamToken, STREAM_API_KEY } from "@/lib/stream";

/** Bridges device insets into the SDK theme so any Stream UI respects notches. */
function StreamVideoWithInsets({
  client,
  children,
}: {
  client: StreamVideoClient;
  children: React.ReactNode;
}) {
  const { top, right, bottom, left } = useSafeAreaInsets();
  // The SDK's `DeepPartial` maps over primitive fields too, so a literal with
  // numeric insets isn't directly assignable — cast through `unknown`.
  const theme = {
    variants: { insets: { top, right, bottom, left } },
  } as unknown as DeepPartial<Theme>;
  return (
    <StreamVideo client={client} style={theme}>
      {children}
    </StreamVideo>
  );
}

export function StreamVideoProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [client, setClient] = useState<StreamVideoClient>();

  // Keep `getToken` in a ref so the token provider always uses the latest one
  // without forcing the client to rebuild on every render.
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  const userId = user?.id;

  useEffect(() => {
    if (!isSignedIn || !userId || !STREAM_API_KEY) {
      setClient(undefined);
      return;
    }

    const streamUser: User = {
      id: userId,
      name: user?.fullName ?? user?.username ?? user?.firstName ?? "Learner",
      image: user?.imageUrl,
    };

    const c = StreamVideoClient.getOrCreateInstance({
      apiKey: STREAM_API_KEY,
      user: streamUser,
      // Re-hits our authenticated /api/stream/token route on connect + refresh.
      tokenProvider: () => fetchStreamToken(() => getTokenRef.current()),
    });
    setClient(c);

    return () => {
      c.disconnectUser().catch((err) => console.error("Stream disconnect failed", err));
      setClient(undefined);
    };
    // `user` fields other than the id are cosmetic; rebuilding on id is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn, userId]);

  if (!client) return <>{children}</>;
  return <StreamVideoWithInsets client={client}>{children}</StreamVideoWithInsets>;
}
