"use client";

import { useEffect, useState } from "react";
import { Save, Plus, Trash2, Building2, Phone, Mail, User, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { settingsService } from "@/lib/settings";

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        clinicName: "",
        logo: "",
        representativeName: "",
        email: "",
        phoneNumbers: [] as string[],
        addresses: [] as string[],
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const data = await settingsService.get();
                setFormData({
                    clinicName: data.clinicName || "",
                    logo: data.logo || "",
                    representativeName: data.representativeName || "",
                    email: data.email || "",
                    phoneNumbers: data.phoneNumbers?.length ? data.phoneNumbers : [""],
                    addresses: data.addresses?.length ? data.addresses : [""],
                });
            } catch (error) {
                toast.error("Không thể tải cấu hình");
            } finally {
                setFetching(false);
            }
        };
        loadSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const cleanData = {
                ...formData,
                phoneNumbers: formData.phoneNumbers.filter(p => p.trim() !== ""),
                addresses: formData.addresses.filter(a => a.trim() !== "")
            };

            await settingsService.update(cleanData);
            toast.success("Cập nhật cấu hình thành công!");
            setTimeout(() => window.location.reload(), 1000);
        } catch (error) {
            toast.error("Lỗi khi lưu cấu hình");
        } finally {
            setLoading(false);
        }
    };

    const handleArrayChange = (field: 'phoneNumbers' | 'addresses', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'phoneNumbers' | 'addresses') => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const removeArrayItem = (field: 'phoneNumbers' | 'addresses', index: number) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    if (fetching) return <div className="p-8 text-center text-gray-500">Đang tải cấu hình...</div>;

    return (
        <div className="w-full space-y-6">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Cấu hình phòng khám</h1>
                <p className="text-sm text-gray-500">Quản lý thông tin chung hiển thị trên toàn hệ thống</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border p-6 md:p-8 space-y-8">

                {/* Section 1: Thông tin cơ bản */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cột trái: Logo Preview */}
                    <div className="lg:col-span-1 space-y-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Logo hiển thị</label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl p-4 flex flex-col items-center justify-center min-h-[200px] bg-gray-50 dark:bg-zinc-800/50">
                            {formData.logo ? (
                                <img
                                    src={formData.logo}
                                    alt="Logo Preview"
                                    className="max-w-full max-h-40 object-contain"
                                    onError={(e) => {
                                        e.currentTarget.src = "https://placehold.co/400x400?text=Invalid+URL";
                                    }}
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Chưa có logo</p>
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.logo}
                                onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                                className="w-full pl-10 pr-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                                placeholder="Dán link ảnh logo vào đây..."
                            />
                        </div>
                    </div>

                    {/* Cột phải: Các thông tin text */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1.5">Tên phòng khám <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.clinicName}
                                    onChange={(e) => setFormData({ ...formData, clinicName: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Người đại diện</label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    value={formData.representativeName}
                                    onChange={(e) => setFormData({ ...formData, representativeName: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5">Email liên hệ</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-gray-100 dark:bg-zinc-800" />

                {/* Section 2: Thông tin liên hệ (Mảng) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Danh sách SĐT */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Số điện thoại</label>
                            <button type="button" onClick={() => addArrayItem('phoneNumbers')} className="flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded transition">
                                <Plus size={14} /> Thêm số điện thoại
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.phoneNumbers.map((phone, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <div className="relative flex-1">
                                        <Phone className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => handleArrayChange('phoneNumbers', index, e.target.value)}
                                            className="w-full pl-10 pr-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                            placeholder="Nhập số điện thoại..."
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('phoneNumbers', index)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Xóa dòng này"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Danh sách Địa chỉ */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium">Địa chỉ cơ sở</label>
                            <button type="button" onClick={() => addArrayItem('addresses')} className="flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/10 px-2 py-1 rounded transition">
                                <Plus size={14} /> Thêm địa chỉ
                            </button>
                        </div>
                        <div className="space-y-3">
                            {formData.addresses.map((address, index) => (
                                <div key={index} className="flex gap-2 group">
                                    <input
                                        type="text"
                                        value={address}
                                        onChange={(e) => handleArrayChange('addresses', index, e.target.value)}
                                        className="flex-1 px-3 py-2 rounded-lg border dark:bg-zinc-800 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                        placeholder="Nhập địa chỉ..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeArrayItem('addresses', index)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Xóa dòng này"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-400 italic text-center md:text-left order-1 md:order-1">
                        * Thay đổi cấu hình sẽ ảnh hưởng đến thông tin hiển thị trên toàn hệ thống.
                    </p>
                    <button
                        type="submit"
                        disabled={loading}
                        className="order-2 md:order-2 w-full md:w-auto px-6 py-2.5 bg-primary hover:bg-pink-600 text-white font-medium rounded-lg shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Lưu thay đổi
                    </button>
                </div>
            </form>
        </div>
    );
}