"use client";

import { useEffect, useState } from "react";
import { Footer } from "./footer";
import { Header } from "./header";
import { SearchDialog } from "./search-dialog";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((open) => !open);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <>
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <Header onSearch={() => setSearchOpen(true)} />
      <main id="content" className="flex-1">
        {children}
      </main>
      <Footer />
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
