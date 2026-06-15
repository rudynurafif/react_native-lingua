import { useRouter } from "expo-router";

import { AuthScreen } from "@/components/AuthScreen";

export default function SignIn() {
  const router = useRouter();

  return (
    <AuthScreen
      title="Welcome back"
      subtitle="Log in to continue your journey ✨"
      submitLabel="Sign In"
      footerPrompt="Don't have an account?"
      footerActionLabel="Sign up"
      onFooterAction={() => router.replace("/sign-up")}
    />
  );
}
