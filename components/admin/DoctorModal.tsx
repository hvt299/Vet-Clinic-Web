"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Save, User } from "lucide-react";
import { toast } from "sonner";
import { doctorsService, Doctor } from "@/services/doctors.service";

interface DoctorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    doctorToEdit?: Doctor | null;
}

export default function DoctorModal({ isOpen, onClose, onSuccess, doctorToEdit }: DoctorModalProps) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phoneNumber: "",
        identityCard: "",
        gender: "UNKNOWN" as "MALE" | "FEMALE" | "UNKNOWN",
        address: "",
        note: "",
        isActive: true,
        avatar: "",
    });

    useEffect(() => {
        if (doctorToEdit) {
            setFormData({
                name: doctorToEdit.name,
                phoneNumber: doctorToEdit.phoneNumber,
                identityCard: doctorToEdit.identityCard || "",
                gender: (doctorToEdit.gender || "UNKNOWN") as "MALE" | "FEMALE" | "UNKNOWN",
                address: doctorToEdit.address || "",
                note: doctorToEdit.note || "",
                isActive: doctorToEdit.isActive ?? true,
                avatar: doctorToEdit.avatar || "",
            });
        } else {
            setFormData({
                name: "",
                phoneNumber: "",
                identityCard: "",
                gender: "UNKNOWN" as "MALE" | "FEMALE" | "UNKNOWN",
                address: "",
                note: "",
                isActive: true,
                avatar: "",
            });
        }
    }, [doctorToEdit, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (doctorToEdit) {
                await doctorsService.update(doctorToEdit._id, formData);
                toast.success("Cập nhật thông tin bác sĩ thành công!");
            } else {
                await doctorsService.create(formData);
                toast.success("Thêm bác sĩ mới thành công!");
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
            <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden max-h-[90vh] flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-800/50">
                    <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                        {doctorToEdit ? "Cập nhật thông tin bác sĩ" : "Thêm bác sĩ mới"}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-zinc-700 transition">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Content - Scrollable */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    <form id="doctor-form" onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Tên bác sĩ */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Họ và tên <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="VD: Nguyễn Văn A"
                                />
                            </div>

                            {/* Số điện thoại */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="09xx..."
                                />
                            </div>

                            {/* CMND/CCCD */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">CMND/CCCD</label>
                                <input
                                    type="text"
                                    value={formData.identityCard}
                                    onChange={(e) => setFormData({ ...formData, identityCard: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Số giấy tờ tùy thân"
                                />
                            </div>

                            {/* Giới tính */}
                            <div>
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Giới tính</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                >
                                    <option value="UNKNOWN">Chưa xác định</option>
                                    <option value="MALE">Nam</option>
                                    <option value="FEMALE">Nữ</option>
                                </select>
                            </div>

                            {/* Avatar URL */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Avatar URL</label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={formData.avatar}
                                        onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                                        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {/* Preview ảnh nhỏ */}
                                    <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="text-gray-400" size={20} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Địa chỉ */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Địa chỉ</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Địa chỉ liên hệ..."
                                />
                            </div>

                            {/* Ghi chú */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Ghi chú</label>
                                <textarea
                                    rows={2}
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
                                    placeholder="Thông tin thêm..."
                                />
                            </div>

                            {/* Trạng thái hoạt động - Toggle Switch */}
                            <div className="md:col-span-2 flex items-center gap-3 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                <div className="relative inline-block w-10 h-6 align-middle select-none transition duration-200 ease-in">
                                    <input
                                        type="checkbox"
                                        name="toggle"
                                        id="toggle-doctor"
                                        className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer transition-transform duration-200 ease-in-out checked:translate-x-full checked:border-primary"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <label htmlFor="toggle-doctor" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer transition-colors duration-200 ${formData.isActive ? 'bg-primary' : 'bg-gray-300 dark:bg-zinc-600'}`}></label>
                                </div>
                                <label htmlFor="toggle-doctor" className="text-sm font-medium cursor-pointer text-gray-700 dark:text-gray-300">
                                    Đang làm việc (Active)
                                </label>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-zinc-800 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-zinc-800 dark:text-gray-300 transition"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        form="doctor-form"
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-pink-600 shadow-sm flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {doctorToEdit ? "Lưu thay đổi" : "Thêm mới"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}