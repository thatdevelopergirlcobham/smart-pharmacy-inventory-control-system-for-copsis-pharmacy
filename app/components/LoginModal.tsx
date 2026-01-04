"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, User, Lock, ArrowRight } from "lucide-react";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            document.body.style.overflow = "hidden";
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Wait for animation
            document.body.style.overflow = "unset";
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push("/dashboard");
        onClose();
    };

    if (!isVisible && !isOpen) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
                }`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div
                className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white/90 p-8 text-left shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-md ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                    }`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Header */}
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-blue-900">Welcome Back</h2>
                    <p className="text-sm text-slate-500 mt-2">
                        Please enter your details to sign in
                    </p>
                </div>

                {/* Form */}
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">
                            Stats Portal ID / Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User className="h-5 w-5" />
                            </div>
                            <input
                                type="text"
                                className="block text-black w-full rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 pl-10 py-3 transition-colors outline-none"
                                placeholder="Enter your ID or email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <input
                                type="password"
                                className="block w-full text-black rounded-xl border-slate-200 bg-slate-50 border focus:border-blue-500 focus:ring-blue-500 pl-10 py-3 transition-colors outline-none"
                                placeholder="••••••••"
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="group w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-white font-semibold shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all duration-200"
                    >
                        Sign In
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-400">
                    Protected by COPSIS Security Systems
                </div>
            </div>
        </div>
    );
}
