import { db } from "@/lib/db";
import { createClerkClient } from "@clerk/backend";
import CourseCertificatePreviewPDF from "../_components/course-certificate-preview";
import { Check, Award, Calendar, User, BookOpen } from "lucide-react";
import CopyShareButtons from "./components/share-button";

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
          <p className="text-2xl font-bold text-red-600">❌ Certificado no válido</p>
        </div>
      </div>
    );

  const clerkUser = await clerk.users.getUser(certificate.userId).catch(() => null);
  if (!clerkUser)
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">❌ Usuario no encontrado</p>
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
          <p className="text-2xl font-bold text-red-600">❌ El usuario no completó el curso</p>
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
          <p className="text-2xl font-bold text-red-600">❌ Curso no encontrado</p>
        </div>
      </div>
    );

  const fullName =
    `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
    clerkUser.emailAddresses[0].emailAddress;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header con badge de verificación */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-pulse">
            <Check className="w-12 h-12 text-green-600" strokeWidth={3} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Certificado Verificado
          </h1>
          <p className="text-gray-600">
            Este certificado ha sido validado correctamente
          </p>
        </div>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
          {/* Banner superior */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-8 py-6">
            <div className="flex items-center justify-between text-white flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8" />
                <div>
                  <p className="text-sm opacity-90">Certificado ID</p>
                  <p className="font-mono font-semibold">{certificateId}</p>
                </div>
              </div>
              <CopyShareButtons />
            </div>
          </div>

          {/* Información del certificado */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Estudiante</p>
                  <p className="font-semibold text-gray-900">{fullName}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Nivel</p>
                  <p className="font-semibold text-gray-900">{course.level ?? "Básico"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Fecha de finalización</p>
                  <p className="font-semibold text-gray-900">
                    {userProgress.updatedAt.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-2">Curso completado</p>
              <h2 className="text-2xl font-bold text-gray-900">{course.title}</h2>
            </div>

            {/* Vista previa del certificado */}
            <div className="border-t pt-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Vista previa del certificado
              </h3>
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

        {/* Footer informativo */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">🔒 Verificación segura:</span> Este certificado ha sido emitido y verificado por AulaSTEAM. 
            Puedes compartir este enlace para demostrar la autenticidad del certificado.
          </p>
        </div>
      </div>
    </div>
  );
}