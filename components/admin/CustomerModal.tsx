"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";

interface CustomerModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    customerToEdit: any;
}

export default function CustomerModal({ isOpen, onClose, onSuccess, customerToEdit }: CustomerModalProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        gender: "UNKNOWN",
        phoneNumber: "",
        identityCard: "",
        address: "",
        note: "",
    });

    useEffect(() => {
        if (customerToEdit) {
            setFormData({
                name: customerToEdit.name,
                gender: customerToEdit.gender || "UNKNOWN",
                phoneNumber: customerToEdit.phoneNumber,
                identityCard: customerToEdit.identityCard || "",
                address: customerToEdit.address || "",
                note: customerToEdit.note || "",
            });
        } else {
            setFormData({
                name: "",
                gender: "UNKNOWN",
                phoneNumber: "",
                identityCard: "",
                address: "",
                note: ""
            });
        }
    }, [customerToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (customerToEdit) {
                await api.patch(`/customers/${customerToEdit._id}`, formData);
                toast.success("Cập nhật khách hàng thành công!");
            } else {
                await api.post("/customers", formData);
                toast.success("Thêm khách hàng mới thành công!");
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
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {customerToEdit ? "Sửa thông tin khách hàng" : "Thêm khách hàng mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Tên */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tên khách hàng <span className="text-red-500">*</span></label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Nguyễn Văn A" />
                        </div>

                        {/* SĐT */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                            <input type="tel" required value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="0912..." />
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Giới tính</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="UNKNOWN">Khác</option>
                            </select>
                        </div>

                        {/* CCCD */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">CCCD/CMND</label>
                            <input type="text" value={formData.identityCard} onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Số giấy tờ tùy thân" />
                        </div>

                        {/* Địa chỉ */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Địa chỉ</label>
                            <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Địa chỉ liên hệ" />
                        </div>

                        {/* Ghi chú */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú</label>
                            <textarea rows={2} value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Khách khó tính, khách VIP..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 transition">Hủy bỏ</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm flex items-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu lại
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}