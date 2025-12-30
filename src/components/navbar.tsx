"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, MessageCircle, Search, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/social", label: "Social", icon: LayoutGrid },
    { href: "/messages", label: "Message", icon: MessageCircle },
    { href: "/search", label: "Search", icon: Search },
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/events", label: "Events", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 w-full border-t border-border bg-background/80 backdrop-blur-xl z-50">
      <div className="max-w-2xl mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex w-full items-center justify-between">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all hover:text-primary relative group ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative"
                  >
                    {link.label === "Search" ? (
                      <div className="p-2 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#cc2366] shadow-lg shadow-pink-500/20 group-hover:shadow-pink-500/40 transition-shadow">
                        <link.icon className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <link.icon className={`w-6 h-6 ${isActive ? 'drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]' : ''}`} />
                    )}
                  </motion.div>
                  <span className="hidden lg:inline">{link.label}</span>
                  
                  {isActive && link.label !== "Search" && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation Tabs (Icons only) */}
          <div className="flex md:hidden w-full h-full items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex-1 h-full flex items-center justify-center transition-all ${
                    link.label === "Search" 
                      ? "" 
                      : isActive 
                        ? "text-primary" 
                        : "text-muted-foreground"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    animate={isActive && link.label !== "Search" ? { y: [-2, 0, -2] } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                  >
                    {link.label === "Search" ? (
                      <motion.div 
                        whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                        className="p-4 rounded-[2rem] bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#cc2366] shadow-2xl shadow-pink-500/30 -translate-y-5 active:scale-95 transition-all"
                      >
                        <link.icon className="w-9 h-9 text-white" />
                      </motion.div>
                    ) : (
                      <link.icon className={`w-8 h-8 ${isActive ? 'drop-shadow-[0_0_12px_rgba(var(--primary),0.6)]' : ''}`} />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

