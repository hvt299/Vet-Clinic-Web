"use client";

import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search, Loader2, Cat, Dog, Syringe, User, PawPrint } from "lucide-react";
import { toast } from "sonner";
import { differenceInMonths } from "date-fns";
import PetModal from "@/components/admin/PetModal";
import { petsService, Pet } from "@/services/pets.service";

export default function PetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

    const fetchPets = async () => {
        try {
            const data = await petsService.getAll();
            setPets(data);
        } catch (error) {
            toast.error("Không thể tải danh sách thú cưng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPets();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa hồ sơ thú cưng này?")) return;
        try {
            await petsService.delete(id);
            toast.success("Đã xóa thú cưng thành công");
            fetchPets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Lỗi khi xóa");
        }
    };

    const handleOpenAdd = () => {
        setSelectedPet(null);
        setIsModalOpen(true);
    };

    const handleOpenEdit = (pet: Pet) => {
        setSelectedPet(pet);
        setIsModalOpen(true);
    };

    const filteredPets = pets.filter(p =>
        (p.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (p.customerId?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    );

    const getAge = (dobString?: string) => {
        if (!dobString) return "Không rõ";
        const months = differenceInMonths(new Date(), new Date(dobString));
        if (months < 12) return `${months} tháng`;
        return `${Math.floor(months / 12)} tuổi`;
    };

    const getPetIconClass = (gender: string) => {
        switch (gender) {
            case "MALE":
                return "bg-blue-100 text-blue-700";
            case "FEMALE":
                return "bg-red-100 text-custom-red";
            default:
                return "bg-gray-100 text-gray-500";
        }
    };

    const renderPetIcon = (species?: string) => {
        const s = species?.toLowerCase() || "";
        if (s.includes("mèo")) return <Cat size={20} />;
        if (s.includes("chó")) return <Dog size={20} />;
        return <PawPrint size={20} />;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Hồ sơ thú cưng</h1>
                    <p className="text-sm text-gray-500">Quản lý bệnh án và thông tin vật nuôi</p>
                </div>
                <button
                    onClick={handleOpenAdd}
                    className="flex items-center gap-2 bg-custom-green hover:bg-green-600 text-white px-4 py-2.5 rounded-lg shadow-sm transition-all font-medium"
                >
                    <Plus size={18} />
                    Thêm thú cưng
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow-sm border border-border">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Tìm theo tên thú cưng hoặc tên chủ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-4 whitespace-nowrap">Thú cưng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Chủ sở hữu</th>
                                <th className="px-6 py-4 whitespace-nowrap">Thông tin</th>
                                <th className="px-6 py-4 whitespace-nowrap">Tình trạng</th>
                                <th className="px-6 py-4 whitespace-nowrap">Ghi chú</th>
                                <th className="px-6 py-4 text-center whitespace-nowrap">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8"><Loader2 className="animate-spin inline mr-2" />Đang tải...</td></tr>
                            ) : filteredPets.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">Không tìm thấy dữ liệu</td></tr>
                            ) : (
                                filteredPets.map((pet) => (
                                    <tr key={pet._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPetIconClass(pet.gender)}`}>
                                                    {renderPetIcon(pet.species)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{pet.name}</div>
                                                    <div className="text-xs text-gray-500">{pet.species} • {pet.gender === 'MALE' ? 'Đực' : pet.gender === 'FEMALE' ? 'Cái' : '?'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {pet.customerId ? (
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-gray-400" />
                                                    <div>
                                                        <div className="text-gray-700 dark:text-gray-300">{pet.customerId.name}</div>
                                                        <div className="text-xs text-gray-400">{pet.customerId.phoneNumber}</div>
                                                    </div>
                                                </div>
                                            ) : <span className="text-red-500 text-xs">Không có chủ</span>}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            <div>Cân nặng: {pet.weight || "?"} kg</div>
                                            <div>Tuổi: {getAge(pet.dob)}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {pet.sterilization ? (
                                                <span className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-0.5 rounded text-xs w-fit">
                                                    <Syringe size={12} /> Đã triệt sản
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Chưa triệt sản</span>
                                            )}
                                            {pet.drugAllergy && (
                                                <div className="mt-1 text-xs text-red-500 font-medium bg-red-50 px-2 py-0.5 rounded border border-red-100 w-fit">
                                                    ⚠️ Dị ứng: {pet.drugAllergy}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 truncate max-w-[150px]" title={pet.characteristic}>
                                            {pet.characteristic || "-"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenEdit(pet)}
                                                    className="p-2 bg-custom-yellow text-white rounded hover:bg-yellow-500 transition shadow-sm"
                                                    title="Sửa hồ sơ"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pet._id)}
                                                    className="p-2 bg-custom-red text-white rounded hover:bg-red-600 transition shadow-sm"
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

            <PetModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchPets}
                petToEdit={selectedPet}
            />
        </div>
    );
}