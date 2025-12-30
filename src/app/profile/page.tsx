"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Camera, MapPin, ShieldCheck, Heart, Sparkles, User, Info } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const INTENTS = [
  { value: "life_partnership", label: "Life Partnership" },
  { value: "dating", label: "Dating" },
  { value: "friendship", label: "Friendship" },
];

const AVAILABLE_VALUES = [
  "Kindness", "Ambition", "Family", "Adventure", "Creativity", 
  "Honesty", "Growth", "Freedom", "Stability", "Humor"
];

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({
    full_name: "",
    bio: "",
    intent: "life_partnership",
    gender: "other",
    birth_date: "",
    values: [],
    avatar_url: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      const activeUserId = authUser?.id || "00000000-0000-0000-0000-000000000001";
      setUser(authUser || { id: activeUserId, email: "guest@example.com" });

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", activeUserId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          bio: data.bio || "",
          intent: data.intent || "life_partnership",
          gender: data.gender || "other",
          birth_date: data.birth_date || "",
          values: data.values || [],
          avatar_url: data.avatar_url || ""
        });
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      const { error } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          ...profile,
          last_active: new Date().toISOString()
        });

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const toggleValue = (value: string) => {
    setProfile((prev: any) => ({
      ...prev,
      values: prev.values.includes(value)
        ? prev.values.filter((v: string) => v !== value)
        : [...prev.values, value].slice(0, 5) // Limit to 5 values
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isGuest = user?.id === "00000000-0000-0000-0000-000000000001";

  return (
    <div className="min-h-screen bg-background pb-20">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 max-w-3xl">
        <header className="mb-8 flex flex-col items-center">
          <div className="relative group mb-6">
            <div className="w-32 h-32 rounded-3xl bg-secondary/30 overflow-hidden border-4 border-background shadow-xl">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-primary/5">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
            <button className="absolute bottom-2 right-2 bg-primary text-primary-foreground p-2 rounded-xl shadow-lg hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-1">{profile.full_name || "New Member"}</h1>
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Profile {profile.full_name ? "85% Complete" : "Incomplete"}</span>
            {isGuest && (
              <Badge variant="secondary" className="ml-2 bg-orange-500/10 text-orange-600 border-none">Guest Access</Badge>
            )}
          </div>
        </header>

        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/50">
              <CardTitle className="text-xl">Basic Information</CardTitle>
              <CardDescription>Tell us about yourself to help find better matches.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Full Name</label>
                  <Input 
                    placeholder="Enter your name" 
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="rounded-xl border-border focus:ring-primary h-11"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Birth Date</label>
                  <Input 
                    type="date"
                    value={profile.birth_date}
                    onChange={(e) => setProfile({...profile, birth_date: e.target.value})}
                    className="rounded-xl border-border focus:ring-primary h-11"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Gender</label>
                  <Select 
                    value={profile.gender} 
                    onValueChange={(value) => setProfile({...profile, gender: value})}
                  >
                    <SelectTrigger className="rounded-xl h-11 border-border">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      <SelectItem value="man">Man</SelectItem>
                      <SelectItem value="woman">Woman</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-muted-foreground">Intent</label>
                  <Select 
                    value={profile.intent} 
                    onValueChange={(value) => setProfile({...profile, intent: value})}
                  >
                    <SelectTrigger className="rounded-xl h-11 border-border">
                      <SelectValue placeholder="What are you looking for?" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-border">
                      {INTENTS.map((intent) => (
                        <SelectItem key={intent.value} value={intent.value}>
                          {intent.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-sm font-semibold text-muted-foreground flex justify-between">
                  Bio <span>{profile.bio.length}/500</span>
                </label>
                <Textarea 
                  placeholder="Share your story, interests, and what makes you unique..." 
                  className="rounded-xl border-border min-h-[120px] resize-none"
                  maxLength={500}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-secondary/10 border-b border-border/50">
              <CardTitle className="text-xl">Values & Beliefs</CardTitle>
              <CardDescription>Select up to 5 core values that define you.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_VALUES.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => toggleValue(val)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all border-2 ${
                      profile.values.includes(val)
                        ? "bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20"
                        : "bg-background border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 italic">
                Values help our AI Coach find deeper compatibility matches for you.
              </p>
            </CardContent>
          </Card>

          <div className="flex gap-4 pt-4">
            <Button 
              type="submit" 
              className="flex-1 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
              disabled={saving}
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
              Save My Profile
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              className="h-14 px-8 rounded-2xl border-2 border-border font-bold text-muted-foreground"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </div>
        </form>

        <section className="mt-12 pt-8 border-t border-border">
          <div className="bg-secondary/20 rounded-3xl p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Intentional Dating Tip</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Completed profiles receive 4x more quality matches. High-intent members value detail and transparency.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
