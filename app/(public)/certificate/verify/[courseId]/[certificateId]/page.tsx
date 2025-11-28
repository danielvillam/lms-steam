import { db } from "@/lib/db";
import { createClerkClient } from "@clerk/backend";
import CourseCertificatePreviewPDF from "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-preview";
import CopyShareButtons from "./components/share-button";
import { Check, Award, Calendar, User, BookOpen } from "lucide-react";

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });

interface VerifyCertificatePageProps {
  params: {
    courseId: string;
    certificateId: string;
  };
}

export default async function VerifyCertificatePage({ params }: VerifyCertificatePageProps) {
  const { courseId, certificateId } = params;

  const certificate = await db.certificate.findFirst({
    where: {
      certificateUrl: certificateId,
      courseId: courseId,
    },
  });

  if (!certificate)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Constancia no válida</p>
        </div>
      </div>
    );

  const clerkUser = await clerk.users.getUser(certificate.userId).catch(() => null);
  if (!clerkUser)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Usuario no encontrado</p>
        </div>
      </div>
    );

  const userProgress = await db.userProgress.findFirst({
    where: {
      userId: certificate.userId,
      module: {
        courseId: courseId,
      },
    },
  });

  if (!userProgress || !userProgress.isCompleted)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">❌ El usuario no completó el curso</p>
        </div>
      </div>
    );

  const course = await db.course.findUnique({
    where: { id: courseId },
  });

  if (!course)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">❌ Curso no encontrado</p>
        </div>
      </div>
    );

  const fullName =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    clerkUser.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-3">
            <Check className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Constancia Verificada
          </h1>
          <p className="text-sm text-gray-600">
            Esta constancia ha sido validado correctamente
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4">
          <div className="bg-emerald-500 px-6 py-4">
            <div className="flex items-center justify-between text-white flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6" />
                <div>
                  <p className="text-xs opacity-90">Certificado ID</p>
                  <p className="font-mono text-sm font-semibold">{certificateId}</p>
                </div>
              </div>
              <CopyShareButtons />
            </div>
          </div>

          {/* Información del certificado */}
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-start gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Estudiante</p>
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Nivel</p>
                  <p className="text-sm font-semibold text-gray-900">{course.level ?? "Básico"}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-0.5">Fecha de finalización</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {userProgress.updatedAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-xs text-gray-600 mb-1">Curso completado</p>
              <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
            </div>

            {/* Vista previa del certificado */}
            <div className="border-t pt-6">
              <CourseCertificatePreviewPDF 
                certificateId={certificateId}
                courseId={courseId}
                userId={certificate.userId}
                courseTitle={course.title}
                level={course.level ?? "Básico"}
                completionDate={userProgress.updatedAt}
                userName={fullName}
                logoUrl="/IdentificadorAulaSTEAM.png"
              />
            </div>
          </div>
        </div>

        {/* Footer informativo compacto */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
          <p className="text-xs text-emerald-800">
            <span className="font-semibold">🔒 Verificación segura:</span> Esta constancia ha sido emitida y verificada por el AulaSTEAM. 
            Puedes compartir este enlace para demostrar la autenticidad.
          </p>
        </div>
      </div>
    </div>
  );
}