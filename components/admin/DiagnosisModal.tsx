"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Stethoscope, FileText, Activity } from "lucide-react";
import { toast } from "sonner";
import { diagnosesService, Diagnosis } from "@/services/diagnoses.service";

interface DiagnosisModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    sessionId: string;
    itemToEdit?: Diagnosis | null;
}

export default function DiagnosisModal({ isOpen, onClose, onSuccess, sessionId, itemToEdit }: DiagnosisModalProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "PRIMARY" as "PRIMARY" | "SECONDARY",
        clinicalTest: "",
        note: "",
    });

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name,
                type: itemToEdit.type,
                clinicalTest: itemToEdit.clinicalTest || "",
                note: itemToEdit.note || "",
            });
        } else {
            setFormData({
                name: "",
                type: "PRIMARY",
                clinicalTest: "",
                note: "",
            });
        }
    }, [itemToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData, treatmentSessionId: sessionId };
            if (itemToEdit) {
                await diagnosesService.update(itemToEdit._id, payload);
                toast.success("Cập nhật chẩn đoán thành công!");
            } else {
                await diagnosesService.create(payload);
                toast.success("Thêm chẩn đoán mới thành công!");
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
            <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {itemToEdit ? "Cập nhật chẩn đoán" : "Thêm chẩn đoán bệnh"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tên bệnh / Chẩn đoán <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Stethoscope className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Viêm phổi, Ký sinh trùng máu..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Loại chẩn đoán</label>
                        <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none">
                            <option value="PRIMARY">Bệnh chính (Primary)</option>
                            <option value="SECONDARY">Bệnh kế phát / Biến chứng (Secondary)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Kết quả xét nghiệm</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <textarea rows={2} value={formData.clinicalTest} onChange={e => setFormData({ ...formData, clinicalTest: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="VD: Bạch cầu tăng, Test CPV dương tính..." />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú thêm</label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <textarea rows={2} value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Ghi chú thêm thông tin chẩn đoán" />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Hủy bỏ</button>
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