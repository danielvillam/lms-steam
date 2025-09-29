import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PDFViewer } from "@react-pdf/renderer";
import CertificateTemplate from "./_components/course-certificate-template";
import { Button } from "@/components/ui/button";

interface ExternalPageProps {
  params: {
    courseId: string;
    certificateId: string;
  };
}

const ExternalCertificatePage = async ({ params }: ExternalPageProps) => {
  const { certificateId } = params;

  // Buscar certificado por ID
  const certificate = await db.certificate.findUnique({
    where: { id: certificateId },
    include: { course: true },
  });

  if (!certificate) return notFound();

  const course = certificate.course;
  const completionDate = certificate.issuedAt ?? new Date();

  // Como no guardamos nombre de usuario en DB
  const userFullName = "Usuario";

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}/certificates/${certificate.id}/external_page`;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Certificado público
      </h1>

      <div className="w-full max-w-4xl h-[600px] border rounded-lg overflow-hidden">
        <PDFViewer width="100%" height="100%">
          <CertificateTemplate
            certificateId={certificate.id}
            courseId={course.id}
            userId={certificate.userId}
            courseTitle={course.title}
            level={course.level ?? undefined}
            completionDate={completionDate}
            userName={userFullName}
          />
        </PDFViewer>
      </div>

      <div className="mt-4 flex gap-2 items-center">
        <Button
          onClick={() => navigator.clipboard.writeText(publicUrl)}
        >
          Copiar link público
        </Button>
        <span className="text-gray-600 break-all">{publicUrl}</span>
      </div>
    </div>
  );
};

export default ExternalCertificatePage;
