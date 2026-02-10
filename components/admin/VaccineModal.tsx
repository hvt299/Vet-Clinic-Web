"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Syringe, FileText } from "lucide-react";
import { toast } from "sonner";
import { vaccinesService, Vaccine } from "@/services/vaccines.service";

interface VaccineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: Vaccine | null;
}

export default function VaccineModal({ isOpen, onClose, onSuccess, itemToEdit }: VaccineModalProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name,
                description: itemToEdit.description || "",
            });
        } else {
            setFormData({
                name: "",
                description: ""
            });
        }
    }, [itemToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (itemToEdit) {
                await vaccinesService.update(itemToEdit._id, formData as any);
                toast.success("Cập nhật vắc-xin thành công!");
            } else {
                await vaccinesService.create(formData as any);
                toast.success("Thêm vắc-xin mới thành công!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                        {itemToEdit ? "Cập nhật vắc-xin" : "Thêm vắc-xin mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 gap-4">

                        {/* Tên vắc-xin */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Tên vắc-xin <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Syringe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                                    placeholder="VD: Vaccine Dại (Rabies)"
                                />
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300">Mô tả / Lưu ý</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none resize-none transition-all"
                                    placeholder="VD: Tiêm nhắc lại hàng năm..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700 transition"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm shadow-primary/30 flex items-center gap-2 disabled:opacity-70 transition-all"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}