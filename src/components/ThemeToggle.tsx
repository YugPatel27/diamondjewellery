import { useState, useEffect } from "react";
import { Sun, Moon } from "@/components/Icons";

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("dj_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("dj_theme", "light");
    }
  }, [dark]);

  useEffect(() => {
    const saved = localStorage.getItem("dj_theme");
    if (saved === "dark") {
      setDark(true);
    }
  }, []);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 text-foreground/70 hover:text-foreground transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
};

export default ThemeToggle;
