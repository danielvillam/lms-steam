import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";


const CourseCertificatePreview = dynamic(
  () => import("./_components/course-certificate-preview"),
  { ssr: false }
);

interface ExternalPageProps {
  params: { certificateId: string; courseId: string };
}

export default async function ExternalCertificatePage({ params }: ExternalPageProps) {
  const { certificateId, courseId } = params;

  const certificate = await db.certificate.findFirst({
    where: { certificateUrl: certificateId },
    include: { course: true },
  });

  if (!certificate || !certificate.certificateUrl) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Certificado Verificado</h1>

      <CourseCertificatePreview
        certificateId={certificate.certificateUrl}
        courseId={certificate.course.id}
        userId={certificate.userId}
        courseTitle={certificate.course.title}
        level={certificate.course.level ?? "Nivel no especificado"}
        completionDate={certificate.issuedAt}
        userName="Usuario"
      />

      <div className="mt-4 flex gap-2 items-center">
        <button
          className="bg-esmerald-600 text-white px-4 py-2 rounded hover:bg-esmerald-700"
          onClick={() =>
            navigator.clipboard.writeText(
              `${process.env.NEXT_PUBLIC_APP_URL}/courses/${courseId}/certificates/${certificateId}/external_page`
            )
          }
        >
          Copiar link público
        </button>
      </div>
    </div>
  );
}
