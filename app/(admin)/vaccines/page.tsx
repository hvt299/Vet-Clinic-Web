"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Syringe, Loader2, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { vaccinesService, Vaccine } from "@/services/vaccines.service";
import VaccineModal from "@/components/admin/VaccineModal";

export default function VaccinesPage() {
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Vaccine | null>(null);

    const fetchData = async () => {
        try {
            const data = await vaccinesService.getAll();
            setVaccines(data);
        } catch (error) { toast.error("Lỗi tải danh sách vắc-xin"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa vắc-xin này?")) return;
        try {
            await vaccinesService.delete(id);
            toast.success("Đã xóa vắc-xin thành công");
            fetchData();
        } catch (error) { toast.error("Không thể xóa"); }
    };

    const handleOpenAdd = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: Vaccine) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const filteredData = vaccines.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh mục vắc-xin</h1>
                    <p className="text-sm text-gray-500">Quản lý các loại vắc-xin tiêm phòng</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
                    <Plus size={18} /> Thêm vắc-xin
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm vắc-xin..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Tên vắc-xin</th>
                                <th className="px-6 py-4 whitespace-nowrap">Mô tả / Lưu ý</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={3} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={3} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                                                <Syringe size={16} />
                                            </div>
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-md" title={item.description}>
                                            {item.description ? <div className="flex items-center gap-1"><StickyNote size={14} /> {item.description}</div> : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm"
                                                    title="Sửa"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
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
            <VaccineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} itemToEdit={selectedItem} />
        </div>
    );
}