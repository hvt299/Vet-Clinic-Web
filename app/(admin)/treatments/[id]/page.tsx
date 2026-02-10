"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Calendar, User, PawPrint, Thermometer, Weight, Heart, Wind, Stethoscope, Clock, Edit, Trash2, Activity } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { treatmentCoursesService, TreatmentCourse } from "@/services/treatment-courses.service";
import { treatmentSessionsService, TreatmentSession } from "@/services/treatment-sessions.service";
import TreatmentSessionModal from "@/components/admin/TreatmentSessionModal";

export default function TreatmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<TreatmentCourse | null>(null);
    const [sessions, setSessions] = useState<TreatmentSession[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);

    const fetchData = async () => {
        try {
            const [courseData, sessionsData] = await Promise.all([
                treatmentCoursesService.getById(courseId),
                treatmentSessionsService.getByCourseId(courseId)
            ]);
            setCourse(courseData);
            setSessions(sessionsData);
        } catch (error) {
            toast.error("Không thể tải dữ liệu bệnh án");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (courseId) fetchData();
    }, [courseId]);

    const handleDeleteSession = async (sessionId: string) => {
        if (!confirm("Bạn có chắc chắn muốn xóa phiên khám này?")) return;
        try {
            await treatmentSessionsService.delete(sessionId);
            toast.success("Đã xóa phiên khám");
            fetchData();
        } catch (error) { toast.error("Không thể xóa"); }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải hồ sơ bệnh án...</div>;
    if (!course) return <div className="p-8 text-center text-red-500">Không tìm thấy hồ sơ.</div>;

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <button onClick={() => router.back()} className="p-2 rounded-lg bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 text-gray-600 transition">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        Hồ sơ: {course.diagnosisSummary}
                        {course.status === 'ONGOING'
                            ? <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded border border-blue-200">Đang điều trị</span>
                            : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200">Đã hồi phục</span>
                        }
                    </h1>
                    <p className="text-sm text-gray-500">Mã hồ sơ: #{course._id.slice(-6).toUpperCase()}</p>
                </div>
            </div>

            {/* Thông tin chung (Patient Card) */}
            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-border p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100">
                        <PawPrint size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Thú cưng</p>
                        <p className="font-semibold text-lg">{course.petId?.name}</p>
                        <p className="text-xs text-gray-400">{course.petId?.species || "Không rõ loài"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-l border-gray-100 dark:border-zinc-800 pl-0 md:pl-6">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <User size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Chủ nuôi</p>
                        <p className="font-semibold text-lg">{course.customerId?.name}</p>
                        <p className="text-xs text-gray-400">{course.customerId?.phoneNumber}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 border-l border-gray-100 dark:border-zinc-800 pl-0 md:pl-6">
                    <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-100">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Thời gian</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">
                            {format(new Date(course.startDate), "dd/MM/yyyy")}
                            <span className="mx-2 text-gray-400">→</span>
                            {course.endDate ? format(new Date(course.endDate), "dd/MM/yyyy") : "..."}
                        </p>
                    </div>
                </div>
            </div>

            {/* TIMELINE SECTION */}
            <div className="flex justify-between items-center mt-8 mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                    <Activity size={20} className="text-primary" /> Diễn biến điều trị ({sessions.length} lần khám)
                </h2>
                <button
                    onClick={() => { setSelectedSession(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-all"
                >
                    <Plus size={18} /> Thêm lần khám
                </button>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-zinc-700">
                {sessions.map((session) => (
                    <div key={session._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Dot trên timeline */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-green-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 translate-x-0 z-10">
                            <Stethoscope size={16} />
                        </div>

                        {/* Card Nội dung */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 ml-14 md:ml-0 transition hover:border-primary/30 hover:shadow-md">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock size={14} />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {format(new Date(session.examinedAt), "HH:mm - dd/MM/yyyy")}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedSession(session); setIsModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 transition"><Edit size={14} /></button>
                                    <button onClick={() => handleDeleteSession(session._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 min-h-[3rem]">
                                {session.overallNote}
                            </p>

                            {/* Chỉ số sinh tồn (Vital Grid) */}
                            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg text-xs">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Thermometer size={14} className="text-red-500" />
                                    <span>Nhiệt độ: <b>{session.temperature || "--"} °C</b></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Weight size={14} className="text-blue-500" />
                                    <span>Cân nặng: <b>{session.weight || "--"} kg</b></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Heart size={14} className="text-pink-500" />
                                    <span>Nhịp tim: <b>{session.pulseRate || "--"} bpm</b></span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Wind size={14} className="text-teal-500" />
                                    <span>Hô hấp: <b>{session.respiratoryRate || "--"} rpm</b></span>
                                </div>
                            </div>

                            <div className="mt-3 text-xs text-gray-400 flex items-center gap-1 justify-end">
                                <Stethoscope size={12} /> BS. {session.doctorId?.name}
                            </div>
                        </div>
                    </div>
                ))}

                {sessions.length === 0 && (
                    <div className="text-center py-10 ml-10 md:ml-0 text-gray-500 italic">
                        Chưa có lịch sử khám bệnh nào.
                    </div>
                )}
            </div>

            <TreatmentSessionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                courseId={courseId}
                itemToEdit={selectedSession}
            />
        </div>
    );
}