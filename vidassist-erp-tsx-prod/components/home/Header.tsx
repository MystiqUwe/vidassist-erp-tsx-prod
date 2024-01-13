"use client";
import cn from "@/lib/cn";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import Logo from "../app/Logo";
import { CTAButton } from "./CTAButton";

export default function Header({
  className,
  fullWidth = false,
}: {
  className?: string;
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const logoHref = "/";

  return (
    <>
      {/* mobile */}
      <nav className={cn("z-20 w-full md:hidden", className)}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 text-base">
          <Link href={logoHref}>
            <Logo variant="wordmark" />
          </Link>
          <Button variant="ghost" onClick={() => setOpen((x) => !x)}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>
        {open && (
          <div className="absolute z-10 flex w-full flex-col space-y-4 bg-white p-4 shadow-lg">
            <Links />
            <CTAButton size="small" />
          </div>
        )}
      </nav>
      {/* desktop */}
      <nav className={cn("z-20 hidden w-full md:block", className)}>
        <div
          className={cn(
            "mx-auto flex h-16 items-center justify-between px-4 text-base",
            {
              "max-w-7xl": !fullWidth,
            }
          )}
        >
          <Link href={logoHref}>
            <Logo variant="wordmark" />
          </Link>
          <div className="flex items-center space-x-2">
            <Links />
            <CTAButton size="small" />
          </div>
        </div>
      </nav>
    </>
  );
}

export function BlogHeader() {
  return (
    <Header className="fixed top-0 w-full border-b border-gray-200 bg-white" />
  );
}

function Links() {
  return (
    <>
      {["blog", "docs", "changelog"].map((link) => (
        <Link key={link} href={`/${link}`}>
          <Button variant="ghost" className="text-base font-normal capitalize">
            {link}
          </Button>
        </Link>
      ))}
    </>
  );
}
