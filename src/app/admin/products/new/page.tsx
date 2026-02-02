"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft, Upload, X, Save, Loader2, GripVertical, Plus,
    Package, DollarSign, Tags, Ruler, FileText, Sparkles, Trash2, PackageCheck, PackageX
} from "lucide-react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/supabase/products";
import { createClient } from "@/utils/supabase/client";

export default function AddProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        originalPrice: "",
        category: "",
        tag: "",
        sizes: [] as string[],
        colors: [] as string[],
        details: [""] as string[],
        inStock: true,
    });

    // Generate URL-safe handle from title
    const generateHandle = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");
    };

    // Upload image to Supabase Storage
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingImage(true);

            try {
                const supabase = createClient();
                const fileName = `${Date.now()}-${file.name}`;

                const { data, error } = await supabase.storage
                    .from("products")
                    .upload(fileName, file);

                if (error) throw error;

                // Get public URL
                const { data: urlData } = supabase.storage
                    .from("products")
                    .getPublicUrl(fileName);

                setImages([...images, urlData.publicUrl]);
            } catch (err: any) {
                console.error("Upload error:", err);
                // Fallback to local preview if storage bucket not configured
                setImages([...images, URL.createObjectURL(file)]);
            } finally {
                setUploadingImage(false);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages(images.filter((_, i) => i !== index));
    };

    // Drag and drop for image reordering
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);

        setImages(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const toggleSize = (size: string) => {
        if (formData.sizes.includes(size)) {
            setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) });
        } else {
            setFormData({ ...formData, sizes: [...formData.sizes, size] });
        }
    };

    const toggleColor = (color: string) => {
        if (formData.colors.includes(color)) {
            setFormData({ ...formData, colors: formData.colors.filter(c => c !== color) });
        } else {
            setFormData({ ...formData, colors: [...formData.colors, color] });
        }
    };

    // Product details/highlights management
    const addDetail = () => {
        setFormData({ ...formData, details: [...formData.details, ""] });
    };

    const updateDetail = (index: number, value: string) => {
        const newDetails = [...formData.details];
        newDetails[index] = value;
        setFormData({ ...formData, details: newDetails });
    };

    const removeDetail = (index: number) => {
        setFormData({ ...formData, details: formData.details.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!formData.title || !formData.price || images.length === 0) {
                throw new Error("Please fill in all required fields and add at least one image");
            }

            // Filter out empty details
            const filteredDetails = formData.details.filter(d => d.trim() !== "");

            await createProduct({
                title: formData.title,
                handle: generateHandle(formData.title),
                price: parseInt(formData.price),
                originalPrice: formData.originalPrice ? parseInt(formData.originalPrice) : undefined,
                image: images[0],
                images: images,
                tag: formData.tag || undefined,
                category: formData.category || undefined,
                description: formData.description || undefined,
                sizes: formData.sizes,
                colors: formData.colors,
                details: filteredDetails,
                rating: 0,
                review_count: 0,
                in_stock: formData.inStock,
            });

            router.push("/admin/products");
        } catch (err: any) {
            setError(err.message || "Failed to create product");
        } finally {
            setIsLoading(false);
        }
    };

    const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const availableColors = [
        { name: "Black", hex: "#000000" },
        { name: "White", hex: "#FFFFFF" },
        { name: "Navy", hex: "#1e3a5f" },
        { name: "Grey", hex: "#6b7280" },
        { name: "Cream", hex: "#FFFDD0" },
        { name: "Beige", hex: "#F5F5DC" },
        { name: "Brown", hex: "#8B4513" },
        { name: "Blue", hex: "#3B82F6" },
    ];

    const discount = formData.price && formData.originalPrice
        ? Math.round(((parseInt(formData.originalPrice) - parseInt(formData.price)) / parseInt(formData.originalPrice)) * 100)
        : 0;

    return (
        <div className="max-w-6xl mx-auto pb-20">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/products" className="p-2.5 bg-white hover:bg-neutral-100 rounded-xl transition-colors text-neutral-500 hover:text-black shadow-sm border border-neutral-200">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="flex-1">
                    <h1 className="font-display text-2xl lg:text-3xl font-bold text-neutral-900">Add New Product</h1>
                    <p className="text-neutral-500 text-sm">Fill in the details to add a new product to your catalog.</p>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="hidden lg:flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Product
                        </>
                    )}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column - Main Info */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Basic Details Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900">Basic Information</h2>
                                <p className="text-xs text-neutral-500">Product name and description</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Product Title <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-lg"
                                    placeholder="e.g. Oxford Heritage Knit"
                                />
                                {formData.title && (
                                    <p className="text-xs text-neutral-400 mt-2 flex items-center gap-1">
                                        <span className="font-medium">URL:</span> /products/{generateHandle(formData.title)}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all resize-none"
                                    placeholder="Describe your product in detail. This will be shown on the product page..."
                                />
                                <p className="text-xs text-neutral-400 mt-1">{formData.description.length}/500 characters</p>
                            </div>
                        </div>
                    </div>

                    {/* Media Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                                    <Upload className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-neutral-900">Product Images <span className="text-red-500">*</span></h2>
                                    <p className="text-xs text-neutral-500">Drag to reorder • First image is primary</p>
                                </div>
                            </div>
                            <span className="text-sm text-neutral-400">{images.length} image(s)</span>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        draggable
                                        onDragStart={() => handleDragStart(i)}
                                        onDragOver={(e) => handleDragOver(e, i)}
                                        onDragEnd={handleDragEnd}
                                        className={`aspect-[3/4] relative rounded-xl overflow-hidden border-2 group cursor-move transition-all ${draggedIndex === i ? 'border-black opacity-50 scale-95' : 'border-neutral-200 hover:border-neutral-400'
                                            }`}
                                    >
                                        <Image src={img} alt="Product" fill className="object-cover" />

                                        {/* Overlay */}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                                        {/* Drag Handle */}
                                        <div className="absolute top-2 left-2 p-1.5 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                                            <GripVertical className="w-4 h-4 text-neutral-500" />
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-red-600"
                                        >
                                            <X className="w-4 h-4 text-white" />
                                        </button>

                                        {/* Primary Badge */}
                                        {i === 0 && (
                                            <span className="absolute bottom-2 left-2 bg-black text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wide shadow-lg">
                                                Primary
                                            </span>
                                        )}

                                        {/* Image Number */}
                                        {i > 0 && (
                                            <span className="absolute bottom-2 left-2 bg-white/90 text-neutral-600 text-[10px] px-2.5 py-1 rounded-lg font-bold">
                                                #{i + 1}
                                            </span>
                                        )}
                                    </div>
                                ))}

                                {/* Upload Button */}
                                <label className="aspect-[3/4] flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-xl cursor-pointer hover:border-black hover:bg-neutral-50 transition-all group">
                                    {uploadingImage ? (
                                        <Loader2 className="w-8 h-8 text-neutral-400 animate-spin" />
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center mb-3 group-hover:bg-neutral-200 transition-colors">
                                                <Plus className="w-6 h-6 text-neutral-500" />
                                            </div>
                                            <span className="text-sm text-neutral-600 font-medium">Add Image</span>
                                            <span className="text-xs text-neutral-400 mt-1">PNG, JPG up to 5MB</span>
                                        </>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Product Details/Highlights Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-neutral-900">Product Highlights</h2>
                                    <p className="text-xs text-neutral-500">Key features shown as bullet points</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={addDetail}
                                className="flex items-center gap-1.5 text-sm font-medium text-black hover:text-neutral-600 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Add
                            </button>
                        </div>
                        <div className="p-6 space-y-3">
                            {formData.details.map((detail, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                        ✓
                                    </span>
                                    <input
                                        type="text"
                                        value={detail}
                                        onChange={(e) => updateDetail(i, e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                        placeholder={`e.g. ${i === 0 ? "Premium Cotton Blend" : i === 1 ? "Machine Washable" : "Comfortable Fit"}`}
                                    />
                                    {formData.details.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeDetail(i)}
                                            className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Variants Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                                <Ruler className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900">Sizes & Colors</h2>
                                <p className="text-xs text-neutral-500">Available variants for this product</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Sizes */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">Available Sizes</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableSizes.map(size => (
                                        <button
                                            key={size}
                                            type="button"
                                            onClick={() => toggleSize(size)}
                                            className={`min-w-[48px] h-12 px-4 rounded-xl text-sm font-bold transition-all border-2 ${formData.sizes.includes(size)
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                                {formData.sizes.length > 0 && (
                                    <p className="text-xs text-neutral-400 mt-2">
                                        Selected: {formData.sizes.join(", ")}
                                    </p>
                                )}
                            </div>

                            {/* Colors */}
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-3">Available Colors</label>
                                <div className="flex flex-wrap gap-3">
                                    {availableColors.map(color => (
                                        <button
                                            key={color.name}
                                            type="button"
                                            onClick={() => toggleColor(color.name)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 ${formData.colors.includes(color.name)
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                                }`}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border border-neutral-300"
                                                style={{ backgroundColor: color.hex }}
                                            />
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Sidebar */}
                <div className="lg:col-span-4 space-y-6">

                    {/* Pricing Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900">Pricing</h2>
                                <p className="text-xs text-neutral-500">Set product price</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Selling Price (₹) <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">₹</span>
                                    <input
                                        type="number"
                                        required
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-lg font-semibold"
                                        placeholder="0"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Compare at Price (₹)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-medium">₹</span>
                                    <input
                                        type="number"
                                        value={formData.originalPrice}
                                        onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                        placeholder="0"
                                    />
                                </div>
                                <p className="text-xs text-neutral-400 mt-2">Set a higher price to show as "was" price</p>
                            </div>

                            {/* Discount Preview */}
                            {discount > 0 && (
                                <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                                    <span className="text-sm text-green-700 font-medium">Discount</span>
                                    <span className="text-lg font-bold text-green-600">{discount}% OFF</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Organization Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                                <Tags className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900">Organization</h2>
                                <p className="text-xs text-neutral-500">Category and tags</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all appearance-none cursor-pointer"
                                >
                                    <option value="">Select category</option>
                                    <option value="Knitwear">Knitwear</option>
                                    <option value="Trousers">Trousers</option>
                                    <option value="Shirts">Shirts</option>
                                    <option value="T-Shirts">T-Shirts</option>
                                    <option value="Jackets">Jackets</option>
                                    <option value="Accessories">Accessories</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-neutral-700 mb-2">Product Tag</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {["", "New", "Sale", "Best Seller"].map((tag) => (
                                        <button
                                            key={tag || "none"}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, tag })}
                                            className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all border-2 flex items-center justify-center gap-1.5 ${formData.tag === tag
                                                ? "bg-black text-white border-black"
                                                : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                                }`}
                                        >
                                            {tag === "New" && <Sparkles className="w-3.5 h-3.5" />}
                                            {tag || "No Tag"}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stock Status Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.inStock ? 'bg-gradient-to-br from-green-500 to-green-600' : 'bg-gradient-to-br from-red-500 to-red-600'}`}>
                                {formData.inStock ? <PackageCheck className="w-5 h-5 text-white" /> : <PackageX className="w-5 h-5 text-white" />}
                            </div>
                            <div>
                                <h2 className="font-bold text-neutral-900">Stock Status</h2>
                                <p className="text-xs text-neutral-500">Product availability</p>
                            </div>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, inStock: true })}
                                    className={`py-4 px-4 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center justify-center gap-2 ${formData.inStock
                                        ? "bg-green-50 text-green-700 border-green-500"
                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                        }`}
                                >
                                    <PackageCheck className="w-6 h-6" />
                                    <span>In Stock</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, inStock: false })}
                                    className={`py-4 px-4 rounded-xl text-sm font-medium transition-all border-2 flex flex-col items-center justify-center gap-2 ${!formData.inStock
                                        ? "bg-red-50 text-red-700 border-red-500"
                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                                        }`}
                                >
                                    <PackageX className="w-6 h-6" />
                                    <span>Out of Stock</span>
                                </button>
                            </div>
                            {!formData.inStock && (
                                <p className="text-xs text-red-500 mt-3 text-center">
                                    ⚠ This product won't be available for purchase
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Preview Card */}
                    {(formData.title || images.length > 0) && (
                        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-2xl p-6 text-white">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4">Preview</h3>
                            <div className="space-y-3">
                                {images[0] && (
                                    <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                                        <Image src={images[0]} alt="Preview" fill className="object-cover" />
                                        {formData.tag && (
                                            <span className="absolute top-2 left-2 bg-white text-black text-[10px] px-2 py-1 rounded-lg font-bold uppercase">
                                                {formData.tag}
                                            </span>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-lg">{formData.title || "Product Title"}</p>
                                    <p className="text-neutral-400 text-sm">{formData.category || "Category"}</p>
                                    <div className="flex items-baseline gap-2 mt-1">
                                        <span className="text-xl font-bold">₹{formData.price || "0"}</span>
                                        {formData.originalPrice && (
                                            <span className="text-sm text-neutral-500 line-through">₹{formData.originalPrice}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button (Sticky) */}
                    <div className="sticky top-24">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Product
                                </>
                            )}
                        </button>
                        <Link
                            href="/admin/products"
                            className="w-full flex items-center justify-center gap-2 border-2 border-neutral-200 text-neutral-600 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-neutral-50 transition-all mt-3"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
