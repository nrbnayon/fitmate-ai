'use client'
import { useState } from "react";
import { FloatingInput } from "@/components/ui/floating-input";

export default function FloatingInputDemo() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors = { email: "", password: "" };
    
    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    
    if (!newErrors.email && !newErrors.password) {
      console.log("Form submitted:", { email, password });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-3xl font-bold mb-2">Floating Input Component</h1>
          <p className="text-muted-foreground">
            Material UI-inspired input fields with floating labels
          </p>
        </div>

        {/* With Border (Default) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">With Border (isLabelBorder={"{true}"})</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Label floats to the border with background
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
            <FloatingInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              isLabelBorder={true}
            />

            <div className="relative">
              <FloatingInput
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                isLabelBorder={true}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Sign In
            </button>
          </form>
        </section>

        {/* Without Border (Bottom Line) */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Without Border (isLabelBorder={"{false}"})</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Label moves up with bottom border only
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <FloatingInput
              label="Email"
              type="email"
              isLabelBorder={false}
            />

            <FloatingInput
              label="Password"
              type="password"
              isLabelBorder={false}
            />

            <FloatingInput
              label="Confirm Password"
              type="password"
              isLabelBorder={false}
            />
          </div>
        </section>

        {/* Different States */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Different States</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Various input states and configurations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <FloatingInput
              label="Username"
              type="text"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Phone Number"
              type="tel"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Disabled Input"
              type="text"
              disabled
              isLabelBorder={true}
            />

            <FloatingInput
              label="With Error"
              type="text"
              error="This field is required"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Date of Birth"
              type="date"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Website URL"
              type="url"
              isLabelBorder={true}
            />
          </div>
        </section>

        {/* Mixed Styles */}
        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-1">Mixed Styles</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Combining both border styles
            </p>
          </div>

          <div className="space-y-6 max-w-md">
            <FloatingInput
              label="Full Name"
              type="text"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Email Address"
              type="email"
              isLabelBorder={false}
            />

            <FloatingInput
              label="Message"
              type="text"
              isLabelBorder={true}
            />

            <FloatingInput
              label="Subject"
              type="text"
              isLabelBorder={false}
            />
          </div>
        </section>
      </div>
    </div>
  );
}