"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Calendar, Stethoscope, Activity, FileText, Thermometer, Weight, Heart, Wind } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { treatmentSessionsService, TreatmentSession } from "@/services/treatment-sessions.service";
import { doctorsService } from "@/services/doctors.service";

interface TreatmentSessionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    courseId: string;
    itemToEdit?: TreatmentSession | null;
}

export default function TreatmentSessionModal({ isOpen, onClose, onSuccess, courseId, itemToEdit }: TreatmentSessionModalProps) {
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        doctorId: "",
        examinedAt: "",
        temperature: "",
        weight: "",
        pulseRate: "",
        respiratoryRate: "",
        overallNote: "",
    });

    useEffect(() => {
        if (isOpen) {
            doctorsService.getAll()
                .then(setDoctors)
                .catch(() => toast.error("Lỗi tải danh sách bác sĩ"));
        }
    }, [isOpen]);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                doctorId: itemToEdit.doctorId?._id || "",
                examinedAt: itemToEdit.examinedAt ? format(new Date(itemToEdit.examinedAt), "yyyy-MM-dd'T'HH:mm") : "",
                temperature: itemToEdit.temperature?.toString() || "",
                weight: itemToEdit.weight?.toString() || "",
                pulseRate: itemToEdit.pulseRate?.toString() || "",
                respiratoryRate: itemToEdit.respiratoryRate?.toString() || "",
                overallNote: itemToEdit.overallNote || "",
            });
        } else {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            setFormData({
                doctorId: "",
                examinedAt: now.toISOString().slice(0, 16),
                temperature: "",
                weight: "",
                pulseRate: "",
                respiratoryRate: "",
                overallNote: "",
            });
        }
    }, [itemToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                treatmentCourseId: courseId,
                temperature: formData.temperature ? Number(formData.temperature) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
                pulseRate: formData.pulseRate ? Number(formData.pulseRate) : undefined,
                respiratoryRate: formData.respiratoryRate ? Number(formData.respiratoryRate) : undefined,
            };

            if (itemToEdit) {
                await treatmentSessionsService.update(itemToEdit._id, payload);
                toast.success("Cập nhật phiên khám thành công!");
            } else {
                await treatmentSessionsService.create(payload);
                toast.success("Thêm phiên khám mới thành công!");
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
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {itemToEdit ? "Cập nhật phiên khám" : "Thêm phiên khám mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Bác sĩ & Thời gian */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bác sĩ khám <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.doctorId} onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">-- Chọn bác sĩ --</option>
                                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Thời gian khám <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="datetime-local" required value={formData.examinedAt} onChange={(e) => setFormData({ ...formData, examinedAt: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Chỉ số sinh tồn (Vital Signs) */}
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                            <Activity size={16} className="text-primary" /> Chỉ số sinh tồn
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-500">Nhiệt độ (°C)</label>
                                <div className="relative">
                                    <Thermometer className="absolute left-2.5 top-2 text-gray-400" size={14} />
                                    <input type="number" step="0.1" placeholder="38.5" value={formData.temperature} onChange={(e) => setFormData({ ...formData, temperature: e.target.value })} className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-500">Cân nặng (kg)</label>
                                <div className="relative">
                                    <Weight className="absolute left-2.5 top-2 text-gray-400" size={14} />
                                    <input type="number" step="0.01" placeholder="5.2" value={formData.weight} onChange={(e) => setFormData({ ...formData, weight: e.target.value })} className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-500">Nhịp tim (bpm)</label>
                                <div className="relative">
                                    <Heart className="absolute left-2.5 top-2 text-gray-400" size={14} />
                                    <input type="number" placeholder="120" value={formData.pulseRate} onChange={(e) => setFormData({ ...formData, pulseRate: e.target.value })} className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium mb-1 text-gray-500">Nhịp thở (rpm)</label>
                                <div className="relative">
                                    <Wind className="absolute left-2.5 top-2 text-gray-400" size={14} />
                                    <input type="number" placeholder="30" value={formData.respiratoryRate} onChange={(e) => setFormData({ ...formData, respiratoryRate: e.target.value })} className="w-full pl-8 pr-2 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ghi chú lâm sàng */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú lâm sàng / Triệu chứng <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea required rows={3} value={formData.overallNote} onChange={(e) => setFormData({ ...formData, overallNote: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Mô tả tình trạng sức khỏe, triệu chứng..." />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 transition">Hủy bỏ</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm flex items-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu kết quả
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}