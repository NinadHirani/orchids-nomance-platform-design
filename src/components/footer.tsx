"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  
  const isHidden = ["/auth", "/onboarding"].includes(pathname);
  if (isHidden) return null;

  const links = [
    { name: "Social", href: "/social" },
    { name: "Chat", href: "/messages" },
    { name: "Search", href: "/search" },
    { name: "Matches", href: "/matches" },
    { name: "Events", href: "/events" },
    { name: "Ask AI", href: "/coach" },
  ];

  return (
    <footer className="w-full py-12 px-4 border-t border-border bg-card/30 backdrop-blur-sm relative z-10 mt-20">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 group">
          <img 
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/logo-1767110846410.png?width=8000&height=8000&resize=contain" 
            alt="Nomance Logo" 
            className="w-12 h-12 rounded-2xl shadow-xl shadow-primary/20 group-hover:scale-110 transition-all duration-500 object-contain" 
          />
          <div className="flex flex-col items-center">
            <span className="text-xl font-black tracking-tighter text-foreground leading-none mt-2">NOMANCE</span>
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/60 mt-2 italic">Real people. Real intentions.</span>
          </div>
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {links.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">
          &copy; {new Date().getFullYear()} NOMANCE. High Intent Connection.
        </div>
      </div>
    </footer>
  );
}
