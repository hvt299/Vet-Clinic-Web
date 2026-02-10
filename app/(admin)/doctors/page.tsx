"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Phone, MapPin, Loader2, User } from "lucide-react";
import { toast } from "sonner";
import { doctorsService, Doctor } from "@/services/doctors.service";
import DoctorModal from "@/components/admin/DoctorModal";

export default function DoctorsPage() {
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);

    const fetchDoctors = async () => {
        try {
            const data = await doctorsService.getAll();
            setDoctors(data);
        } catch (error) {
            toast.error("Lỗi tải danh sách bác sĩ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bác sĩ này không? Hành động này không thể hoàn tác.")) {
            try {
                await doctorsService.delete(id);
                toast.success("Xóa bác sĩ thành công!");
                fetchDoctors();
            } catch (error) {
                toast.error("Không thể xóa bác sĩ này");
            }
        }
    };

    const handleOpenAdd = () => {
        setEditingDoctor(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (doc: Doctor) => {
        setEditingDoctor(doc);
        setIsModalOpen(true);
    };

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.phoneNumber.includes(searchTerm)
    );

    const getGenderBadge = (gender?: string) => {
        switch (gender) {
            case 'MALE': return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded text-xs font-medium">Nam</span>;
            case 'FEMALE': return <span className="bg-red-100 text-custom-red border border-red-200 px-2 py-0.5 rounded text-xs font-medium">Nữ</span>;
            default: return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded text-xs font-medium">Khác</span>;
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Quản lý bác sĩ</h1>
                    <p className="text-gray-500 text-sm">Danh sách đội ngũ bác sĩ và chuyên gia</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
                    <Plus size={18} /> Thêm bác sĩ
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-gray-200 dark:border-zinc-700">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Bác sĩ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Liên hệ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Giới tính</th>
                                <th className="px-6 py-4 whitespace-nowrap">Địa chỉ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td>
                                </tr>
                            ) : filteredDoctors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        Không tìm thấy bác sĩ nào.
                                    </td>
                                </tr>
                            ) : (
                                filteredDoctors.map((doc) => (
                                    <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary overflow-hidden border border-gray-100 dark:border-zinc-700 shrink-0">
                                                    {doc.avatar ? (
                                                        <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={20} />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">{doc.name}</p>
                                                    <p className="text-xs text-gray-400 font-normal mt-0.5">{doc.identityCard ? `CCCD: ${doc.identityCard}` : "Chưa có CCCD"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Phone size={14} /> {doc.phoneNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getGenderBadge(doc.gender)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 truncate max-w-[200px]" title={doc.address}>
                                            {doc.address ? <div className="flex items-center gap-1"><MapPin size={14} /> {doc.address}</div> : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${doc.isActive
                                                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30"
                                                : "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30"
                                                }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${doc.isActive ? "bg-green-500" : "bg-red-500"}`}></span>
                                                {doc.isActive ? "Đang làm việc" : "Ngưng hoạt động"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(doc)}
                                                    className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm"
                                                    title="Sửa thông tin"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(doc._id)}
                                                    className="p-2 bg-custom-red text-white rounded hover:bg-red-600 transition shadow-sm"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <DoctorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchDoctors}
                doctorToEdit={editingDoctor}
            />
        </div>
    );
}