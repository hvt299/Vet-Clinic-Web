"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Pill, Loader2, StickyNote } from "lucide-react";
import { toast } from "sonner";
import { medicinesService, Medicine } from "@/services/medicines.service";
import MedicineModal from "@/components/admin/MedicineModal";

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);

    const fetchData = async () => {
        try {
            const data = await medicinesService.getAll();
            setMedicines(data);
        } catch (error) { toast.error("Lỗi tải danh sách thuốc"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa thuốc này?")) return;
        try {
            await medicinesService.delete(id);
            toast.success("Đã xóa thuốc thành công");
            fetchData();
        } catch (error) { toast.error("Không thể xóa"); }
    };

    const handleOpenAdd = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (item: Medicine) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const filteredData = medicines.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const getRouteBadge = (route: string) => {
        switch (route) {
            case 'PO': return <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-medium">Uống (PO)</span>;
            case 'IM': return <span className="bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded text-xs font-medium">Tiêm bắp (IM)</span>;
            case 'IV': return <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded text-xs font-medium">Tĩnh mạch (IV)</span>;
            case 'SC': return <span className="bg-orange-50 text-orange-700 border border-orange-200 px-2.5 py-0.5 rounded text-xs font-medium">Dưới da (SC)</span>;
            default: return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded text-xs font-medium">{route}</span>;
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh mục thuốc</h1>
                    <p className="text-sm text-gray-500">Quản lý kho thuốc và dược phẩm</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
                    <Plus size={18} /> Thêm thuốc
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm thuốc..."
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
                                <th className="px-6 py-4 whitespace-nowrap">Tên thuốc</th>
                                <th className="px-6 py-4 whitespace-nowrap">Đường dùng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Mô tả / Công dụng</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-2 text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 flex items-center justify-center">
                                                <Pill size={16} />
                                            </div>
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getRouteBadge(item.route)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 truncate max-w-xs" title={item.description}>
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
            <MedicineModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchData} itemToEdit={selectedItem} />
        </div>
    );
}