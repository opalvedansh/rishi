"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    Eye,
    Loader2,
    GripVertical,
    Save
} from "lucide-react";
import { Reorder } from "framer-motion";
import { getProducts, deleteProduct, updateProductOrder, Product } from "@/lib/supabase/products";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isSavingOrder, setIsSavingOrder] = useState(false);
    const [hasOrderChanged, setHasOrderChanged] = useState(false);

    // Fetch products from database
    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSaveOrder() {
        setIsSavingOrder(true);
        try {
            const orderUpdates = products.map((p, index) => ({
                id: p.id,
                sort_order: index + 1
            }));
            await updateProductOrder(orderUpdates);
            setHasOrderChanged(false);
            // Optional: Show success toast
        } catch (error) {
            console.error("Failed to save order:", error);
            alert("Failed to save order");
        } finally {
            setIsSavingOrder(false);
        }
    }

    const handleReorder = (newOrder: Product[]) => {
        setProducts(newOrder);
        setHasOrderChanged(true);
    };

    async function handleDelete(id: string) {
        if (!confirm("Are you sure you want to delete this product?")) return;

        setDeletingId(id);
        try {
            await deleteProduct(id);
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete product");
        } finally {
            setDeletingId(null);
        }
    }

    const filteredProducts = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-300" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-neutral-900">Products</h1>
                    <p className="text-neutral-500 mt-1">Manage your product catalog and inventory.</p>
                </div>
                <div className="flex gap-2">
                    {hasOrderChanged && (
                        <button
                            onClick={handleSaveOrder}
                            disabled={isSavingOrder}
                            className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingOrder ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Order
                        </button>
                    )}
                    <Link
                        href="/admin/products/new"
                        className="bg-black text-white px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-black transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-neutral-200 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-50 flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </button>
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                {products.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-8 h-8 text-neutral-400" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">No products yet</h3>
                        <p className="text-neutral-500 mb-6">Add your first product to get started</p>
                        <Link
                            href="/admin/products/new"
                            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wide hover:bg-neutral-800 transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-neutral-50 border-b border-neutral-100">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Product</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Category</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Price</th>
                                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-neutral-500">Status</th>
                                        <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-neutral-500">Actions</th>
                                    </tr>
                                </thead>
                                <Reorder.Group as="tbody" axis="y" values={products} onReorder={handleReorder} className="divide-y divide-neutral-100">
                                    {filteredProducts.map((product) => (
                                        <Reorder.Item
                                            key={product.id}
                                            value={product}
                                            as="tr"
                                            className="hover:bg-neutral-50/50 transition-colors group bg-white"
                                            dragListener={false}
                                            dragControls={undefined}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {/* Drag Handle */}
                                                    <Reorder.Item value={product} as="div" dragListener={true} className="cursor-grab active:cursor-grabbing text-neutral-300 hover:text-neutral-500">
                                                        <GripVertical className="w-4 h-4" />
                                                    </Reorder.Item>

                                                    <div className="w-12 h-16 relative rounded-md overflow-hidden bg-neutral-100 border border-neutral-200">
                                                        <Image
                                                            src={product.image}
                                                            alt={product.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900 group-hover:text-black transition-colors">{product.title}</p>
                                                        <p className="text-xs text-neutral-500 truncate max-w-[200px]">{product.description?.substring(0, 40)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                ₹{product.price.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                                                    Active
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/products/${product.handle}`}
                                                        target="_blank"
                                                        className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                                        title="View"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/products/${product.id}`}
                                                        className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        disabled={deletingId === product.id}
                                                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        {deletingId === product.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </Reorder.Item>
                                    ))}
                                </Reorder.Group>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-100 flex items-center justify-between text-sm">
                            <p className="text-neutral-500">Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredProducts.length}</span> of <span className="font-medium">{filteredProducts.length}</span> results</p>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-neutral-200 bg-white rounded-lg text-neutral-600 disabled:opacity-50">Previous</button>
                                <button className="px-4 py-2 border border-neutral-200 bg-white rounded-lg text-neutral-600 disabled:opacity-50">Next</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
