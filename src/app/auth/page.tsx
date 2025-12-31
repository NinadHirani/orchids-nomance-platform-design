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
  
  // 3D Tilt Values
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

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
          <h1 className="text-4xl font-black italic tracking-tighter text-foreground mb-1">NOMANCE</h1>
          <p className="text-muted-foreground font-medium tracking-tight uppercase text-[10px] tracking-[0.3em]">Align Your Frequency</p>
        </div>

        <motion.div
          style={{
            rotateX,
            rotateY,
            perspective: 1000,
          }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative group"
        >
          {/* 3D Reflection Effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-[3rem] blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <Card className="bg-card border-border backdrop-blur-3xl rounded-[3rem] overflow-hidden shadow-2xl relative">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-black tracking-tighter italic">
                {isSignUp ? "Create Aura" : "Welcome Back"}
              </CardTitle>
              <CardDescription className="font-medium">
                {isSignUp ? "Join the intentional connection space" : "Continue your journey of depth"}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleAuth} className="space-y-6">
                <div className="space-y-2">
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
                </div>
                <div className="space-y-2">
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
                </div>

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
              </form>
            </CardContent>
            <CardFooter className="p-8 pt-0 flex flex-col gap-6">
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-border flex-1" />
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Transition</span>
                <div className="h-px bg-border flex-1" />
              </div>
              
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2"
              >
                {isSignUp ? "Already have an aura? Establish connection" : "New frequency? Create your aura"}
              </button>
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
