"use client";

import React from "react";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { useRouter } from "next/navigation";
import  {CourseCertificateCard}  from "./course-certificate-card";
import  CourseCertificatePreview  from "./course-certificate-preview";
import CertificateTemplate from "./course-certificate-template";
import { Button } from "@/components/ui/button";
import { Download, Share2 } from "lucide-react";


interface Props {
  course: {
    id: string;
    title: string;
    level?: string;
  };
  userId: string;
  completionDate: Date;
  userFullName: string;
  userEmail?: string;
  certificateToken: string;
}

const CourseCertificateUser: React.FC<Props> = ({
  course,
  userId,
  completionDate,
  userFullName,
  userEmail,
  certificateToken
  
}) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {course.title}
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


          {/* Left Side - Course Information */}
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-8">
              <CourseCertificateCard
                userName={userFullName}
                certificateId={certificateToken} 
                courseId={course.id}
                level={course.level ?? "Nivel no especificado"}
                userId={userId}
                courseTitle={course.title}
                completionDate={completionDate} 
              />
            </div>
          </div>

          {/* Right Side - Preview Certificate */}

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-8 space-y-4">
              <CourseCertificatePreview
                certificateId={certificateToken} 
                courseId={course.id}
                userId={userId}
                courseTitle={course.title}
                level={course.level ?? "Nivel no especificado"}
                completionDate={completionDate}
                userName={userFullName}
              />
            </div>
            app\verificate\[token]\external_page.tsx
            {/* Action Buttons */}
            <div className="bg-gray-50 px-8 py-4 border-t flex gap-4">
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() =>
                  router.push(
                    `/courses/${course.id}/certificates/${certificateToken}/external_page`
                  )
                }
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartir certificado
              </Button>


              {/* Descargar el pdf */}
              <PDFDownloadLink
              document={
              <CertificateTemplate
                certificateId={certificateToken}
                courseId={course.id}
                userId={userId}
                courseTitle={course.title}
                level={course.level ?? "Nivel no especificado"}
                completionDate={completionDate}
                userName={userFullName} 
                />
              }
              fileName={`certificado-${course.title}.pdf`}>
              {({ loading }) => (
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                   {loading ? "Generando..." : "Descargar certificado"}
                </Button>
              )}
              </PDFDownloadLink>
            </div>
          </div>
        </div>

        {/* Footer Additional Information */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Sobre este certificado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Verificación</h4>
              <p>
                Este certificado puede ser verificado en línea utilizando el 
                link único proporcionado. La verificación confirma que el estudiante 
                completó exitosamente el curso.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Validez</h4>
              <p>
                Este certificado es válido indefinidamente y puede ser compartido 
                con empleadores, instituciones educativas y plataformas profesionales.
                No puede ser usado para homologación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCertificateUser;