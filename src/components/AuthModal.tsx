import { useState } from "react";
import { X, Mail, Phone, User, Lock, CheckSquare } from "@/components/Icons";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type AuthTab = "login" | "register";

const AuthModal = () => {
  const { isAuthOpen, closeAuth, login, register } = useAuth();
  const { addLog } = useActivityLog();
  const [tab, setTab] = useState<AuthTab>("login");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: "",
  });

  if (!isAuthOpen) return null;

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      addLog({
        action: "User Login",
        description: `Logged in with email: ${form.email}`,
        userName: form.email,
      });
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Collect all validation errors
    const errors: string[] = [];

    if (!form.name || !form.email || !form.phone || !form.password || !form.confirmPassword) {
      errors.push("Please fill all fields");
    }
    if (!consent) {
      errors.push("Please accept the data consent to proceed");
    }
    if (form.password !== form.confirmPassword) {
      errors.push("Passwords do not match");
    }
    if (form.password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(form.password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/[a-z]/.test(form.password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/\d/.test(form.password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(form.password)) {
      errors.push("Password must contain at least one special character");
    }

    // Show single combined error message if validation failed
    if (errors.length > 0) {
      toast.error(errors.join(" • "));
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      addLog({
        action: "Account Created",
        description: `Registered with email: ${form.email}`,
        userName: form.name,
      });
      toast.success("Account created successfully!");
      resetForm();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setConsent(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={closeAuth}>
      <div className="bg-gradient-to-br from-card via-card to-secondary/10 border border-accent/20 w-[95%] max-w-2xl max-h-[95vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-accent/10 bg-gradient-to-r from-accent/5 to-transparent">
          <h2 className="font-heading text-3xl font-light tracking-wide text-accent">{tab === "login" ? "Welcome Back" : "Create Account"}</h2>
          <button onClick={() => { closeAuth(); resetForm(); }} className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Close authentication dialog">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tab switcher */}
          <div className="grid grid-cols-2 gap-2 bg-secondary/30 p-1 rounded-lg">
            <button onClick={() => setTab("login")} className={`py-4 text-base font-medium tracking-wider uppercase rounded transition-all duration-300 ${tab === "login" ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
              Login
            </button>
            <button onClick={() => setTab("register")} className={`py-4 text-base font-medium tracking-wider uppercase rounded transition-all duration-300 ${tab === "register" ? "bg-gradient-to-r from-accent to-accent/80 text-accent-foreground shadow-lg shadow-accent/20" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}>
              Register
            </button>
          </div>

          {/* Form fields */}
          {tab === "register" && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-accent" />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={form.name} 
                onChange={(e) => update("name", e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 border border-accent/20 bg-secondary/30 text-base outline-none focus:border-accent focus:bg-secondary/50 transition-all duration-300 rounded hover:border-accent/40 disabled:opacity-50" 
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-accent" />
            <input 
              type="email" 
              placeholder="Email Address" 
              value={form.email} 
              onChange={(e) => update("email", e.target.value)}
              disabled={loading}
              className="w-full pl-12 pr-4 py-4 border border-accent/20 bg-secondary/30 text-base outline-none focus:border-accent focus:bg-secondary/50 transition-all duration-300 rounded hover:border-accent/40 disabled:opacity-50" 
            />
          </div>

          {tab === "register" && (
            <div className="relative group">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-accent" />
              <input 
                type="tel" 
                placeholder="+91 Mobile Number" 
                value={form.phone} 
                onChange={(e) => update("phone", e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 border border-accent/20 bg-secondary/30 text-base outline-none focus:border-accent focus:bg-secondary/50 transition-all duration-300 rounded hover:border-accent/40 disabled:opacity-50" 
              />
            </div>
          )}

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-accent" />
            <input 
              type="password" 
              placeholder="Password (min 8 chars, A-z, 0-9, !@#)" 
              value={form.password} 
              onChange={(e) => update("password", e.target.value)}
              disabled={loading}
              className="w-full pl-12 pr-4 py-4 border border-accent/20 bg-secondary/30 text-base outline-none focus:border-accent focus:bg-secondary/50 transition-all duration-300 rounded hover:border-accent/40 disabled:opacity-50" 
            />
          </div>

          {tab === "register" && (
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent group-focus-within:text-accent" />
              <input 
                type="password" 
                placeholder="Confirm Password" 
                value={form.confirmPassword} 
                onChange={(e) => update("confirmPassword", e.target.value)}
                disabled={loading}
                className="w-full pl-12 pr-4 py-4 border border-accent/20 bg-secondary/30 text-base outline-none focus:border-accent focus:bg-secondary/50 transition-all duration-300 rounded hover:border-accent/40 disabled:opacity-50" 
              />
            </div>
          )}

          {/* Data Consent Checkbox */}
          {tab === "register" && (
            <label className="flex items-start gap-3 cursor-pointer group p-4 rounded-lg border border-accent/10 bg-accent/5 hover:bg-accent/10 transition-colors">
              <div
                onClick={() => setConsent(!consent)}
                className={`mt-0.5 w-5 h-5 flex-shrink-0 border-2 rounded flex items-center justify-center transition-all duration-300 ${consent ? "bg-gradient-to-br from-accent to-accent/80 border-accent shadow-lg shadow-accent/20" : "border-accent/30 group-hover:border-accent/60"}`}
              >
                {consent && <CheckSquare className="w-4 h-4 text-accent-foreground" />}
              </div>
              <span className="text-sm text-muted-foreground leading-relaxed">
                I consent to the collection and use of my personal data (name, email, phone number) for order processing, customer service, and account management as described in the{" "}
                <span onClick={(e) => e.stopPropagation()} className="inline">
                  <Link to="/privacy-policy" className="text-accent underline" target="_blank">Privacy Policy</Link>
                </span>{" "}
                and{" "}
                <span onClick={(e) => e.stopPropagation()} className="inline">
                  <Link to="/terms-of-service" className="text-accent underline" target="_blank">Terms of Service</Link>
                </span>.
              </span>
            </label>
          )}

          <button 
            onClick={tab === "login" ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-base font-semibold tracking-widest uppercase hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 disabled:opacity-50 rounded-lg"
          >
            {loading ? "Please wait..." : (tab === "login" ? "Login" : "Create Account")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
