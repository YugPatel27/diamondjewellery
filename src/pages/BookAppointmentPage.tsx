import { useEffect, useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle, AlertCircle } from "@/components/Icons";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useActivityLog } from "@/contexts/ActivityLogContext";
import { appointmentAPI } from "@/lib/api";

const store = {
  name: "DiamondJewels London",
  address: "C.G. Road, Navrangpura, London - 380009, Greater London",
  phone: "+91-79-XXXX-5555",
  hours: "Mon-Sat: 10:00 AM – 8:00 PM | Sunday: 11:00 AM – 6:00 PM",
  email: "appointments@diamondjewels.in",
};

const timeSlots = ["10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"];

const BookAppointmentPage = () => {
  const { user, openAuth } = useAuth();
  const { addLog } = useActivityLog();
  const [form, setForm] = useState({ name: "", email: "", phone: "", date: "", time: "", purpose: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    let mounted = true;
    if (!form.date) {
      setBookedSlots([]);
      return;
    }
    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        const response = await appointmentAPI.getBookedSlots(form.date);
        if (mounted && response.success) setBookedSlots(response.slots || []);
      } catch (error) {
        if (mounted) {
          setBookedSlots([]);
          toast.error("Failed to load slot availability");
        }
      } finally {
        if (mounted) setLoadingSlots(false);
      }
    };
    fetchBookedSlots();
    return () => { mounted = false; };
  }, [form.date]);

  const slotStates = useMemo(() => {
    if (!form.date) return [];
    const now = new Date();
    const selectedDate = new Date(form.date + "T00:00:00");
    const isToday = selectedDate.toDateString() === now.toDateString();

    return timeSlots.map((slot) => {
      const isBooked = bookedSlots.includes(slot);
      let isPast = false;

      if (isToday) {
        const [hourStr, period] = slot.split(" ");
        const [h, m] = hourStr.split(":").map(Number);
        let hour24 = h;
        if (period === "PM" && h !== 12) hour24 += 12;
        if (period === "AM" && h === 12) hour24 = 0;
        const slotTime = new Date(now);
        slotTime.setHours(hour24, m, 0, 0);
        isPast = slotTime <= now;
      }

      return {
        slot,
        isBooked,
        isPast,
        isDisabled: isBooked || isPast
      };
    });
  }, [form.date, bookedSlots]);

  const availableSlotsCount = slotStates.filter((s) => !s.isDisabled).length;

  useEffect(() => {
    if (!form.time) return;
    const selected = slotStates.find((item) => item.slot === form.time);
    if (selected?.isDisabled) {
      setForm((prev) => ({ ...prev, time: "" }));
    }
  }, [form.time, slotStates]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Collect all validation errors
    const errors: string[] = [];

    if (!user) {
      errors.push("Please login to book an appointment");
    }
    if (!form.name || !form.email || !form.phone || !form.date || !form.time) {
      errors.push("Please fill all required fields");
    }

    // Only proceed with date/slot validation if basic fields are filled
    if (!errors.length || (errors.length && form.date && form.time)) {
      // Validate date is not in the past
      if (form.date) {
        const selectedDate = new Date(form.date + "T00:00:00");
        const todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);
        if (selectedDate < todayDate) {
          errors.push("Cannot book appointment in the past");
        }
      }

      // Check for double booking
      if (form.time && bookedSlots.includes(form.time)) {
        errors.push("This time slot is already booked. Please select another time");
      }

      // Check slot availability
      if (form.time) {
        const selectedSlot = slotStates.find((item) => item.slot === form.time);
        if (!selectedSlot || selectedSlot.isDisabled) {
          errors.push("This slot is unavailable. Please select another time");
        }
      }
    }

    // Show single combined error if validation failed
    if (errors.length > 0) {
      if (errors.includes("Please login to book an appointment")) {
        openAuth();
      }
      toast.error(errors.join(" • "));
      return;
    }

    setSubmitting(true);
    try {
      const appointmentData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        date: new Date(form.date),
        time: form.time,
        message: `Purpose: ${form.purpose || "General"} | Notes: ${form.notes || "None"}`
      };

      const response = await appointmentAPI.create(appointmentData);
      
      if (response.success) {
        setBookedSlots((prev) => (prev.includes(form.time) ? prev : [...prev, form.time]));

        addLog({
          userName: user.name,
          userPhone: user.phone,
          action: "Appointment Booked",
          description: `${store.name} on ${form.date} at ${form.time} | Purpose: ${form.purpose || "General"} | Notes: ${form.notes || "None"}`,
        });
        
        toast.success("Appointment booked! Confirmation email sent. 🎉");
        setSubmitted(true);
      } else {
        toast.error(response.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Appointment booking error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to book appointment");
    } finally {
      setSubmitting(false);
    }
  };

  const purposes = ["Diamond Consultation", "Engagement Ring Selection", "Custom Design / Bespoke", "Jewellery Repair", "Diamond Certification Inquiry", "General Visit"];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl opacity-50" />
      </div>

      <Header />
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground px-4 sm:px-6 py-3 relative z-10">
        <Link to="/" className="hover:text-foreground transition-colors">Home</Link><span>/</span>
        <span className="text-foreground">Book Appointment</span>
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 mb-4">
            <Calendar className="w-8 h-8 text-accent" />
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-light">Book an Appointment</h1>
          <p className="text-sm text-muted-foreground mt-3">Visit us at our London store for a personalised diamond consultation</p>
          <div className="flex gap-1 justify-center mt-4">
            <div className="w-8 h-1 bg-gradient-to-r from-accent/20 via-accent to-accent/20 rounded" />
          </div>
        </div>

        {/* Store card */}
        <div className="border border-accent/30 bg-gradient-to-br from-accent/5 via-background to-accent/10 p-6 sm:p-8 mb-10 max-w-2xl mx-auto relative group hover:border-accent/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="font-heading text-xl font-medium mb-4 relative z-10">{store.name}</h3>
          <div className="space-y-3 text-sm text-muted-foreground relative z-10">
            <p className="flex items-start gap-3 group/item hover:text-accent transition-colors duration-300">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent group-hover/item:scale-110 transition-transform duration-300" />
              <span>{store.address}</span>
            </p>
            <p className="flex items-center gap-3 group/item hover:text-accent transition-colors duration-300">
              <Phone className="w-5 h-5 flex-shrink-0 text-accent group-hover/item:scale-110 transition-transform duration-300" />
              <span>{store.phone}</span>
            </p>
            <p className="flex items-center gap-3 group/item hover:text-accent transition-colors duration-300">
              <Mail className="w-5 h-5 flex-shrink-0 text-accent group-hover/item:scale-110 transition-transform duration-300" />
              <span>{store.email}</span>
            </p>
            <p className="flex items-start gap-3 group/item hover:text-accent transition-colors duration-300">
              <Clock className="w-5 h-5 mt-0.5 flex-shrink-0 text-accent group-hover/item:scale-110 transition-transform duration-300" />
              <span>{store.hours}</span>
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-16 border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-accent/5 max-w-2xl mx-auto animate-in zoom-in-95 duration-500 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 mb-4">
                <CheckCircle className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <h2 className="font-heading text-2xl font-medium">Appointment Confirmed!</h2>
              <p className="text-sm text-muted-foreground mt-2">{store.name}</p>
              <p className="text-sm text-foreground font-medium mt-1">{form.date} at {form.time}</p>
              {form.purpose && <p className="text-xs text-muted-foreground mt-2">Purpose: {form.purpose}</p>}
              {form.notes && <p className="text-xs text-muted-foreground mt-1">Notes: {form.notes}</p>}
              <p className="text-xs text-muted-foreground mt-4">Confirmation email sent to {form.email}</p>
              <div className="flex gap-3 justify-center mt-6">
                <Link to="/" className="px-6 py-3 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs tracking-widest uppercase hover:shadow-lg hover:shadow-accent/30 transition-all duration-300 hover:scale-105">
                  Continue Shopping
                </Link>
                <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", date: "", time: "", purpose: "", notes: "" }); }} className="px-6 py-3 border border-accent/30 text-xs tracking-widest uppercase hover:bg-accent/10 hover:border-accent/50 transition-all duration-300">
                  Book Another
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {/* Step indicators */}
            <div className="flex items-center justify-center gap-4 sm:gap-8 mb-10 animate-in fade-in slide-in-from-top-2 duration-700">
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-accent/20 group-hover:shadow-accent/40 transition-all duration-300 group-hover:scale-110">1</div>
                <span className="text-xs font-medium text-center">Your Details</span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-accent/50 via-accent to-accent/50 max-w-32" />
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary/80 text-muted-foreground flex items-center justify-center text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-secondary/10 group-hover:scale-105 transition-all duration-300">2</div>
                <span className="text-xs text-muted-foreground text-center">Date & Time</span>
              </div>
              <div className="flex-1 h-0.5 bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20" />
              <div className="flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary/80 text-muted-foreground flex items-center justify-center text-xs sm:text-sm font-bold rounded-full shadow-lg shadow-secondary/10 group-hover:scale-105 transition-all duration-300">3</div>
                <span className="text-xs text-muted-foreground text-center">Confirm</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Personal details */}
              <div className="border border-accent/20 bg-gradient-to-br from-background via-accent/2 to-accent/5 p-6 sm:p-8 relative group hover:border-accent/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded" />
                <h3 className="text-sm font-medium mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center text-[11px] font-bold rounded-full shadow-md shadow-accent/20">1</div>
                  Your Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <input type="text" placeholder="Full Name *" value={form.name} onChange={(e) => update("name", e.target.value)} className="px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30" />
                  <input type="email" placeholder="Email *" value={form.email} onChange={(e) => update("email", e.target.value)} className="px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30" />
                  <input type="tel" placeholder="Phone *" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30 sm:col-span-2" />
                </div>
              </div>

              {/* Date, time & purpose */}
              <div className="border border-accent/20 bg-gradient-to-br from-background via-accent/2 to-accent/5 p-6 sm:p-8 relative group hover:border-accent/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded" />
                <h3 className="text-sm font-medium mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center text-[11px] font-bold rounded-full shadow-md shadow-accent/20">2</div>
                  Select Date & Time
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative z-10">
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block font-semibold">Preferred Date *</label>
                    <input type="date" min={today} value={form.date} onChange={(e) => { update("date", e.target.value); update("time", ""); }} className="w-full px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2 block font-semibold">Purpose</label>
                    <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className="w-full px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30">
                      <option value="">Select Purpose</option>
                      {purposes.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                {form.date && (
                  <div className="mt-6">
                    <label className="text-[10px] text-muted-foreground uppercase tracking-wider mb-3 block font-semibold">Available Time Slots *</label>
                    {loadingSlots ? (
                      <p className="text-xs text-muted-foreground">Loading slot availability...</p>
                    ) : availableSlotsCount === 0 ? (
                      <p className="text-xs text-sale flex items-center gap-2"><AlertCircle className="w-4 h-4" /> No available slots for this date. Please choose another date.</p>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                        {slotStates.map(({ slot, isBooked, isPast, isDisabled }, idx) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => !isDisabled && update("time", slot)}
                            disabled={isDisabled}
                            className={`py-2.5 text-[11px] font-medium tracking-wider border rounded transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
                              form.time === slot 
                                ? "bg-gradient-to-br from-accent to-accent/80 text-accent-foreground border-accent shadow-lg shadow-accent/30 scale-110" 
                                : isDisabled
                                  ? "border-accent/20 text-muted-foreground/55 bg-muted/40 opacity-55 cursor-not-allowed"
                                  : "border-accent/20 text-muted-foreground hover:border-accent/50 hover:text-foreground hover:bg-accent/5 hover:shadow-md hover:shadow-accent/10"
                            }`}
                            style={{ animationDelay: `${idx * 30}ms` }}
                            title={isBooked ? "Already booked" : isPast ? "Past time slot" : "Available"}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="border border-accent/20 bg-gradient-to-br from-background via-accent/2 to-accent/5 p-6 sm:p-8 relative group hover:border-accent/40 transition-all duration-300 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded" />
                <h3 className="text-sm font-medium mb-5 flex items-center gap-3 relative z-10">
                  <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent/80 text-accent-foreground flex items-center justify-center text-[11px] font-bold rounded-full shadow-md shadow-accent/20">3</div>
                  Additional Notes
                </h3>
                <textarea
                  placeholder="Any specific requirements, preferences, or questions? (e.g., 'Looking for a 1ct round solitaire in platinum', 'Anniversary gift for wife')"
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="w-full px-4 py-3 border border-accent/20 bg-background/80 text-sm outline-none focus:border-accent focus:bg-background focus:shadow-lg focus:shadow-accent/10 transition-all duration-300 hover:border-accent/30 relative z-10"
                  rows={4}
                />
                <p className="text-[10px] text-muted-foreground mt-3 relative z-10">Our diamond consultant will review your notes and prepare accordingly for your visit.</p>
              </div>

              <button type="submit" disabled={submitting} className="w-full py-3.5 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-medium tracking-widest uppercase hover:shadow-lg hover:shadow-accent/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95">
                <Calendar className="w-4 h-4" /> {submitting ? "Booking..." : "Confirm Appointment"}
              </button>

              <p className="text-[10px] text-muted-foreground text-center">
                By booking, you agree to our <Link to="/privacy-policy" className="text-accent underline hover:no-underline">Privacy Policy</Link>. A confirmation email will be sent to you.
              </p>
            </form>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default BookAppointmentPage;
