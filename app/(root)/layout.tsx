import Header from "@/components/Header";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = async ({ children }: { children: React.ReactNode }) => {


  return (
    <main className="flex h-screen">
 
      <section className="flex h-full flex-1 flex-col">
        <Header/>
        <div className="border-b border-red-500 "></div>
        <div className="main-content">{children}</div>
      </section>

    
    </main>
  );
};

export default Layout;
