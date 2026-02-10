"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, Calendar, Syringe, Stethoscope, PawPrint, FileText, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { vaccinationsService, PetVaccination } from "@/services/vaccinations.service";
import { customersService } from "@/services/customers.service";
import { petsService } from "@/services/pets.service";
import { vaccinesService } from "@/services/vaccines.service";
import { doctorsService } from "@/services/doctors.service";

interface VaccinationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: PetVaccination | null;
}

export default function VaccinationModal({ isOpen, onClose, onSuccess, itemToEdit }: VaccinationModalProps) {
    const [loading, setLoading] = useState(false);

    const [customers, setCustomers] = useState<any[]>([]);
    const [pets, setPets] = useState<any[]>([]);
    const [vaccines, setVaccines] = useState<any[]>([]);
    const [doctors, setDoctors] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        petId: "",
        customerId: "",
        vaccineId: "",
        doctorId: "",
        vaccinationDate: "",
        nextVaccinationDate: "",
        status: "SCHEDULED" as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED',
        note: "",
    });

    useEffect(() => {
        if (isOpen) {
            Promise.all([
                customersService.getAll(),
                petsService.getAll(),
                vaccinesService.getAll(),
                doctorsService.getAll()
            ]).then(([c, p, v, d]) => {
                setCustomers(c);
                setPets(p);
                setVaccines(v);
                setDoctors(d);
            }).catch(() => toast.error("Lỗi tải dữ liệu danh mục"));
        }
    }, [isOpen]);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                petId: itemToEdit.petId?._id || "",
                customerId: itemToEdit.customerId?._id || "",
                vaccineId: itemToEdit.vaccineId?._id || "",
                doctorId: itemToEdit.doctorId?._id || "",
                vaccinationDate: itemToEdit.vaccinationDate ? format(new Date(itemToEdit.vaccinationDate), "yyyy-MM-dd") : "",
                nextVaccinationDate: itemToEdit.nextVaccinationDate ? format(new Date(itemToEdit.nextVaccinationDate), "yyyy-MM-dd") : "",
                status: itemToEdit.status as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED',
                note: itemToEdit.note || "",
            });
        } else {
            const today = new Date().toISOString().split('T')[0];
            setFormData({
                petId: "",
                customerId: "",
                vaccineId: "",
                doctorId: "",
                vaccinationDate: today,
                nextVaccinationDate: "",
                status: "SCHEDULED" as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED',
                note: "",
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

        if (!formData.customerId) {
            toast.error("Không tìm thấy thông tin chủ nuôi của thú cưng này!");
            return;
        }

        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.nextVaccinationDate) delete (payload as any).nextVaccinationDate;

            if (itemToEdit) {
                await vaccinationsService.update(itemToEdit._id, payload);
                toast.success("Cập nhật lịch tiêm thành công!");
            } else {
                await vaccinationsService.create(payload);
                toast.success("Tạo lịch tiêm mới thành công!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const msg = error.response?.data?.message;
            if (Array.isArray(msg)) {
                msg.forEach(m => toast.error(m));
            } else {
                toast.error(msg || "Có lỗi xảy ra");
            }
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
                        {itemToEdit ? "Cập nhật lịch tiêm" : "Tạo lịch tiêm mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* 1. Chọn Chủ nuôi trước */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Chủ nuôi <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select
                                    required
                                    value={formData.customerId}
                                    onChange={handleCustomerChange}
                                    className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                >
                                    <option value="">-- Chọn khách hàng --</option>
                                    {customers.map(c => (
                                        <option key={c._id} value={c._id}>
                                            {c.name} - {c.phoneNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* 2. Chọn Thú cưng (Đã lọc theo chủ) */}
                        <div>
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
                                    {availablePets.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.name} ({p.species})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {/* Gợi ý nếu chưa chọn chủ */}
                            {!formData.customerId && (
                                <p className="text-xs text-orange-500 mt-1">* Vui lòng chọn chủ nuôi trước</p>
                            )}
                        </div>

                        {/* Chọn Vaccine */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Vắc-xin <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Syringe className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.vaccineId} onChange={e => setFormData({ ...formData, vaccineId: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">-- Chọn vắc-xin --</option>
                                    {vaccines.map(v => <option key={v._id} value={v._id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Chọn Bác sĩ */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Bác sĩ <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Stethoscope className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <select required value={formData.doctorId} onChange={e => setFormData({ ...formData, doctorId: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                    <option value="">-- Chọn bác sĩ --</option>
                                    {doctors.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Ngày tiêm */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ngày tiêm <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="date" required value={formData.vaccinationDate} onChange={e => setFormData({ ...formData, vaccinationDate: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                        </div>

                        {/* Ngày tái chủng */}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tái chủng (Dự kiến)</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input type="date" value={formData.nextVaccinationDate} onChange={e => setFormData({ ...formData, nextVaccinationDate: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none" />
                            </div>
                        </div>

                        {/* Trạng thái */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Trạng thái</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'MISSED' })} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none">
                                <option value="SCHEDULED">Đã lên lịch</option>
                                <option value="IN_PROGRESS">Đang thực hiện</option>
                                <option value="COMPLETED">Hoàn thành</option>
                                <option value="MISSED">Bỏ lỡ / Quá hạn</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </select>
                        </div>

                        {/* Ghi chú */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú</label>
                            <div className="relative">
                                <FileText className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <textarea rows={2} value={formData.note} onChange={e => setFormData({ ...formData, note: e.target.value })} className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none resize-none" placeholder="Phản ứng sau tiêm..." />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 sticky bottom-0 bg-white dark:bg-zinc-900 z-10">
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