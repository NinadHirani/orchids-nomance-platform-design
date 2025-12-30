"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Loader2, ArrowLeft, Heart, Zap, Sparkles, 
  Moon, Dumbbell, Wine, Cigarette, Info,
  Trophy, Target, UserCheck
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (params?.id) {
      fetchProfile(params.id as string);
    }
  }, [params?.id]);

  const fetchProfile = async (id: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Profile not found");
      router.push("/social");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (!profile) return null;

  const strength = profile.profile_strength || 80;
  
  const lifestyleItems = [
    { icon: <Moon className="w-4 h-4" />, label: "Sleep", value: profile.lifestyle?.sleep || "Not specified" },
    { icon: <Dumbbell className="w-4 h-4" />, label: "Fitness", value: profile.lifestyle?.fitness || "Not specified" },
    { icon: <Wine className="w-4 h-4" />, label: "Drinking", value: profile.lifestyle?.drinking || "Not specified" },
    { icon: <Cigarette className="w-4 h-4" />, label: "Smoking", value: profile.lifestyle?.smoking || "Not specified" },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <Navbar />
      
      {/* Extraordinary Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <main className="container mx-auto px-4 pt-24 max-w-4xl relative z-10">
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()} 
            className="rounded-full gap-2 hover:bg-secondary/50 text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-border">Report</Button>
            <Button variant="outline" className="rounded-full border-border">Share</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visuals & Core Stats */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative group">
              <div className="aspect-[3/4] rounded-[3rem] overflow-hidden border-4 border-card shadow-2xl">
                <img 
                  src={profile.avatar_url || "https://images.unsplash.com/photo-1516245834210-c4c142787335?w=800&q=80"} 
                  alt={profile.full_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 bg-foreground text-background p-4 rounded-3xl shadow-2xl flex items-center gap-2 border-4 border-background">
                <Zap className="w-6 h-6 fill-current text-primary" />
                <span className="font-black text-xl italic tracking-tighter">9.8</span>
              </div>
            </div>

            {/* Profile Depth Meter */}
            <Card className="rounded-[2.5rem] bg-card/50 backdrop-blur-xl border-border overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className="font-black uppercase text-[10px] tracking-widest text-muted-foreground">Depth Meter</span>
                  </div>
                  <span className="font-black text-primary">Profile strength: {strength}%</span>
                </div>
                <div className="h-3 w-full bg-secondary/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${strength}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-primary to-purple-600"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-4 italic text-center">
                  This profile has been verified for high intentionality.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Bio & Details */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-5xl font-black italic tracking-tighter text-foreground">{profile.full_name}</h1>
                <UserCheck className="w-8 h-8 text-primary" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary/10 text-primary border-none">
                  {profile.gender || "Human"}
                </Badge>
                <Badge variant="secondary" className="px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-600/10 text-purple-600 border-none">
                  {profile.birth_date ? `${new Date().getFullYear() - new Date(profile.birth_date).getFullYear()} Years` : "Ageless"}
                </Badge>
              </div>
            </div>

            {/* Intent Tags */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="font-black uppercase text-xs tracking-widest text-foreground">Intentional Frequency</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {(profile.intents && profile.intents.length > 0 ? profile.intents : ["serious", "casual", "explore", "marriage", "friends"]).map((intent: string) => (
                  <Badge 
                    key={intent}
                    className="px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] bg-card border-2 border-border text-foreground hover:border-primary transition-all cursor-default"
                  >
                    {intent}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
               <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                <span className="font-black uppercase text-xs tracking-widest text-foreground">Aura & Story</span>
              </div>
              <p className="text-xl leading-relaxed text-muted-foreground italic font-medium">
                &quot;{profile.bio || "This intentional user prefers to let their frequency speak for itself. A mystery waiting to be unraveled."}&quot;
              </p>
            </div>

            {/* Lifestyle Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="font-black uppercase text-xs tracking-widest text-foreground">Lifestyle Synchronicity</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {lifestyleItems.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 rounded-3xl bg-card/40 border border-border backdrop-blur-md">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</p>
                      <p className="text-sm font-bold text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Values */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <span className="font-black uppercase text-xs tracking-widest text-foreground">Foundational Values</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(profile.values || ["Honesty", "Growth", "Adventure"]).map((val: string) => (
                  <span key={val} className="px-5 py-2 rounded-full bg-secondary/20 text-foreground font-bold text-sm">
                    {val}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-8 flex gap-4">
               <Button className="flex-1 h-16 rounded-[2rem] bg-foreground text-background font-black text-lg uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex gap-3 shadow-xl">
                 <Heart className="w-6 h-6 fill-current" />
                 Send Spark
               </Button>
               <Button variant="outline" className="w-16 h-16 rounded-[2rem] border-2 border-border flex items-center justify-center hover:bg-secondary/20">
                 <Zap className="w-6 h-6" />
               </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
