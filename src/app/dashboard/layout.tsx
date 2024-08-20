import React from "react";
import { Toaster } from "react-hot-toast";
import { Footer } from "~~/app/dashboard/_components/Footer";
import { Header } from "~~/app/dashboard/_components/Header";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="relative flex flex-col flex-1">{children}</main>
      <Footer />
      <Toaster />
    </div>
  );
};

export default layout;
