"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Pill, Syringe, Clock, Scale, FileText } from "lucide-react";
import { toast } from "sonner";
import { prescriptionsService, Prescription } from "@/services/prescriptions.service";
import { medicinesService, Medicine } from "@/services/medicines.service";

interface PrescriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    sessionId: string;
    itemToEdit?: Prescription | null;
}

export default function PrescriptionModal({ isOpen, onClose, onSuccess, sessionId, itemToEdit }: PrescriptionModalProps) {
    const [loading, setLoading] = useState(false);
    const [medicines, setMedicines] = useState<Medicine[]>([]);

    const [formData, setFormData] = useState({
        medicineId: "",
        route: "PO" as "PO" | "IM" | "IV" | "SC",
        dosage: "",
        unit: "ml",
        frequency: "",
        status: "IN_PROGRESS" as "IN_PROGRESS" | "COMPLETED",
        note: "",
    });

    useEffect(() => {
        if (isOpen) {
            medicinesService.getAll()
                .then(setMedicines)
                .catch(() => toast.error("Lỗi tải danh sách thuốc"));
        }
    }, [isOpen]);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                medicineId: itemToEdit.medicineId?._id || "",
                route: itemToEdit.route,
                dosage: itemToEdit.dosage.toString(),
                unit: itemToEdit.unit,
                frequency: itemToEdit.frequency,
                status: itemToEdit.status,
                note: itemToEdit.note || "",
            });
        } else {
            setFormData({
                medicineId: "",
                route: "PO",
                dosage: "",
                unit: "ml",
                frequency: "",
                status: "IN_PROGRESS",
                note: "",
            });
        }
    }, [itemToEdit, isOpen]);

    const handleMedicineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const medId = e.target.value;
        const selectedMed = medicines.find(m => m._id === medId);

        setFormData(prev => ({
            ...prev,
            medicineId: medId,
            route: selectedMed?.route || "PO"
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                ...formData,
                treatmentSessionId: sessionId,
                dosage: parseFloat(formData.dosage),
            };

            if (itemToEdit) {
                await prescriptionsService.update(itemToEdit._id, payload);
                toast.success("Cập nhật đơn thuốc thành công!");
            } else {
                await prescriptionsService.create(payload);
                toast.success("Kê đơn thuốc thành công!");
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
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {itemToEdit ? "Sửa đơn thuốc" : "Kê đơn thuốc"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tên thuốc <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Pill className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.medicineId} onChange={handleMedicineChange} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">-- Chọn thuốc --</option>
                                    {medicines.map(m => <option key={m._id} value={m._id}>{m.name} ({m.route})</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Đường dùng</label>
                            <div className="relative">
                                <Syringe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.route} onChange={e => setFormData({ ...formData, route: e.target.value as any })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="PO">Đường uống (PO)</option>
                                    <option value="IM">Tiêm bắp (IM)</option>
                                    <option value="IV">Tiêm tĩnh mạch (IV)</option>
                                    <option value="SC">Tiêm dưới da (SC)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Liều lượng</label>
                                <div className="relative">
                                    <Scale className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                    <input type="number" step="any" required value={formData.dosage} onChange={e => setFormData({ ...formData, dosage: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="0" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Đơn vị</label>
                                <select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="ml">ml</option>
                                    <option value="mg">mg</option>
                                    <option value="mg/kg">mg/kg</option>
                                    <option value="g">g</option>
                                    <option value="viên">viên</option>
                                    <option value="giọt">giọt</option>
                                    <option value="%">%</option>
                                </select>
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tần suất / Cách dùng</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="text" required value={formData.frequency} onChange={e => setFormData({ ...formData, frequency: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Sáng 1, Chiều 1" />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="text" value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Ghi chú thêm thông tin đơn thuốc" />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-900 z-10">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition">Hủy bỏ</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm flex items-center gap-2 disabled:opacity-70">
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Lưu đơn
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
}