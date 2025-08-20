"use client";

import Allsongs from "@/components/Allsongs";
import FrontendLayout from "../../layouts/FrontendLayout";

export default function Home() {
  return (
    <FrontendLayout>
      <div className="min-h-screen">
        <Allsongs />
      </div>
    </FrontendLayout>
  );
}
