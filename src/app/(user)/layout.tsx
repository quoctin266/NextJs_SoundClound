import * as React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function UserLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  );
}
