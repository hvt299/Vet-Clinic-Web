import { forwardRef } from "react";
import { format } from "date-fns";
import { TreatmentCourse } from "@/services/treatment-courses.service";
import { ClinicSettings } from "@/services/settings.service";

interface Props {
    course: TreatmentCourse;
    settings: ClinicSettings | null;
}

const PrintOverviewTemplate = forwardRef<HTMLDivElement, Props>(({ course, settings }, ref) => {
    return (
        <div ref={ref} className="p-10 font-sans bg-white text-black min-h-screen w-full">
            {/* Header: Tên phòng khám & Địa chỉ */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-medium uppercase text-gray-400 tracking-wide mb-2">
                    {settings?.clinicName || "PHÒNG KHÁM THÚ Y"}
                </h1>
                <p className="text-sm text-gray-400">
                    {settings?.addresses?.[0] || "Địa chỉ phòng khám"} | SĐT: {settings?.phoneNumbers?.[0] || "..."}
                </p>
            </div>

            {/* Tiêu đề */}
            <h2 className="text-2xl font-bold text-center uppercase mb-6 text-gray-800">
                HỒ SƠ BỆNH ÁN TỔNG QUAN
            </h2>

            {/* Khung nội dung chính */}
            <div className="border border-gray-800 p-8">
                <h3 className="font-medium text-xl uppercase mb-6 text-gray-800">
                    {settings?.clinicName || "PHÒNG KHÁM THÚ Y"}
                </h3>

                <div className="space-y-4 text-base text-gray-900">
                    <p>
                        <strong className="font-bold">Chủ nuôi:</strong> {course.customerId?.name} - {course.customerId?.phoneNumber}
                    </p>
                    <p>
                        <strong className="font-bold">Thú cưng:</strong> {course.petId?.name} {course.petId?.species ? `| Loài: ${course.petId.species}` : ''}
                    </p>
                    <p>
                        <strong className="font-bold">Ngày tiếp nhận:</strong> {format(new Date(course.startDate), "dd/MM/yyyy")}
                    </p>

                    <div className="border-b border-gray-300 my-6"></div>

                    <p>
                        <strong className="font-bold">Chẩn đoán sơ bộ:</strong> {course.diagnosisSummary}
                    </p>
                    <div className="mt-4">
                        <strong className="font-bold block mb-1">Phác đồ điều trị:</strong>
                        <span>{course.regimen === 'SURGERY' ? 'Ngoại khoa' : 'Nội khoa'}</span>
                    </div>
                </div>

                {/* Chữ ký */}
                <div className="mt-16 text-right pr-4">
                    <p className="italic text-gray-800">
                        Bác sĩ tiếp nhận: ........................................
                    </p>
                </div>
            </div>
        </div>
    );
});

PrintOverviewTemplate.displayName = "PrintOverviewTemplate";
export default PrintOverviewTemplate;