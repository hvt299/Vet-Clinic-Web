"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { format } from "date-fns";

interface PetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    petToEdit: any;
}

export default function PetModal({ isOpen, onClose, onSuccess, petToEdit }: PetModalProps) {
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        customerId: "",
        name: "",
        species: "",
        gender: "UNKNOWN",
        dob: "",
        weight: 0,
        sterilization: false,
        characteristic: "",
        drugAllergy: "",
    });

    useEffect(() => {
        if (isOpen) {
            api.get("/customers").then((res) => setCustomers(res.data)).catch(() => { });
        }
    }, [isOpen]);

    useEffect(() => {
        if (petToEdit) {
            setFormData({
                customerId: petToEdit.customerId?._id || petToEdit.customerId || "",
                name: petToEdit.name,
                species: petToEdit.species,
                gender: petToEdit.gender || "UNKNOWN",
                dob: petToEdit.dob ? format(new Date(petToEdit.dob), "yyyy-MM-dd") : "",
                weight: petToEdit.weight || 0,
                sterilization: petToEdit.sterilization || false,
                characteristic: petToEdit.characteristic || "",
                drugAllergy: petToEdit.drugAllergy || "",
            });
        } else {
            setFormData({
                customerId: "",
                name: "",
                species: "",
                gender: "UNKNOWN",
                dob: "",
                weight: 0,
                sterilization: false,
                characteristic: "",
                drugAllergy: "",
            });
        }
    }, [petToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, weight: Number(formData.weight) };

            if (petToEdit) {
                await api.patch(`/pets/${petToEdit._id}`, payload);
                toast.success("Cập nhật thú cưng thành công!");
            } else {
                await api.post("/pets", payload);
                toast.success("Thêm thú cưng mới thành công!");
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
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50 sticky top-0 z-10">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {petToEdit ? "Hồ sơ thú cưng" : "Thêm thú cưng mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Chọn chủ nuôi */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Chủ nuôi (Khách hàng) <span className="text-red-500">*</span></label>
                            <select
                                required
                                value={formData.customerId}
                                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                            >
                                <option value="">-- Chọn khách hàng --</option>
                                {customers.map((c) => (
                                    <option key={c._id} value={c._id}>{c.name} - {c.phoneNumber}</option>
                                ))}
                            </select>
                        </div>

                        {/* Tên thú cưng */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tên thú cưng <span className="text-red-500">*</span></label>
                            <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Milu" />
                        </div>

                        {/* Loài */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loài <span className="text-red-500">*</span></label>
                            <input type="text" required value={formData.species} onChange={(e) => setFormData({ ...formData, species: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Chó, Mèo..." />
                        </div>

                        {/* Giới tính */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Giới tính</label>
                            <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                <option value="MALE">Đực</option>
                                <option value="FEMALE">Cái</option>
                                <option value="UNKNOWN">Chưa rõ</option>
                            </select>
                        </div>

                        {/* Cân nặng */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Cân nặng (kg)</label>
                            <input type="number" step="0.01" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="0.0" />
                        </div>

                        {/* Ngày sinh */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ngày sinh (Ước lượng)</label>
                            <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                        </div>

                        {/* Triệt sản */}
                        <div className="flex items-center gap-3 pt-6">
                            <input
                                type="checkbox"
                                id="sterilization"
                                checked={formData.sterilization}
                                onChange={(e) => setFormData({ ...formData, sterilization: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary/50"
                            />
                            <label htmlFor="sterilization" className="text-sm font-medium text-gray-700 dark:text-gray-300">Đã triệt sản?</label>
                        </div>

                        {/* Đặc điểm */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Đặc điểm nhận dạng</label>
                            <input type="text" value={formData.characteristic} onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Lông trắng, tai cụp..." />
                        </div>

                        {/* Dị ứng thuốc */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Dị ứng thuốc (Nếu có)</label>
                            <textarea rows={2} value={formData.drugAllergy} onChange={(e) => setFormData({ ...formData, drugAllergy: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 focus:ring-2 focus:ring-red-500/50 outline-none" placeholder="VD: Dị ứng Paracetamol..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-900 z-10">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 transition">Hủy bỏ</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm flex items-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu hồ sơ
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}