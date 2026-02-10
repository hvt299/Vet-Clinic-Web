"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, User, Stethoscope, PawPrint, Loader2, Syringe } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { vaccinationsService, PetVaccination } from "@/services/vaccinations.service";
import VaccinationModal from "@/components/admin/VaccinationModal";

export default function VaccinationsPage() {
    const [data, setData] = useState<PetVaccination[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<PetVaccination | null>(null);

    const fetchData = async () => {
        try {
            const res = await vaccinationsService.getAll();
            setData(res);
        } catch (error) { toast.error("Lỗi tải lịch tiêm phòng"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn chắc chắn muốn xóa lịch tiêm này?")) return;
        try {
            await vaccinationsService.delete(id);
            toast.success("Đã xóa thành công");
            fetchData();
        } catch (error: any) { toast.error(error.response?.data?.message || "Không thể xóa"); }
    };

    const handleOpenAdd = () => { setSelectedItem(null); setIsModalOpen(true); };
    const handleOpenEdit = (item: PetVaccination) => { setSelectedItem(item); setIsModalOpen(true); };

    const filteredData = data.filter(item =>
        (item.petId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.customerId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (item.vaccineId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "SCHEDULED": return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-medium">Đã lên lịch</span>;
            case "IN_PROGRESS": return <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 px-2.5 py-0.5 rounded text-xs font-medium">Đang thực hiện</span>;
            case "COMPLETED": return <span className="bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded text-xs font-medium">Hoàn thành</span>;
            case "MISSED": return <span className="bg-red-100 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-xs font-medium">Bỏ lỡ / Quá hạn</span>;
            default: return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded text-xs font-medium">Đã hủy</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Lịch tiêm phòng</h1>
                    <p className="text-sm text-gray-500">Quản lý lịch trình tiêm chủng cho thú cưng</p>
                </div>
                <button onClick={handleOpenAdd} className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm font-medium transition-all">
                    <Plus size={18} /> Tạo lịch tiêm
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="Tìm theo tên thú cưng, chủ nuôi hoặc tên vaccine..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Thú cưng & Chủ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Thông tin tiêm</th>
                                <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Chưa có lịch tiêm nào.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-100">
                                                    <PawPrint size={18} />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{item.petId?.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <User size={12} /> {item.customerId?.name || "Chưa rõ"}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        {/* Các cột khác */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                                                    <Syringe size={14} className="text-green-500" />
                                                    <span className="font-medium">{item.vaccineId?.name}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <Stethoscope size={12} />
                                                    BS. {item.doctorId?.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-16">Ngày tiêm:</span>
                                                    <span className="font-medium">{item.vaccinationDate ? format(new Date(item.vaccinationDate), "dd/MM/yyyy") : "N/A"}</span>
                                                </div>
                                                {item.nextVaccinationDate && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 w-16">Tái chủng:</span>
                                                        <span className="font-medium text-orange-600">{format(new Date(item.nextVaccinationDate), "dd/MM/yyyy")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => handleOpenEdit(item)} className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm" title="Sửa"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(item._id)} className="p-2 bg-custom-red text-white rounded hover:bg-red-600 transition shadow-sm" title="Xóa"><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <VaccinationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} itemToEdit={selectedItem} />
        </div>
    );
}