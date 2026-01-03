"use client";

import { useState } from "react";
import LoginModal from "./LoginModal";

export default function Hero() {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    return (
        <div className="relative flex flex-col min-h-screen bg-slate-50 overflow-hidden selection:bg-blue-200">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                {/* Animated Blobs */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                {/* Yellow blob removed as requested */}
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

                {/* Extra floating elements for 'busyness' */}
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-60 animate-blob"></div>

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 flex-grow flex flex-col items-center justify-center px-4 text-center">
                <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] pointer-events-none" /> {/* Subtle glass effect to ensure text readability */}

                <div className="relative z-20">
                    <h1 className="text-4xl md:text-6xl font-bold text-blue-900 mb-4 tracking-tight">
                        COPSIS Pharmacy Inventory Optimizer
                    </h1>
                    <p className="text-lg text-slate-700 max-w-2xl mx-auto mb-8 font-medium">
                        A data-driven platform designed to eliminate medication waste,
                        automate stock replenishment, and maximize operational efficiency
                        through advanced ABC-XYZ analytics.
                    </p>
                    <button
                        onClick={() => setIsLoginModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Staff Portal Login
                    </button>
                </div>
            </main>

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
        </div>
    );
}