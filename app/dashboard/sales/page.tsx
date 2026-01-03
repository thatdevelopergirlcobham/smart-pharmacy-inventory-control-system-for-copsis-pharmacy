"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, Trash2, CreditCard, Banknote, Smartphone, Clock, ChevronRight, History, Receipt, CheckCircle, X } from "lucide-react";

interface Batch {
    id: string;
    batchNumber: string;
    expiryDate: string; 
    stock: number;
}

interface Product {
    id: string;
    name: string;
    price: number;
    batches: Batch[];
}

interface CartItem {
    cartId: string;
    productId: string;
    productName: string;
    batchId: string;
    batchNumber: string;
    expiryDate: string;
    price: number;
    quantity: number;
    maxStock: number;
}

interface SaleRecord {
    id: string;
    time: string;
    total: number;
    method: "Cash" | "POS" | "Transfer";
    itemsCount: number;
}

// --- Dummy Data ---
// In a real app, this would be fetched from the database
const PRODUCTS: Product[] = [
    {
        id: "p1",
        name: "Panadol Extra",
        price: 1500,
        batches: [
            { id: "b1", batchNumber: "PAN-101", expiryDate: "2026-05-20", stock: 15 },
            { id: "b2", batchNumber: "PAN-102", expiryDate: "2027-01-10", stock: 50 },
        ]
    },
    {
        id: "p2",
        name: "Amoxicillin 500mg",
        price: 3500,
        batches: [
            { id: "b3", batchNumber: "AMX-882", expiryDate: "2023-12-01", stock: 5 }, // Expired
            { id: "b4", batchNumber: "AMX-900", expiryDate: "2025-06-15", stock: 100 },
        ]
    },
    {
        id: "p3",
        name: "Vitamin C 1000mg",
        price: 2000,
        batches: [
            { id: "b5", batchNumber: "VIT-001", expiryDate: "2026-02-28", stock: 20 },
        ]
    },
    {
        id: "p4",
        name: "Cough Syrup (Benylin)",
        price: 4200,
        batches: [
            { id: "b6", batchNumber: "BEN-455", expiryDate: "2024-11-10", stock: 8 }, // Low stock
        ]
    },
    {
        id: "p5",
        name: "Artemether/Lumefantrine (Lonart)",
        price: 2800,
        batches: [
            { id: "b7", batchNumber: "LON-303", expiryDate: "2026-08-15", stock: 40 },
        ]
    },
    {
        id: "p6",
        name: "Ciprofloxacin 500mg",
        price: 1200,
        batches: [
            { id: "b8", batchNumber: "CIP-112", expiryDate: "2025-12-01", stock: 30 },
            { id: "b9", batchNumber: "CIP-115", expiryDate: "2027-03-20", stock: 65 },
        ]
    },
    {
        id: "p7",
        name: "Omeprazole 20mg",
        price: 1800,
        batches: [
            { id: "b10", batchNumber: "OME-555", expiryDate: "2026-01-30", stock: 25 },
        ]
    },
    {
        id: "p8",
        name: "Metronidazole 400mg (Flagyl)",
        price: 500,
        batches: [
            { id: "b11", batchNumber: "MET-009", expiryDate: "2025-10-10", stock: 150 },
        ]
    },
    {
        id: "p9",
        name: "Ibuprofen 400mg",
        price: 800,
        batches: [
            { id: "b12", batchNumber: "IBU-221", expiryDate: "2026-07-07", stock: 80 },
        ]
    },
    {
        id: "p10",
        name: "Multivitamin Syrup (Abidec)",
        price: 3500,
        batches: [
            { id: "b13", batchNumber: "ABI-774", expiryDate: "2025-05-05", stock: 12 },
        ]
    }
];

export default function SalesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [discount, setDiscount] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState<"Cash" | "POS" | "Transfer">("Cash");
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [recentSales, setRecentSales] = useState<SaleRecord[]>([
        { id: "TX-998", time: "10:45 AM", total: 4500, method: "Cash", itemsCount: 2 },
        { id: "TX-997", time: "10:30 AM", total: 12000, method: "POS", itemsCount: 5 },
        { id: "TX-996", time: "09:15 AM", total: 1500, method: "Transfer", itemsCount: 1 },
    ]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentSale, setCurrentSale] = useState<SaleRecord | null>(null);

    // --- Search Logic ---
    useEffect(() => {
        if (searchQuery.trim().length === 0) {
            setSearchResults([]);
            return;
        }
        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
    }, [searchQuery]);

    // --- Helper: FEFO Logic ---
    const getSuggestionBadge = (product: Product, batchIndex: number) => {
        // Sort batches by expiry date
        const sortedBatches = [...product.batches].sort((a, b) =>
            new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
        );
        // If the current batch is the one expiring soonest (and not expired yet check omitted for simplicity but implied), pick it
        // Wait, we need to match the specific batch ID.
        if (sortedBatches[0].id === product.batches[batchIndex].id) {
            // Check if already expired?
            const isExpired = new Date(sortedBatches[0].expiryDate) < new Date();
            if (!isExpired) return true;
        }
        return false;
    };

    const isExpired = (dateString: string) => {
        return new Date(dateString) < new Date();
    };

    // --- Cart Actions ---
    const addToCart = (product: Product, batch: Batch) => {
        if (isExpired(batch.expiryDate)) {
            alert("CRITICAL WARNING: This item is expired! Sale blocked for safety.");
            return;
        }

        // Check if already in cart
        const existingItem = cart.find(item => item.batchId === batch.id);
        if (existingItem) {
            if (existingItem.quantity + 1 > batch.stock) {
                alert("Cannot add more: Stock limit reached!");
                return;
            }
            setCart(cart.map(item =>
                item.batchId === batch.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, {
                cartId: crypto.randomUUID(),
                productId: product.id,
                productName: product.name,
                batchId: batch.id,
                batchNumber: batch.batchNumber,
                expiryDate: batch.expiryDate,
                price: product.price,
                quantity: 1,
                maxStock: batch.stock
            }]);
        }
        setSearchQuery(""); // Clear search after picking
    };

    const removeFromCart = (cartId: string) => {
        setCart(cart.filter(item => item.cartId !== cartId));
    };

    const updateQuantity = (cartId: string, newQty: number) => {
        setCart(cart.map(item => {
            if (item.cartId === cartId) {
                if (newQty > item.maxStock) {
                    // Provide visual feedback instead of just clamping? for now clamp
                    return { ...item, quantity: item.maxStock };
                }
                if (newQty < 1) return { ...item, quantity: 1 };
                return { ...item, quantity: newQty };
            }
            return item;
        }));
    };

    // --- Calculations ---
    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const total = useMemo(() => Math.max(0, subTotal - discount), [subTotal, discount]);

    const handleCompleteSale = () => {
        if (cart.length === 0) return;

        const newSale: SaleRecord = {
            id: `TX-${Math.floor(Math.random() * 10000)}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            total: total,
            method: paymentMethod,
            itemsCount: cart.length
        };

        const updatedSales = [newSale, ...recentSales].slice(0, 5); // Keep last 5
        setRecentSales(updatedSales);
        setCurrentSale(newSale); // Store for modal
        setShowSuccessModal(true); // Open Modal
    };

    const handleModalClose = () => {
        setShowSuccessModal(false);
        setCart([]);
        setDiscount(0);
        setSearchQuery("");
        setCurrentSale(null);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]"> {/* Height accounts for Layout padding if any, but we are in dashboard layout */}
            <div className="flex flex-1 gap-6 overflow-hidden">

                {/* LEFT COLUMN: Search & Cart (70%) */}
                <div className="flex-[7] flex flex-col gap-6 overflow-hidden">

                    {/* Quick Search Bar */}
                    <div className="relative shrink-0 z-30">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Scan barcode or type product name (e.g. 'Lonart')..."
                                className="w-full h-14 pl-12 pr-4 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 text-lg shadow-sm transition-all"
                                autoFocus
                            />
                        </div>

                        {/* Live Search Results Dropdown */}
                        {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-slate-100 max-h-96 overflow-y-auto divide-y divide-slate-100">
                                {searchResults.length === 0 ? (
                                    <div className="p-4 text-slate-500 text-center">No products found.</div>
                                ) : (
                                    searchResults.map(product => (
                                        <div key={product.id} className="p-4 hover:bg-slate-50/80">
                                            <div className="flex justify-between items-baseline mb-2">
                                                <h4 className="font-bold text-slate-800">{product.name}</h4>
                                                <span className="text-blue-600 font-mono font-bold">₦{product.price.toLocaleString()}</span>
                                            </div>
                                            <div className="grid grid-cols-1 gap-2">
                                                {product.batches.map((batch, index) => {
                                                    const isRecommended = getSuggestionBadge(product, index);
                                                    const expired = isExpired(batch.expiryDate);

                                                    return (
                                                        <button
                                                            key={batch.id}
                                                            onClick={() => addToCart(product, batch)}
                                                            disabled={expired || batch.stock === 0}
                                                            className={`flex items-center justify-between p-3 rounded-lg border text-sm text-left transition-all ${expired
                                                                ? "bg-red-50 border-red-100 cursor-not-allowed opacity-60"
                                                                : isRecommended
                                                                    ? "bg-green-50 border-green-200 hover:bg-green-100 hover:shadow-md ring-1 ring-green-400/30"
                                                                    : "bg-white border-slate-200 hover:bg-slate-100"
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-mono text-slate-500">#{batch.batchNumber}</span>
                                                                <div className="flex flex-col">
                                                                    <span className={`text-xs font-medium ${expired ? "text-red-600" : "text-slate-600"}`}>
                                                                        Exp: {batch.expiryDate} {expired && "(EXPIRED)"}
                                                                    </span>
                                                                    <span className="text-xs text-slate-400">Stock: {batch.stock}</span>
                                                                </div>
                                                            </div>

                                                            {isRecommended && !expired && (
                                                                <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-200/50 px-2 py-1 rounded-full animate-pulse">
                                                                    <Clock className="h-3 w-3" /> FEFO Pick
                                                                </span>
                                                            )}
                                                            {batch.stock === 0 && (
                                                                <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                                                                    Out of Stock
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Transaction Table (The Cart) */}
                    <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-slate-800 flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-blue-600" /> Current Transaction
                            </h2>
                            <span className="text-sm text-slate-500">{cart.length} items</span>
                        </div>

                        <div className="flex-1 overflow-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <tr>
                                        <th className="px-6 py-3">Item & Batch</th>
                                        <th className="px-6 py-3 text-right">Price</th>
                                        <th className="px-6 py-3 text-center">Qty</th>
                                        <th className="px-6 py-3 text-right">Total</th>
                                        <th className="px-6 py-3 text-center">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {cart.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                                                <ShoppingCart className="h-12 w-12 opacity-20" />
                                                <p>Cart is empty. Start adding items.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        cart.map((item) => (
                                            <tr key={item.cartId} className="group hover:bg-slate-50/50">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-slate-800 text-base">{item.productName}</span>
                                                        <span className="text-xs font-mono text-slate-500">
                                                            Batch: {item.batchNumber} • Exp: {item.expiryDate}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono text-slate-600">
                                                    ₦{item.price.toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex justify-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.maxStock}
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item.cartId, parseInt(e.target.value) || 1)}
                                                            className={`w-16 h-8 text-center border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold ${item.quantity >= item.maxStock
                                                                ? "border-orange-300 bg-orange-50 text-orange-800"
                                                                : "border-slate-200"
                                                                }`}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">
                                                    ₦{(item.price * item.quantity).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <button
                                                        onClick={() => removeFromCart(item.cartId)}
                                                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Checkout (30%) */}
                <div className="flex-[3] flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 flex flex-col h-full text-white">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-blue-400" /> Checkout
                        </h2>

                        {/* Calculations */}
                        <div className="space-y-4 mb-8 flex-1">
                            <div className="flex justify-between items-center text-slate-300">
                                <span>Sub-total</span>
                                <span className="font-mono">₦{subTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-slate-300">
                                <span className="flex items-center gap-1 text-sm">Discount <span className="text-xs text-slate-500">(Optional)</span></span>
                                <div className="flex items-center gap-1 w-24">
                                    <span className="text-slate-500 text-sm">-₦</span>
                                    <input
                                        type="number"
                                        value={discount}
                                        onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                                        className="w-full bg-slate-800 border-none rounded p-1 text-right text-sm focus:ring-1 focus:ring-blue-500 text-white"
                                    />
                                </div>
                            </div>
                            <div className="h-px bg-slate-700 my-4" />
                            <div className="flex justify-between items-end">
                                <span className="text-lg font-bold">Total to Pay</span>
                                <span className="text-3xl font-bold text-green-400 font-mono tracking-tight">
                                    ₦{total.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="mb-8">
                            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 block">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "Cash", icon: Banknote },
                                    { id: "POS", icon: CreditCard },
                                    { id: "Transfer", icon: Smartphone }
                                ].map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => setPaymentMethod(m.id as "Cash" | "POS" | "Transfer")}
                                        className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === m.id
                                            ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white"
                                            }`}
                                    >
                                        <m.icon className="h-5 w-5" />
                                        <span className="text-xs font-medium">{m.id}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Action */}
                        <button
                            onClick={handleCompleteSale}
                            disabled={cart.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-2 transition-all ${cart.length > 0
                                ? "bg-green-500 hover:bg-green-600 text-white hover:scale-[1.02] active:scale-[0.98] shadow-green-500/20"
                                : "bg-slate-800 text-slate-500 cursor-not-allowed"
                                }`}
                        >
                            Complete Sale <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* BOTTOM BAR: Recent Transactions */}
            <div className="h-16 mt-6 bg-white border-t border-slate-200 flex items-center px-6 gap-6 shrink-0">
                <span className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest">
                    <History className="h-4 w-4" /> Recent Sales
                </span>
                <div className="flex-1 flex items-center gap-4 overflow-x-auto no-scrollbar">
                    {recentSales.map(sale => (
                        <div key={sale.id} className="flex items-center gap-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-100 min-w-fit">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-slate-700">{sale.id}</span>
                                <span className="text-[10px] text-slate-400">{sale.time}</span>
                            </div>
                            <div className="h-6 w-px bg-slate-200 mx-1" />
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-mono font-bold text-green-600">₦{sale.total.toLocaleString()}</span>
                                <span className="text-[10px] text-slate-500 bg-slate-200 px-1 rounded">{sale.method}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* SUCCESS MODAL */}
            {showSuccessModal && currentSale && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                                <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Sale Completed!</h3>
                            <p className="text-slate-500 mb-6">
                                Transaction <span className="font-mono font-semibold text-slate-700">{currentSale.id}</span> has been recorded successfully.
                            </p>

                            <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 text-left space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Items Sold</span>
                                    <span className="font-semibold text-slate-800">{currentSale.itemsCount}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Payment Method</span>
                                    <span className="font-semibold text-slate-800">{currentSale.method}</span>
                                </div>
                                <div className="border-t border-slate-200 my-2 pt-2 flex justify-between items-center">
                                    <span className="font-bold text-slate-700">Total Paid</span>
                                    <span className="font-mono text-xl font-bold text-green-600">₦{currentSale.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleModalClose}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                                >
                                    <X className="h-4 w-4" /> Close
                                </button>
                                <button
                                    onClick={() => alert("Printing receipt...")}
                                    className="w-full flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                                >
                                    <Receipt className="h-4 w-4" /> Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
