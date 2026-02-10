"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash2, User, PawPrint, Loader2, Calendar, Activity, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { treatmentCoursesService, TreatmentCourse } from "@/services/treatment-courses.service";
import TreatmentCourseModal from "@/components/admin/TreatmentCourseModal";

export default function TreatmentCoursesPage() {
    const router = useRouter();
    const [data, setData] = useState<TreatmentCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<TreatmentCourse | null>(null);

    const fetchData = async () => {
        try {
            const res = await treatmentCoursesService.getAll();
            setData(res);
        } catch (error) { toast.error("Lỗi tải danh sách đợt điều trị"); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn chắc chắn muốn xóa hồ sơ điều trị này? Hành động này sẽ xóa luôn lịch sử các lần khám bên trong.")) return;
        try {
            await treatmentCoursesService.delete(id);
            toast.success("Đã xóa hồ sơ thành công");
            fetchData();
        } catch (error: any) { toast.error(error.response?.data?.message || "Không thể xóa"); }
    };

    const handleOpenAdd = () => { setSelectedItem(null); setIsModalOpen(true); };
    const handleOpenEdit = (item: TreatmentCourse) => { setSelectedItem(item); setIsModalOpen(true); };

    const handleViewDetail = (id: string) => {
        router.push(`/admin/treatments/${id}`);
    };

    const filteredData = data.filter(item => {
        const matchesSearch =
            (item.petId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (item.customerId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (item.diagnosisSummary?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || item.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ONGOING":
                return <span className="bg-blue-100 text-blue-700 border border-blue-200 px-2.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 w-fit"><Activity size={12} /> Đang điều trị</span>;
            case "RECOVERED":
                return <span className="bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded text-xs font-medium flex items-center gap-1 w-fit"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đã hồi phục</span>;
            default:
                return <span className="bg-gray-100 text-gray-600 border border-gray-200 px-2.5 py-0.5 rounded text-xs font-medium">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh sách ca bệnh</h1>
                    <p className="text-sm text-gray-500">Quản lý các đợt điều trị và theo dõi tiến trình</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm font-medium transition-all"
                >
                    <Plus size={18} /> Tiếp nhận ca mới
                </button>
            </div>

            {/* Filter & Search */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border flex flex-col md:flex-row gap-4">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer min-w-[180px]"
                >
                    <option value="ALL">-- Tất cả trạng thái --</option>
                    <option value="ONGOING">Đang điều trị</option>
                    <option value="RECOVERED">Đã hồi phục</option>
                </select>

                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên thú cưng, chủ nuôi hoặc chẩn đoán..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Thú cưng & Chủ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Chẩn đoán sơ bộ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Thời gian</th>
                                <th className="px-6 py-4 whitespace-nowrap">Trạng thái</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải dữ liệu...</td></tr>
                            ) : filteredData.length === 0 ? (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">Không tìm thấy hồ sơ bệnh án nào.</td></tr>
                            ) : (
                                filteredData.map((item) => (
                                    <tr key={item._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
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
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 font-medium text-gray-800 dark:text-gray-200">
                                                <FileText size={16} className="text-gray-400" />
                                                {item.diagnosisSummary}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-16">Bắt đầu:</span>
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                                        {item.startDate ? format(new Date(item.startDate), "dd/MM/yyyy") : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-gray-400 w-16">Kết thúc:</span>
                                                    <span className="font-medium text-orange-600">
                                                        {item.endDate ? format(new Date(item.endDate), "dd/MM/yyyy") : "---"}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(item.status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* Nút Xem Chi Tiết */}
                                                <button
                                                    onClick={() => handleViewDetail(item._id)}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition shadow-sm border border-blue-100"
                                                    title="Xem chi tiết & Lịch sử khám"
                                                >
                                                    <Eye size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleOpenEdit(item)}
                                                    className="p-2 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition shadow-sm border border-yellow-100"
                                                    title="Sửa thông tin chung"
                                                >
                                                    <Edit size={16} />
                                                </button>

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="p-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition shadow-sm border border-red-100"
                                                    title="Xóa hồ sơ"
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

            <TreatmentCourseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                itemToEdit={selectedItem}
            />
        </div>
    );
}