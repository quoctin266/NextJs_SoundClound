import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guest page",
  description: "Guest description",
};

export default function GuestLayout(props: { children: React.ReactNode }) {
  return <>{props.children}</>;
}
