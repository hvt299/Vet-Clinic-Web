"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Plus, Calendar, User, PawPrint, Thermometer, Weight, Heart, Wind, Stethoscope, Clock, Edit, Trash2, Activity, Pill, Syringe, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { treatmentCoursesService, TreatmentCourse } from "@/services/treatment-courses.service";
import { treatmentSessionsService, TreatmentSession } from "@/services/treatment-sessions.service";
import { diagnosesService, Diagnosis } from "@/services/diagnoses.service";
import { prescriptionsService, Prescription } from "@/services/prescriptions.service";

import TreatmentSessionModal from "@/components/admin/TreatmentSessionModal";
import DiagnosisModal from "@/components/admin/DiagnosisModal";
import PrescriptionModal from "@/components/admin/PrescriptionModal";

interface TreatmentSessionExtended extends TreatmentSession {
    diagnoses: Diagnosis[];
    prescriptions: Prescription[];
}

export default function TreatmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;

    const [course, setCourse] = useState<TreatmentCourse | null>(null);
    const [sessions, setSessions] = useState<TreatmentSessionExtended[]>([]);
    const [loading, setLoading] = useState(true);

    const [sessionModalOpen, setSessionModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState<TreatmentSession | null>(null);

    const [diagnosisModalOpen, setDiagnosisModalOpen] = useState(false);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState<Diagnosis | null>(null);
    const [activeSessionId, setActiveSessionId] = useState<string>("");

    const [prescriptionModalOpen, setPrescriptionModalOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

    const fetchData = async () => {
        try {
            const [courseData, sessionsData] = await Promise.all([
                treatmentCoursesService.getById(courseId),
                treatmentSessionsService.getByCourseId(courseId)
            ]);

            setCourse(courseData);

            const enhancedSessions = await Promise.all(sessionsData.map(async (session) => {
                const [diagnoses, prescriptions] = await Promise.all([
                    diagnosesService.getBySessionId(session._id),
                    prescriptionsService.getBySessionId(session._id)
                ]);
                return { ...session, diagnoses, prescriptions };
            }));

            setSessions(enhancedSessions);
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
        try { await treatmentSessionsService.delete(sessionId); toast.success("Đã xóa phiên khám"); fetchData(); } catch { toast.error("Lỗi xóa"); }
    };
    const handleDeleteDiagnosis = async (id: string) => {
        if (!confirm("Xóa chẩn đoán này?")) return;
        try { await diagnosesService.delete(id); toast.success("Đã xóa chẩn đoán"); fetchData(); } catch { toast.error("Lỗi xóa"); }
    };
    const handleDeletePrescription = async (id: string) => {
        if (!confirm("Xóa thuốc này?")) return;
        try { await prescriptionsService.delete(id); toast.success("Đã xóa thuốc"); fetchData(); } catch { toast.error("Lỗi xóa"); }
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

            {/* Thông tin chung */}
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
                    onClick={() => { setSelectedSession(null); setSessionModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary hover:bg-pink-600 text-white px-4 py-2 rounded-lg shadow-sm font-medium transition-all"
                >
                    <Plus size={18} /> Thêm lần khám
                </button>
            </div>

            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent dark:before:via-zinc-700">
                {sessions.map((session) => (
                    <div key={session._id} className="relative flex items-center justify-between md:justify-normal md:even:flex-row-reverse group is-active">
                        {/* Dot */}
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-zinc-900 bg-green-500 text-white shadow shrink-0 absolute left-0 md:left-1/2 translate-x-0 md:-translate-x-1/2 z-10">
                            <Stethoscope size={16} />
                        </div>

                        {/* Card Nội dung */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-zinc-900 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-800 ml-14 md:ml-0 transition hover:border-primary/30 hover:shadow-md">
                            {/* Header Card */}
                            <div className="flex justify-between items-start mb-2 border-b border-gray-100 dark:border-zinc-800 pb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <Clock size={14} />
                                    <span className="font-medium text-gray-700 dark:text-gray-300">
                                        {format(new Date(session.examinedAt), "HH:mm - dd/MM/yyyy")}
                                    </span>
                                    <span className="text-xs px-2 py-0.5 bg-gray-100 rounded text-gray-600">
                                        BS. {session.doctorId?.name}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={() => { setSelectedSession(session); setSessionModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-500 transition"><Edit size={14} /></button>
                                    <button onClick={() => handleDeleteSession(session._id)} className="p-1.5 text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                                </div>
                            </div>

                            <p className="text-gray-800 dark:text-gray-200 font-medium mb-3 italic">
                                "{session.overallNote}"
                            </p>

                            {/* 1. Chỉ số sinh tồn */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <Thermometer size={18} className="text-red-500 mb-1" />
                                    <span className="text-xs text-gray-400">Nhiệt độ</span>
                                    <b className="text-gray-700 dark:text-gray-200">{session.temperature || "--"} °C</b>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <Weight size={18} className="text-blue-500 mb-1" />
                                    <span className="text-xs text-gray-400">Cân nặng</span>
                                    <b className="text-gray-700 dark:text-gray-200">{session.weight || "--"} kg</b>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <Activity size={18} className="text-pink-500 mb-1" />
                                    <span className="text-xs text-gray-400">Nhịp tim</span>
                                    <b className="text-gray-700 dark:text-gray-200">{session.pulseRate || "--"} bpm</b>
                                </div>
                                <div className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg border border-gray-100 dark:border-zinc-800">
                                    <Wind size={18} className="text-teal-500 mb-1" />
                                    <span className="text-xs text-gray-400">Hô hấp</span>
                                    <b className="text-gray-700 dark:text-gray-200">{session.respiratoryRate || "--"} rpm</b>
                                </div>
                            </div>

                            {/* 2. Chẩn đoán */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1"><Activity size={12} /> Chẩn đoán</h4>
                                    <button onClick={() => { setActiveSessionId(session._id); setSelectedDiagnosis(null); setDiagnosisModalOpen(true); }} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus size={10} /> Chẩn đoán</button>
                                </div>
                                {session.diagnoses.length > 0 ? (
                                    <ul className="space-y-1">
                                        {session.diagnoses.map(diag => (
                                            <li key={diag._id} className="text-sm bg-orange-50 dark:bg-orange-900/10 p-2 rounded border border-orange-100 dark:border-orange-900/20 group/item flex justify-between items-start">
                                                <div>
                                                    <div className="flex items-center flex-wrap gap-2">
                                                        <span className="font-semibold text-orange-700 dark:text-orange-400">{diag.name}</span>
                                                        {diag.type === 'SECONDARY' && <span className="text-[10px] bg-orange-200 text-orange-800 px-1 rounded">Phụ</span>}
                                                    </div>

                                                    {diag.clinicalTest && (
                                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                            <span className="font-medium">Xét nghiệm:</span> {diag.clinicalTest}
                                                        </div>
                                                    )}

                                                    {diag.note && (
                                                        <div className="text-xs text-gray-500 italic mt-0.5">
                                                            Ghi chú: {diag.note}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="hidden group-hover/item:flex gap-1">
                                                    <button onClick={() => { setActiveSessionId(session._id); setSelectedDiagnosis(diag); setDiagnosisModalOpen(true); }} className="p-1 text-gray-400 hover:text-blue-500"><Edit size={12} /></button>
                                                    <button onClick={() => handleDeleteDiagnosis(diag._id)} className="p-1 text-gray-400 hover:text-red-500"><Trash2 size={12} /></button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-xs text-gray-400 italic">Chưa có chẩn đoán</p>}
                            </div>

                            {/* 3. Y lệnh thuốc */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1"><Pill size={12} /> Đơn thuốc / Y lệnh</h4>
                                    <button onClick={() => { setActiveSessionId(session._id); setSelectedPrescription(null); setPrescriptionModalOpen(true); }} className="text-xs text-primary hover:underline flex items-center gap-1"><Plus size={10} /> Kê đơn</button>
                                </div>
                                {session.prescriptions.length > 0 ? (
                                    <ul className="space-y-2">
                                        {session.prescriptions.map(pres => (
                                            <li key={pres._id} className="text-sm bg-blue-50 dark:bg-blue-900/10 p-2.5 rounded-lg border border-blue-100 dark:border-blue-900/20 group/item flex justify-between items-start transition hover:shadow-sm">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-blue-700 dark:text-blue-400">{pres.medicineId?.name}</span>
                                                        <span className="text-[10px] bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                                                            <Syringe size={10} /> {pres.route}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        Dùng <b>{pres.dosage} {pres.unit}</b> • {pres.frequency}
                                                    </div>
                                                    {pres.note && <div className="text-xs text-gray-500 italic mt-0.5">Note: {pres.note}</div>}
                                                </div>
                                                <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                                    <button onClick={() => { setActiveSessionId(session._id); setSelectedPrescription(pres); setPrescriptionModalOpen(true); }} className="p-1.5 text-gray-400 hover:text-blue-600 bg-white dark:bg-zinc-800 rounded shadow-sm border border-gray-100 dark:border-zinc-700"><Edit size={12} /></button>
                                                    <button onClick={() => handleDeletePrescription(pres._id)} className="p-1.5 text-gray-400 hover:text-red-600 bg-white dark:bg-zinc-800 rounded shadow-sm border border-gray-100 dark:border-zinc-700"><Trash2 size={12} /></button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-xs text-gray-400 italic">Chưa kê đơn thuốc</p>}
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

            {/* Modals */}
            <TreatmentSessionModal
                isOpen={sessionModalOpen} onClose={() => setSessionModalOpen(false)} onSuccess={fetchData}
                courseId={courseId} itemToEdit={selectedSession}
            />

            <DiagnosisModal
                isOpen={diagnosisModalOpen} onClose={() => setDiagnosisModalOpen(false)} onSuccess={fetchData}
                sessionId={activeSessionId} itemToEdit={selectedDiagnosis}
            />

            <PrescriptionModal
                isOpen={prescriptionModalOpen} onClose={() => setPrescriptionModalOpen(false)} onSuccess={fetchData}
                sessionId={activeSessionId} itemToEdit={selectedPrescription}
            />
        </div>
    );
}