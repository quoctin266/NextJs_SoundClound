import LoginForm from "@/components/LoginForm";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SignInPage() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/");
  }

  return <LoginForm />;
}

export default SignInPage;
