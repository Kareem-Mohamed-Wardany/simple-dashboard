"use client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Body from "@/components/Body";

const page = () => {
  const router = useRouter();
  const { isAdmin } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAdmin) router.push("/auth/login");
  }, []);
  return (
    <>
      <Header />
      <Body />
    </>
  );
};

export default page;
