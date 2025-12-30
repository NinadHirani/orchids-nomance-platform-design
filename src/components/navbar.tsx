"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Users, MessageCircle, Search, LayoutGrid } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function Navbar() {
  const pathname = usePathname();

  const leftNavLinks = [
    { href: "/social", label: "Social", icon: LayoutGrid },
    { href: "/messages", label: "Message", icon: MessageCircle },
  ];

  const searchNavLink = { href: "/search", label: "Search", icon: Search };

  const rightNavLinks = [
    { href: "/matches", label: "Matches", icon: Heart },
    { href: "/events", label: "Events", icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-50 pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 w-full pointer-events-auto">
        <div className="h-20 flex items-end">
          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex w-full h-16 items-center justify-between border-t border-border bg-background/80 backdrop-blur-xl px-8 rounded-t-[2rem]">
            {[...leftNavLinks, searchNavLink, ...rightNavLinks].map((link) => {
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
                      whileHover={{ scale: 1.25, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      animate={link.label === "Search" ? { scale: [1, 1.05, 1] } : {}}
                      transition={link.label === "Search" ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
                      className="relative"
                    >
                      {link.label === "Search" ? (
                        <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#cc2366] shadow-xl shadow-pink-500/30 group-hover:shadow-pink-500/50 transition-all border-2 border-white/20">
                          <link.icon className="w-7 h-7 text-white" />
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

          {/* Mobile Navigation Tabs (Icons only) - Stepped Design */}
          <div className="flex md:hidden w-full h-16 items-center relative gap-0">
            {/* Left Section */}
            <div className="flex-1 flex h-full items-center justify-around bg-background/90 backdrop-blur-2xl border-t border-r border-border rounded-tr-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              {leftNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex-1 h-full flex items-center justify-center transition-all ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isActive ? { y: [-1, 0, -1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <link.icon className={`w-7 h-7 ${isActive ? 'drop-shadow-[0_0_12px_rgba(var(--primary),0.6)]' : ''}`} />
                    </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* Center "Step" for Search */}
            <div className="relative w-24 h-full flex items-center justify-center">
              {/* Invisible notch background to maintain layout */}
              <div className="absolute top-0 inset-x-0 h-full bg-transparent" />
              
              <Link
                href={searchNavLink.href}
                className="relative z-10"
              >
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }}
                    whileTap={{ scale: 0.9 }}
                    animate={{ scale: [1, 1.05, 1], y: [-32, -36, -32] }}
                    transition={{ 
                      scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                      y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="p-7 rounded-[3rem] bg-gradient-to-tr from-primary via-purple-600 to-pink-500 shadow-[0_25px_60px_rgba(var(--primary),0.5)] border-4 border-background active:scale-95 transition-all relative z-20"
                  >
                    <searchNavLink.icon className="w-10 h-10 text-white" />
                    {/* Inner Glow */}
                    <div className="absolute inset-0 rounded-[3rem] ring-4 ring-white/20 ring-inset pointer-events-none" />
                  </motion.div>
              </Link>
              
              {/* Decorative Step/Connector */}
              <div className="absolute bottom-0 w-full h-full border-b border-border pointer-events-none" />
            </div>

            {/* Right Section */}
            <div className="flex-1 flex h-full items-center justify-around bg-background/90 backdrop-blur-2xl border-t border-l border-border rounded-tl-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              {rightNavLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex-1 h-full flex items-center justify-center transition-all ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate={isActive ? { y: [-1, 0, -1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <link.icon className={`w-7 h-7 ${isActive ? 'drop-shadow-[0_0_12px_rgba(var(--primary),0.6)]' : ''}`} />
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

