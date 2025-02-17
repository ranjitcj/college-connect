import React from "react";
import logo from "@/app/logo/logo.png";
import Image from "next/image";

export default function Page() {
  return (
    <Image src={logo} width={500} height={500} alt="Picture of the author" />
  );
}
