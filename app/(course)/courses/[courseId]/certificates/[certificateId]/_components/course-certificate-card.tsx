"use client";

import { Award } from "lucide-react";
import { format } from "date-fns";


interface Props {
  certificateId: string;
  courseId: string;
  userId: string;     // ID de Clerk
  courseTitle: string;
  level?: string;
  completionDate: Date;
  userName: string;
  userEmail?: string;
  onViewCertificate?: () => void;
}

const CourseCertificateCard: React.FC<Props> = ({
  certificateId,
  courseId,
  userId,
  courseTitle,
  level,
  completionDate,
  onViewCertificate,
  userName
}) => {
  return (
    <div className="p-6 border rounded-xl shadow-md bg-white hover:shadow-lg transition">
      <div className="flex items-center gap-2 text-emerald-800">
        <Award className="w-6 h-6" />
        <h3 className="font-semibold text-lg">Certificado de finalización</h3>
      </div>

      <div className="mt-4 space-y-2 text-gray-700">
        <p>
          <strong>Usuario:</strong> {userName}
        </p>
        <p>
          <strong>Curso:</strong>{" "}
          <span
            className="text-emerald-700 cursor-pointer hover:underline"
            onClick={onViewCertificate}
          >
            {courseTitle} ({level})
          </span>
        </p>
        <p>
          <strong>Fecha de finalización:</strong>{" "}
          {completionDate
            ? format(new Date(completionDate), "dd/MM/yyyy")
            : "No disponible"}
        </p>
        <p>
          Este certificado confirma que{" "}
          <span className="font-semibold">{userName}</span> ha completado
          satisfactoriamente el curso.
        </p>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500">
          ID de verificación: <span className="font-mono">{certificateId}</span>
        </p>
      </div>
    </div>
  );
};

export { CourseCertificateCard };