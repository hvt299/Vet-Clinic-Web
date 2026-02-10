"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, User, PawPrint, Calendar, Activity, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { treatmentCoursesService, TreatmentCourse } from "@/services/treatment-courses.service";
import { customersService } from "@/services/customers.service";
import { petsService } from "@/services/pets.service";

interface TreatmentCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: TreatmentCourse | null;
}

export default function TreatmentCourseModal({ isOpen, onClose, onSuccess, itemToEdit }: TreatmentCourseModalProps) {
    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        customerId: "",
        petId: "",
        diagnosisSummary: "",
        startDate: "",
        endDate: "",
        status: "ONGOING" as "ONGOING" | "RECOVERED",
    });

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                customersService.getAll(),
                petsService.getAll()
            ]).then(([c, p]) => {
                setCustomers(c);
                setPets(p);
            }).catch(() => toast.error("Lỗi tải dữ liệu danh mục"));
        }
    }, [isOpen]);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                customerId: itemToEdit.customerId?._id || "",
                petId: itemToEdit.petId?._id || "",
                diagnosisSummary: itemToEdit.diagnosisSummary,
                startDate: itemToEdit.startDate ? new Date(itemToEdit.startDate).toISOString().split('T')[0] : "",
                endDate: itemToEdit.endDate ? new Date(itemToEdit.endDate).toISOString().split('T')[0] : "",
                status: itemToEdit.status,
            });
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                customerId: "",
                petId: "",
                diagnosisSummary: "",
                startDate: today,
                endDate: "",
                status: "ONGOING",
            });
        }
    }, [itemToEdit, isOpen]);

    const availablePets = pets.filter(p => {
        const pCustId = p.customerId?._id || p.customerId;
        return pCustId === formData.customerId;
    });

    const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData({
            ...formData,
            customerId: e.target.value,
            petId: ""
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.endDate) delete (payload as any).endDate;

            if (itemToEdit) {
                await treatmentCoursesService.update(itemToEdit._id, payload);
                toast.success("Cập nhật hồ sơ thành công!");
            } else {
                await treatmentCoursesService.create(payload);
                toast.success("Tạo hồ sơ bệnh án mới thành công!");
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
                        {itemToEdit ? "Cập nhật hồ sơ bệnh án" : "Tiếp nhận ca bệnh mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    {/* Chọn Chủ & Pet */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Chủ nuôi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.customerId} onChange={handleCustomerChange} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">-- Chọn khách hàng --</option>
                                    {customers.map(c => <option key={c._id} value={c._id}>{c.name} - {c.phoneNumber}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Thú cưng <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <PawPrint className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select
                                    required
                                    value={formData.petId}
                                    onChange={e => setFormData({ ...formData, petId: e.target.value })}
                                    disabled={!formData.customerId}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                                >
                                    <option value="">-- Chọn thú cưng --</option>
                                    {availablePets.map(p => <option key={p._id} value={p._id}>{p.name} ({p.species})</option>)}
                                </select>
                            </div>
                            {!formData.customerId && (
                                <p className="text-xs text-orange-500 mt-1">* Vui lòng chọn chủ nuôi trước</p>
                            )}
                        </div>
                    </div>

                    {/* Chẩn đoán sơ bộ */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Chẩn đoán sơ bộ <span className="text-red-500">*</span></label>
                        <div className="relative">
                            <Stethoscope className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input type="text" required value={formData.diagnosisSummary} onChange={(e) => setFormData({ ...formData, diagnosisSummary: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="VD: Viêm phổi, Gãy xương chân..." />
                        </div>
                    </div>

                    {/* Thời gian */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ngày bắt đầu</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ngày kết thúc</label>
                            <input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                        </div>
                    </div>

                    {/* Trạng thái */}
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Trạng thái điều trị</label>
                        <div className="relative">
                            <Activity className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none font-medium">
                                <option value="ONGOING">Đang điều trị</option>
                                <option value="RECOVERED">Đã khỏi bệnh</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800">
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