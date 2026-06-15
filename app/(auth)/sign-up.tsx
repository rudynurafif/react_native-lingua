import { useRouter } from "expo-router";

import { AuthScreen } from "@/components/AuthScreen";

export default function SignUp() {
  const router = useRouter();

  return (
    <AuthScreen
      title="Create your account"
      subtitle="Start your language journey today ✨"
      submitLabel="Sign Up"
      mode="sign-up"
      footerPrompt="Already have an account?"
      footerActionLabel="Log in"
      onFooterAction={() => router.replace("/sign-in")}
    />
  );
}
