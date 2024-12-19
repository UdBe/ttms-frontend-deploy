"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  workflowData?: any;
  items: {
    title: string;
    href: string;
  }[];
}

export function SidebarNav({
  className,
  items,
  workflowData,
  ...props
}: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className,
      )}
      {...props}
    >
      {items.map((item, i) => (
        <div key={item.href}>
          <Link
            href={item.href}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              pathname === item.href
                ? "bg-black text-white"
                : "hover:underline",
              "justify-start w-full mt-2",
            )}
          >
            {item.title}
          </Link>
        </div>
      ))}
    </nav>
  );
}
