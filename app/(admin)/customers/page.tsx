"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Loader2, Phone, MapPin, StickyNote } from "lucide-react";
import { toast } from "sonner";
import CustomerModal from "@/components/admin/CustomerModal";
import { customersService, Customer } from "@/services/customers.service";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const fetchCustomers = async () => {
        try {
            const data = await customersService.getAll();
            setCustomers(data);
        } catch (error) {
            toast.error("Không thể tải danh sách khách hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) return;
        try {
            await customersService.delete(id);
            toast.success("Đã xóa khách hàng thành công");
            fetchCustomers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa");
        }
    };

    const handleOpenAdd = () => {
        setSelectedCustomer(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (customer: Customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const filteredCustomers = customers.filter(c =>
        (c.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (c.phoneNumber || "").includes(searchTerm)
    );

    const getGenderBadge = (gender: string) => {
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
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Danh sách khách hàng</h1>
                    <p className="text-sm text-gray-500">Quản lý thông tin chủ nuôi thú cưng</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
                    <Plus size={18} />
                    Thêm khách hàng
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên hoặc số điện thoại..."
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
                                <th className="px-6 py-4 whitespace-nowrap">Khách hàng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Liên hệ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Giới tính</th>
                                <th className="px-6 py-4 whitespace-nowrap">Địa chỉ</th>
                                <th className="px-6 py-4 whitespace-nowrap">Ghi chú</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td></tr>
                            ) : filteredCustomers.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu</td></tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            {customer.name}
                                            {customer.identityCard && <div className="text-xs text-gray-400 font-normal mt-0.5">CMND: {customer.identityCard}</div>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                                <Phone size={14} /> {customer.phoneNumber}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getGenderBadge(customer.gender)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 truncate max-w-[200px]" title={customer.address}>
                                            {customer.address ? <div className="flex items-center gap-1"><MapPin size={14} /> {customer.address}</div> : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 truncate max-w-[150px]" title={customer.note}>
                                            {customer.note ? <div className="flex items-center gap-1"><StickyNote size={14} /> {customer.note}</div> : "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(customer)}
                                                    className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm"
                                                    title="Sửa"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(customer._id)}
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

            <CustomerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCustomers}
                customerToEdit={selectedCustomer}
            />
        </div>
    );
}