import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, MapPin, Bell, Shield, LogOut, ArrowLeft, Sparkles, ChevronRight, CheckCircle2, Clock } from "@/components/Icons";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { userAPI } from "@/lib/api";
import { toast } from "sonner";
import { SEOHead } from "@/components/SEOHead";

const ScrollReveal = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.08 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    smsAlerts: boolean;
    emailUpdates: boolean;
  };
  isVerified: boolean;
  kycStatus: string;
  createdAt: string;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "settings" | "security">("profile");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "India",
    pincode: user?.pincode || "",
    preferences: user?.preferences || {
      newsletter: true,
      notifications: true,
      smsAlerts: false,
      emailUpdates: true,
    },
    isVerified: user?.isVerified || false,
    kycStatus: user?.kycStatus || "none",
    createdAt: new Date().toISOString(),
  });

  const [formChanged, setFormChanged] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const response = await userAPI.getProfile();
      if (response.success && response.user) {
        setProfile({
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          address: response.user.address || "",
          city: response.user.city || "",
          state: response.user.state || "",
          country: response.user.country || "India",
          pincode: response.user.pincode || "",
          preferences: response.user.preferences || profile.preferences,
          isVerified: response.user.isVerified || false,
          kycStatus: response.user.kycStatus || "none",
          createdAt: response.user.createdAt,
        });
      }
    } catch (error) {
      toast.error("Failed to load your profile");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormChanged(true);
  };

  const handlePreferenceChange = (key: keyof typeof profile.preferences) => {
    setProfile((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: !prev.preferences[key],
      },
    }));
    setFormChanged(true);
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email || !profile.phone) {
      toast.error("Please provide your essential identification details");
      return;
    }

    setLoading(true);
    try {
      const response = await userAPI.updateProfile({
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        pincode: profile.pincode,
      });

      if (response.success) {
        toast.success("Identity profile refined successfully!");
        setFormChanged(false);
      } else {
        toast.error(response.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred during profile refinement");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setLoading(true);
    try {
      const response = await userAPI.updatePreferences({
        preferences: profile.preferences,
      });

      if (response.success) {
        toast.success("Communication preferences preserved!");
        setFormChanged(false);
      } else {
        toast.error(response.message || "Failed to save preferences");
      }
    } catch (error) {
      toast.error("An error occurred while saving preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Session concluded gracefully");
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Your Private Profile | Diamond Jewels" description="Manage your luxury jewellery profile and preferences." />
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <ScrollReveal>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-[2rem] bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-3xl font-heading shadow-xl shadow-accent/5">
                {profile.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 text-accent text-[10px] font-bold tracking-[0.2em] uppercase mb-1.5">
                  <Sparkles className="w-4 h-4" /> Exclusive Member
                </div>
                <h1 className="font-heading text-4xl font-light leading-tight">{profile.name}</h1>
                <p className="text-sm text-muted-foreground">Member since {new Date(profile.createdAt).getFullYear()}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/5 text-red-600 hover:bg-red-500/10 rounded-2xl transition-all font-bold tracking-widest text-[10px] uppercase border border-red-500/10"
            >
              <LogOut className="w-4 h-4" /> CONCLUDE SESSION
            </button>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Sidebar Nav */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: "profile" as const, label: "Private Identity", icon: <User className="w-4 h-4" /> },
              { id: "settings" as const, label: "Notification Suite", icon: <Bell className="w-4 h-4" /> },
              { id: "security" as const, label: "Vault Security", icon: <Shield className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-300 group ${
                  activeTab === tab.id
                    ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                    : "bg-card/20 border border-border/40 text-foreground/60 hover:border-accent/40 hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={activeTab === tab.id ? "" : "text-accent group-hover:scale-110 transition-transform"}>
                    {tab.icon}
                  </span>
                  <span className="text-xs font-bold tracking-widest uppercase">{tab.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 opacity-50 ${activeTab === tab.id ? "translate-x-1" : "group-hover:translate-x-1 transition-transform"}`} />
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="lg:col-span-9">
            <ScrollReveal>
              <div className="bg-card/20 backdrop-blur-sm border border-border/40 rounded-[2.5rem] p-8 sm:p-12 shadow-xl shadow-black/5">
                
                {activeTab === "profile" && (
                  <div className="space-y-10">
                    <div className="flex items-center justify-between pb-6 border-b border-border/10">
                      <h2 className="font-heading text-2xl font-light">Identity Credentials</h2>
                      <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold tracking-widest uppercase text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Authenticated
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Full Name</label>
                        <input type="text" name="name" value={profile.name} onChange={handleInputChange} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Private Email</label>
                        <input type="email" value={profile.email} disabled className="w-full px-6 py-4 bg-background/10 border border-border/20 rounded-2xl text-sm text-muted-foreground cursor-not-allowed" />
                        <p className="text-[9px] text-muted-foreground/60 italic ml-1">* Primary identifier cannot be modified</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Secure Contact</label>
                        <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Postal / ZIP Code</label>
                        <input type="text" name="pincode" value={profile.pincode} onChange={handleInputChange} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">Residence Address</label>
                        <textarea name="address" value={profile.address} onChange={(e: any) => handleInputChange(e)} rows={3} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all resize-none" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">City</label>
                        <input type="text" name="city" value={profile.city} onChange={handleInputChange} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold tracking-widest uppercase text-accent ml-1">State / Region</label>
                        <input type="text" name="state" value={profile.state} onChange={handleInputChange} className="w-full px-6 py-4 bg-background/50 border border-border/40 rounded-2xl text-sm outline-none focus:border-accent transition-all" />
                      </div>
                    </div>

                    <div className="pt-8 border-t border-border/10 flex flex-col sm:flex-row items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <p className="text-[11px] font-bold tracking-widest uppercase text-muted-foreground/60">KYC Status</p>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                          profile.kycStatus === "verified" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                        }`}>
                          {profile.kycStatus}
                        </span>
                      </div>
                      <button
                        onClick={handleSaveProfile}
                        disabled={!formChanged || loading}
                        className="btn-gold px-10 py-4 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-30"
                      >
                        {loading ? "PRESERVING..." : "REFINE IDENTITY"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "settings" && (
                  <div className="space-y-10">
                    <div className="pb-6 border-b border-border/10">
                      <h2 className="font-heading text-2xl font-light">Communication Suite</h2>
                      <p className="text-sm text-foreground/50 mt-2">Personalize how we inform you of new masterpieces</p>
                    </div>

                    <div className="space-y-4">
                      {[
                        { key: "newsletter" as const, label: "Collection Premieres", desc: "Be the first to see our newest arrivals and bespoke concepts" },
                        { key: "notifications" as const, label: "Acquisition Updates", desc: "Essential notifications regarding your order status and logistics" },
                        { key: "emailUpdates" as const, label: "Private Invitations", desc: "Invitations to exclusive in-store events and private viewings" },
                        { key: "smsAlerts" as const, label: "Instant SMS Alerts", desc: "Real-time mobile updates for critical delivery milestones" },
                      ].map((pref) => (
                        <div key={pref.key} className="flex items-center justify-between p-8 rounded-3xl border border-border/40 bg-background/30 hover:border-accent/40 transition-all duration-300">
                          <div className="max-w-md">
                            <p className="font-heading text-lg font-medium mb-1">{pref.label}</p>
                            <p className="text-xs text-foreground/50 leading-relaxed">{pref.desc}</p>
                          </div>
                          <button
                            onClick={() => handlePreferenceChange(pref.key)}
                            className={`relative w-14 h-7 rounded-full transition-all duration-500 flex items-center ${
                              profile.preferences[pref.key] ? "bg-accent" : "bg-foreground/10"
                            }`}
                          >
                            <div className={`absolute w-5 h-5 rounded-full bg-background shadow-md transition-all duration-500 ${
                              profile.preferences[pref.key] ? "left-8" : "left-1"
                            }`} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 flex justify-end">
                      <button
                        onClick={handleSavePreferences}
                        disabled={!formChanged || loading}
                        className="btn-gold px-10 py-4 text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-30"
                      >
                        {loading ? "PRESERVING..." : "SAVE PREFERENCES"}
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-10">
                    <div className="pb-6 border-b border-border/10">
                      <h2 className="font-heading text-2xl font-light">Vault Security</h2>
                      <p className="text-sm text-foreground/50 mt-2">Manage your account protection and access</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="p-8 rounded-3xl border border-border/40 bg-secondary/10">
                        <div className="flex items-center gap-3 mb-4 text-accent">
                          <Clock className="w-5 h-5" />
                          <p className="text-[10px] font-bold tracking-widest uppercase">Legacy Established</p>
                        </div>
                        <p className="text-sm text-foreground/60 mb-2">Member Account Created On</p>
                        <p className="font-heading text-xl font-medium">
                          {new Date(profile.createdAt).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {user?.isAdmin && (
                        <div className="p-8 rounded-3xl border border-accent/30 bg-accent/5">
                          <div className="flex items-center gap-3 mb-4 text-accent">
                            <Shield className="w-5 h-5" />
                            <p className="text-[10px] font-bold tracking-widest uppercase">Admin Privileges</p>
                          </div>
                          <p className="text-sm text-foreground/60 mb-2">Account Authority Level</p>
                          <p className="font-heading text-xl font-medium text-accent">Master Administrator</p>
                        </div>
                      )}
                    </div>

                    <div className="p-8 rounded-[2rem] border border-red-500/20 bg-red-500/5">
                      <h3 className="font-heading text-lg font-medium text-red-600 mb-2 flex items-center gap-2">
                        <Shield className="w-5 h-5" /> High Security Actions
                      </h3>
                      <p className="text-xs text-red-500/60 mb-6 max-w-md">Changing your primary authentication or concluding all active sessions globally.</p>
                      <div className="flex flex-wrap gap-4">
                        <button className="px-6 py-3 border border-red-500/30 text-red-600 rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-red-500/10 transition-all">
                          RESET CREDENTIALS
                        </button>
                        <button onClick={handleLogout} className="px-6 py-3 bg-red-600 text-white rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-red-700 transition-all shadow-lg shadow-red-500/20">
                          GLOBAL LOGOUT
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
