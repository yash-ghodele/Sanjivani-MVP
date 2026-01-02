'use client';

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, ArrowRight, Leaf, Mail, Lock, User } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const { loginWithEmail, signupWithEmail, loading, hasMounted } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    if (!hasMounted) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        try {
            if (isSignUp) {
                await signupWithEmail(email, password, name);
                alert("Account created! Redirecting...");
                window.location.href = "/dashboard";
            } else {
                await loginWithEmail(email, password);
                window.location.href = "/dashboard";
            }
        } catch (err: any) {
            setError(err.message || "Authentication failed. Please check your credentials.");
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0f110f] font-sans p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#82ae19]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#82ae19]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Container */}
            <div className={`relative bg-[#1a1a18] rounded-[2rem] shadow-2xl w-full max-w-[900px] min-h-[600px] overflow-hidden border border-white/5 transition-all duration-700 ${isSignUp ? "container-active" : ""}`}>

                {/* SIGN IN FORM (Left Side) - "Welcome Back" header implies login */}
                <div className={`absolute top-0 h-full transition-all duration-700 w-full md:w-1/2 left-0 flex items-center justify-center p-10 bg-[#1a1a18] z-20 ${isSignUp ? "opacity-0 pointer-events-none translate-x-[20%]" : "opacity-100 translate-x-0"}`}>
                    <div className="w-full max-w-xs text-center">
                        <h1 className="text-3xl font-display font-bold text-white mb-6">Welcome Back</h1>
                        <div className="flex justify-center gap-4 mb-6">
                            <button type="button" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#82ae19] hover:border-[#82ae19] transition-all"><Leaf className="w-4 h-4" /></button>
                            <button type="button" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#82ae19] hover:border-[#82ae19] transition-all"><User className="w-4 h-4" /></button>
                        </div>
                        <span className="text-white/40 text-xs uppercase tracking-widest mb-6 block">or use your email</span>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {error && !isSignUp && <p className="text-red-500 text-xs text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#82ae19] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#82ae19] transition-all text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#82ae19] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#82ae19] transition-all text-sm"
                                />
                            </div>
                            <button type="button" className="text-white/40 text-xs hover:text-[#82ae19] transition-colors block ml-auto">Forgot your password?</button>
                            <button disabled={loading} className="w-full bg-[#82ae19] hover:bg-[#6d9214] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#82ae19]/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* SIGN UP FORM (Right Side) - "Create Account" header implies signup */}
                <div className={`absolute top-0 h-full transition-all duration-700 w-full md:w-1/2 left-1/2 flex items-center justify-center p-10 bg-[#1a1a18] z-20 ${isSignUp ? "opacity-100 translate-x-0" : "opacity-0 pointer-events-none translate-x-[-20%]"}`}>
                    <div className="w-full max-w-xs text-center">
                        <h1 className="text-3xl font-display font-bold text-white mb-6">Create Account</h1>
                        <div className="flex justify-center gap-4 mb-6">
                            <button type="button" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#82ae19] hover:border-[#82ae19] transition-all"><Leaf className="w-4 h-4" /></button>
                            <button type="button" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:text-[#82ae19] hover:border-[#82ae19] transition-all"><User className="w-4 h-4" /></button>
                        </div>
                        <span className="text-white/40 text-xs uppercase tracking-widest mb-6 block">or use your email for registration</span>

                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            {error && isSignUp && <p className="text-red-500 text-xs text-center bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#82ae19] transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Name"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#82ae19] transition-all text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#82ae19] transition-colors" />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#82ae19] transition-all text-sm"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[#82ae19] transition-colors" />
                                <input
                                    type="password"
                                    placeholder="Password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#82ae19] transition-all text-sm"
                                />
                            </div>
                            <button disabled={loading} className="w-full bg-[#82ae19] hover:bg-[#6d9214] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#82ae19]/20 mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* OVERLAY CONTAINER */}
                <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50 rounded-l-[2rem] hidden md:block ${isSignUp ? "translate-x-[-100%] rounded-r-[2rem] rounded-l-none" : "translate-x-0"}`}>
                    <div className={`bg-[#0f110f] relative -left-full h-full w-[200%] transform transition-transform duration-700 ease-in-out ${isSignUp ? "translate-x-[50%]" : "translate-x-0"}`}>
                        {/* Overlay Gradient/Image */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a4f1a] to-[#0f110f]" />
                        <div className="absolute inset-0 bg-[url('/assets/login-bg.png')] bg-cover bg-center mix-blend-overlay opacity-40" />

                        {/* Left Panel Content (Hidden when SignIn is active, Visible when SignUp is active -> Overlay moved left) */}
                        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white transform transition-transform duration-700 ${isSignUp ? "translate-x-0" : "translate-x-[20%]"}`}>
                            {/* Content placeholder */}
                        </div>

                        {/* Overlay Panel Logic */}

                        {/* Text for when Overlay is on the RIGHT (Default) */}
                        <div className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white transform transition-transform duration-700 ${isSignUp ? "translate-x-[20%] opacity-0" : "translate-x-0 opacity-100"}`}>
                            <h1 className="text-3xl font-display font-bold mb-4">Hello, Farmer!</h1>
                            <p className="text-white/70 mb-8 text-sm leading-relaxed">Enter your personal details and start your journey with us to protect your crops.</p>
                            <button
                                onClick={() => setIsSignUp(true)}
                                className="border border-white/30 bg-white/10 backdrop-blur-md px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-[#0f110f] transition-all"
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Text for when Overlay is on the LEFT (Active) */}
                        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center p-12 text-center text-white transform transition-transform duration-700 ${isSignUp ? "translate-x-0 opacity-100" : "translate-x-[-20%] opacity-0"}`}>
                            <h1 className="text-3xl font-display font-bold mb-4">Welcome Back!</h1>
                            <p className="text-white/70 mb-8 text-sm leading-relaxed">To keep connected with us please login with your personal info.</p>
                            <button
                                onClick={() => setIsSignUp(false)}
                                className="border border-white/30 bg-white/10 backdrop-blur-md px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white hover:text-[#0f110f] transition-all"
                            >
                                Sign In
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Toggle (Simple replacement for sliding on small screens) */}
                <div className="absolute top-4 right-4 md:hidden z-50">
                    <button onClick={() => setIsSignUp(!isSignUp)} className="text-[#82ae19] text-xs font-bold uppercase">
                        {isSignUp ? "Login" : "Register"}
                    </button>
                </div>
            </div>

            {/* Return Link */}
            <Link href="/" className="absolute bottom-6 text-white/20 hover:text-white/50 text-[10px] uppercase font-bold tracking-[0.2em] transition-colors">
                Return to Home
            </Link>
        </div>
    );
}
