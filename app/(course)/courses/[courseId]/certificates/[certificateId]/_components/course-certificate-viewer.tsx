"use client";

import dynamic from "next/dynamic";

// Import dinámico opcional si vas a usarlo en server component, pero si ya es client no hace falta
import CourseCertificatePreview from "../_components/CourseCertificatePreview";

interface Certificate {
  certificateUrl: string | null;
  userId: string;
  issuedAt: Date;
}

interface Course {
  id: string;
  title: string;
  level?: string | null;
}

interface CertificateViewerProps {
  certificate: Certificate;
  course: Course;
}

export default function CertificateViewer({ certificate, course }: CertificateViewerProps) {
  const userFullName = "Usuario";

  // Validar que certificateUrl exista
  if (!certificate.certificateUrl) return null;

  return (
    <div className="w-full max-w-4xl h-[600px] border rounded-lg overflow-hidden">
      <CourseCertificatePreview
        certificateId={certificate.certificateUrl}
        courseId={course.id}
        userId={certificate.userId}
        courseTitle={course.title}
        level={course.level ?? "Nivel no especificado"}
        completionDate={certificate.issuedAt}
        userName={userFullName}
      />
    </div>
  );
}
