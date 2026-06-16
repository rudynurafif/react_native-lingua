import { useAuth } from "@clerk/expo";
import { Redirect, Tabs } from "expo-router";

import { TabBar } from "@/components/TabBar";

/**
 * Bottom tab navigation. The tab bar UI is fully custom (see TabBar), so we
 * just declare the routes/titles here and let it handle rendering.
 *
 * Acts as the auth guard for the whole app shell: if the session goes away
 * (sign out, token expiry), we redirect back to the entry gate, which sends
 * the signed-out user to onboarding.
 */
export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return null;
  }

  if (!isSignedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="learn" options={{ title: "Learn" }} />
      <Tabs.Screen name="ai-teacher" options={{ title: "AI Teacher" }} />
      <Tabs.Screen name="chat" options={{ title: "Chat" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
