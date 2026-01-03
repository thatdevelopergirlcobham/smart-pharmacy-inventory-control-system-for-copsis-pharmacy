"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Eye, Edit, Trash2, X, Filter } from "lucide-react";

// --- Types ---
interface InventoryItem {
    id: string;
    name: string;
    category: string;
    stock: number;
    rank: string; // ABC-XYZ
}

// --- Dummy Data ---
const INITIAL_DATA: InventoryItem[] = [
    { id: "1", name: "Amoxicillin 500mg", category: "Tablets", stock: 1500, rank: "AX" },
    { id: "2", name: "Paracetamol 1g", category: "Tablets", stock: 85, rank: "BX" },
    { id: "3", name: "Ibuprofen Syrup", category: "Syrups", stock: 0, rank: "CZ" },
    { id: "4", name: "Ceftriaxone Injection", category: "Injections", stock: 45, rank: "AY" },
    { id: "5", name: "Vitamin C", category: "Tablets", stock: 5000, rank: "CX" },
    { id: "6", name: "Metformin 500mg", category: "Tablets", stock: 320, rank: "BY" },
    { id: "7", name: "Cough Syrup", category: "Syrups", stock: 12, rank: "BZ" },
];

export default function InventoryPage() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [formData, setFormData] = useState<Partial<InventoryItem>>({
        name: "",
        category: "Tablets",
        stock: 0,
        rank: "AX",
    });

    // Load Data
    useEffect(() => {
        const saved = localStorage.getItem("copsis_inventory");
        if (saved) {
            setItems(JSON.parse(saved));
        } else {
            setItems(INITIAL_DATA);
            localStorage.setItem("copsis_inventory", JSON.stringify(INITIAL_DATA));
        }
        setIsLoading(false);
    }, []);

    // Save Data
    const saveItems = (newItems: InventoryItem[]) => {
        setItems(newItems);
        localStorage.setItem("copsis_inventory", JSON.stringify(newItems));
    };

    // Handlers
    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this item?")) {
            saveItems(items.filter((item) => item.id !== id));
        }
    };

    const handleOpenModal = (item?: InventoryItem) => {
        if (item) {
            setEditingItem(item);
            setFormData(item);
        } else {
            setEditingItem(null);
            setFormData({
                name: "",
                category: "Tablets",
                stock: 0,
                rank: "AX",
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingItem) {
            // Edit
            const updatedItems = items.map(item =>
                item.id === editingItem.id
                    ? { ...item, ...formData } as InventoryItem
                    : item
            );
            saveItems(updatedItems);
        } else {
            // Add
            const newItem: InventoryItem = {
                id: crypto.randomUUID(),
                ...formData as Omit<InventoryItem, 'id'>,
            };
            saveItems([newItem, ...items]);
        }
        setIsModalOpen(false);
    };

    // Helper for Status Badge
    const getStatus = (stock: number) => {
        if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700 border-red-200" };
        if (stock < 100) return { label: "Low Stock", color: "bg-orange-100 text-orange-700 border-orange-200" };
        return { label: "In Stock", color: "bg-green-100 text-green-700 border-green-200" };
    };

    // Filtered Items
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading inventory...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Inventory Management</h1>
                    <p className="text-slate-500 mt-1">Track, manage, and optimize your pharmaceutical stock.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Add New Item
                </button>
            </div>

            {/* Main Content Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-4 border-b border-slate-100 flex flex-wrap gap-3 justify-between items-center">
                    <div className="relative w-full max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Search className="h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by product name or category..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Product Name</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Category</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">Total Stock</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-center">Rank (ABC-XYZ)</th>
                                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredItems.length > 0 ? (
                                filteredItems.map((item) => {
                                    const status = getStatus(item.stock);
                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{item.category}</td>
                                            <td className="px-6 py-4 text-slate-600 text-center font-mono">{item.stock}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs ring-1 ring-slate-200">
                                                    {item.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleOpenModal(item)}
                                                        className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                                                        title="Edit Item"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                        title="Delete Item"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                        No items found. Try a different search or add a new item.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h3 className="text-lg font-bold text-slate-800">
                                {editingItem ? "Edit Inventory Item" : "Add New Item"}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    placeholder="e.g. Amoxicillin 500mg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                    >
                                        <option value="Tablets">Tablets</option>
                                        <option value="Syrups">Syrups</option>
                                        <option value="Injections">Injections</option>
                                        <option value="Ointments">Ointments</option>
                                        <option value="Drops">Drops</option>
                                        <option value="Inhalers">Inhalers</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Total Stock</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Rank (ABC-XYZ Analysis)</label>
                                <select
                                    value={formData.rank}
                                    onChange={e => setFormData({ ...formData, rank: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white"
                                >
                                    <option value="AX">AX (High Value, Stable Demand)</option>
                                    <option value="AY">AY (High Value, Fluctuating Demand)</option>
                                    <option value="AZ">AZ (High Value, Irregular Demand)</option>
                                    <option value="BX">BX (Medium Value, Stable Demand)</option>
                                    <option value="BY">BY (Medium Value, Fluctuating Demand)</option>
                                    <option value="BZ">BZ (Medium Value, Irregular Demand)</option>
                                    <option value="CX">CX (Low Value, Stable Demand)</option>
                                    <option value="CY">CY (Low Value, Fluctuating Demand)</option>
                                    <option value="CZ">CZ (Low Value, Irregular Demand)</option>
                                </select>
                                <p className="text-xs text-slate-500">
                                    Classifies inventory based on value (ABC) and demand variability (XYZ).
                                </p>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm hover:shadow transition-all"
                                >
                                    {editingItem ? "Save Changes" : "Add Item"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
