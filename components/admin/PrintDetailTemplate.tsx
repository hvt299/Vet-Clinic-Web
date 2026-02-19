import { forwardRef } from "react";
import { format } from "date-fns";
import { TreatmentCourse } from "@/services/treatment-courses.service";
import { ClinicSettings } from "@/services/settings.service";

interface ExtendedSession {
    _id: string;
    examinedAt: string;
    doctorId: { name: string };
    temperature?: number;
    weight?: number;
    pulseRate?: number;
    respiratoryRate?: number;
    overallNote: string;
    diagnoses: any[];
    prescriptions: any[];
}

interface Props {
    course: TreatmentCourse;
    sessions: ExtendedSession[];
    settings: ClinicSettings | null;
}

const PrintDetailTemplate = forwardRef<HTMLDivElement, Props>(({ course, sessions, settings }, ref) => {
    return (
        <div ref={ref} className="p-10 font-sans bg-white text-black min-h-screen w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-medium uppercase text-gray-400 tracking-wide mb-2">
                    {settings?.clinicName || "PHÒNG KHÁM THÚ Y"}
                </h1>
                <p className="text-sm text-gray-400">
                    {settings?.addresses?.[0] || "Địa chỉ phòng khám"} | SĐT: {settings?.phoneNumbers?.[0] || "..."}
                </p>
            </div>

            <h2 className="text-2xl font-bold text-center uppercase mb-6 text-gray-800">
                HỒ SƠ BỆNH ÁN CHI TIẾT
            </h2>

            {/* BOX THÔNG TIN CHUNG */}
            <div className="border border-gray-800 p-8 mb-8">
                <h3 className="font-medium text-xl uppercase mb-6 text-gray-800">
                    {settings?.clinicName || "PHÒNG KHÁM THÚ Y"}
                </h3>
                <div className="space-y-4 text-base text-gray-900">
                    <p><strong className="font-bold">Chủ nuôi:</strong> {course.customerId?.name} - {course.customerId?.phoneNumber}</p>
                    <p>
                        <strong className="font-bold">Thú cưng:</strong> {course.petId?.name} | <strong className="font-bold">Cân nặng (lần khám cuối):</strong> {sessions.length > 0 && sessions[0].weight ? `${sessions[0].weight}kg` : '--'}
                    </p>
                    <p><strong className="font-bold">Ngày tiếp nhận:</strong> {format(new Date(course.startDate), "dd/MM/yyyy")}</p>
                    <div className="border-b border-gray-300 my-6"></div>
                    <p><strong className="font-bold">Chẩn đoán:</strong> {course.diagnosisSummary}</p>
                    <p><strong className="font-bold">Phác đồ điều trị:</strong> {course.regimen === 'SURGERY' ? 'Ngoại khoa' : 'Nội khoa'}</p>
                </div>
            </div>

            {/* DANH SÁCH LẦN KHÁM CHI TIẾT */}
            <h3 className="font-bold text-lg uppercase mb-4 text-gray-800 border-b-2 border-gray-400 pb-2">
                Diễn biến điều trị & Y lệnh
            </h3>

            {sessions.length === 0 ? (
                <p className="text-sm italic text-gray-500">Chưa có dữ liệu khám bệnh.</p>
            ) : (
                <div className="space-y-6">
                    {sessions.map((session, index) => (
                        <div key={session._id} className="border border-gray-400 p-4 text-sm break-inside-avoid">
                            <div className="flex justify-between items-center mb-3 border-b border-gray-200 pb-2">
                                <span className="font-bold text-base text-gray-900">Lần {sessions.length - index}: {format(new Date(session.examinedAt), "HH:mm - dd/MM/yyyy")}</span>
                                <span className="italic text-gray-600">Bác sĩ: {session.doctorId?.name}</span>
                            </div>

                            <div className="flex gap-6 mb-3 bg-gray-50 p-2 border border-gray-200">
                                <span><strong>Nhiệt độ:</strong> {session.temperature || '--'} °C</span>
                                <span><strong>Nhịp tim:</strong> {session.pulseRate || '--'} bpm</span>
                                <span><strong>Hô hấp:</strong> {session.respiratoryRate || '--'} rpm</span>
                            </div>

                            <p className="mb-3"><strong>Ghi chú lâm sàng:</strong> {session.overallNote}</p>

                            {session.diagnoses.length > 0 && (
                                <div className="mb-3">
                                    <strong>Chẩn đoán chi tiết:</strong>
                                    <ul className="list-disc pl-5 mt-1">
                                        {session.diagnoses.map(d => (
                                            <li key={d._id}>{d.name} {d.type === 'SECONDARY' && <span className="italic text-gray-500">(Phụ)</span>} {d.clinicalTest && `- XN: ${d.clinicalTest}`}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {session.prescriptions.length > 0 && (
                                <div className="mt-4">
                                    <strong>Đơn thuốc thực hiện:</strong>
                                    <table className="w-full text-left border-collapse border border-gray-400 mt-2">
                                        <thead>
                                            <tr className="bg-gray-100">
                                                <th className="border border-gray-400 px-3 py-1.5 font-semibold">Tên thuốc</th>
                                                <th className="border border-gray-400 px-3 py-1.5 font-semibold text-center">Đường dùng</th>
                                                <th className="border border-gray-400 px-3 py-1.5 font-semibold text-center">Liều lượng</th>
                                                <th className="border border-gray-400 px-3 py-1.5 font-semibold">Ghi chú</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {session.prescriptions.map(p => (
                                                <tr key={p._id}>
                                                    <td className="border border-gray-400 px-3 py-1.5">{p.medicineId?.name}</td>
                                                    <td className="border border-gray-400 px-3 py-1.5 text-center">{p.route}</td>
                                                    <td className="border border-gray-400 px-3 py-1.5 text-center">{p.dosage} {p.unit}</td>
                                                    <td className="border border-gray-400 px-3 py-1.5">{p.frequency} {p.note && `(${p.note})`}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Chữ ký Bác sĩ khám cuối */}
            {sessions.length > 0 && (
                <div className="mt-16 flex justify-end break-inside-avoid">
                    <div className="text-center w-64">
                        <p className="italic mb-16">Ngày ..... tháng ..... năm 202...</p>
                        <p className="font-bold text-gray-900 uppercase">Bác sĩ điều trị</p>
                        <p className="mt-2">{sessions[0].doctorId?.name}</p>
                    </div>
                </div>
            )}
        </div>
    );
});

PrintDetailTemplate.displayName = "PrintDetailTemplate";
export default PrintDetailTemplate;