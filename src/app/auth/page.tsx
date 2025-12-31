"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Zap, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Suspense } from "react";

function AuthContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [checkingSession, setCheckingSession] = useState(true);
  const router = useRouter();
  
  // 3D Parallax Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 30 });
  
  // Layer translations
  const layer1X = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const layer1Y = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  const layer2X = useTransform(mouseX, [-0.5, 0.5], [-25, 25]);
  const layer2Y = useTransform(mouseY, [-0.5, 0.5], [-25, 25]);
  const layer3X = useTransform(mouseX, [-0.5, 0.5], [-40, 40]);
  const layer3Y = useTransform(mouseY, [-0.5, 0.5], [-40, 40]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace("/social");
      }
      setCheckingSession(false);
    };
    checkUser();
  }, [router]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    x.set(mouseXVal / width - 0.5);
    y.set(mouseYVal / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast.success("Frequency initialized! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Frequency aligned! Welcome back.");
        router.push("/social");
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden px-4 py-12">
      {/* Background Aura */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            style={{ x: layer1X, y: layer1Y }}
            className="relative inline-flex items-center justify-center mb-6"
          >
            {/* Aesthetic Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[40px] rounded-full animate-pulse" />
            
            <motion.img
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/logo-1767110846410.png?width=8000&height=8000&resize=contain"
              alt="Nomance Logo"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-24 h-24 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(var(--primary),0.3)]"
            />
          </motion.div>
          <motion.div style={{ x: layer2X, y: layer2Y }}>
            <h1 className="text-4xl font-black italic tracking-tighter text-foreground mb-1">NOMANCE</h1>
            <p className="text-muted-foreground font-medium tracking-tight uppercase text-[10px] tracking-[0.3em]">Align Your Frequency</p>
          </motion.div>
        </div>

        <motion.div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group"
          style={{ perspective: 1000 }}
        >
          {/* 3D Background Layers */}
          <motion.div 
            style={{ x: layer1X, y: layer1Y }}
            className="absolute -inset-4 bg-primary/5 blur-2xl rounded-[4rem] z-0"
          />
          <motion.div 
            style={{ x: layer2X, y: layer2Y }}
            className="absolute -inset-8 bg-purple-600/5 blur-3xl rounded-[5rem] z-0"
          />

          <Card className="bg-card/80 border-border backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 border-white/10">
            {/* Holographic Logo Reflection */}
            <motion.div 
              style={{ x: layer3X, y: layer3Y, opacity: 0.03 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
            >
              <img 
                src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/logo-1767110846410.png"
                alt=""
                className="w-[150%] h-[150%] object-contain grayscale blur-3xl scale-150"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <CardHeader className="p-8 pb-0 relative">
              <motion.div style={{ x: layer1X, y: layer1Y }}>
                <CardTitle className="text-2xl font-black tracking-tighter italic">
                  {isSignUp ? "Create Aura" : "Welcome Back"}
                </CardTitle>
                <CardDescription className="font-medium">
                  {isSignUp ? "Join the intentional connection space" : "Continue your journey of depth"}
                </CardDescription>
              </motion.div>

              {/* 3D Floating Ornament */}
              <motion.div
                style={{ x: layer3X, y: layer3Y }}
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center opacity-20"
              >
                <div className="absolute inset-0 bg-primary blur-xl rounded-full" />
                <Sparkles className="w-8 h-8 text-primary relative z-10" />
              </motion.div>
            </CardHeader>

            <CardContent className="p-8 relative">
              <form onSubmit={handleAuth} className="space-y-6">
                <motion.div style={{ x: layer1X, y: layer1Y }} className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Frequency</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="aura@nomance.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background/50 border-border rounded-2xl h-14 backdrop-blur-xl font-bold focus:ring-primary/20 transition-all"
                  />
                </motion.div>
                
                <motion.div style={{ x: layer2X, y: layer2Y }} className="space-y-2">
                  <Label htmlFor="password" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Secure Core</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-background/50 border-border rounded-2xl h-14 backdrop-blur-xl font-bold focus:ring-primary/20 transition-all"
                  />
                </motion.div>

                <motion.div style={{ x: layer3X, y: layer3Y }}>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl bg-foreground text-background font-black text-[12px] uppercase tracking-[0.2em] shadow-xl hover:shadow-primary/10 transition-all group overflow-hidden relative"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2 relative z-10">
                        {isSignUp ? "Initialize Frequency" : "Establish Connection"}
                        <Zap className="w-4 h-4 fill-current group-hover:scale-125 transition-transform" />
                      </span>
                    )}
                    <motion.div 
                      className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity"
                    />
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="p-8 pt-0 flex flex-col gap-6 relative">
              <motion.div style={{ x: layer1X, y: layer1Y }} className="w-full space-y-6">
                <div className="flex items-center gap-4 w-full">
                  <div className="h-px bg-border flex-1" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Transition</span>
                  <div className="h-px bg-border flex-1" />
                </div>
                
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="w-full text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
                >
                  {isSignUp ? "Already have an aura? Establish connection" : "New frequency? Create your aura"}
                </button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>

        <div className="mt-8 flex items-center justify-center gap-8 px-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Intent</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest">Authentic Souls</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    }>
      <AuthContent />
    </Suspense>
  );
}
