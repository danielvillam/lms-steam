"use client";

import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRouter } from "next/navigation";
import { CourseCertificateCard } from "./course-certificate-card";
import CourseCertificatePreview from "./course-certificate-preview";
import CourseCertificateTemplate from "./course-certificate-template";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

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
  certificateToken,
}) => {
  const router = useRouter();

  /** ---- FUNCIÓN PARA DESCARGAR PDF ---- **/
  const downloadCertificate = async () => {
    const element = document.getElementById("certificate-download-html");

    if (!element) {
      console.error("No se encontró el certificado para captura.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "pt", "a4");

    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save(`certificado-${course.title}.pdf`);
  };

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
                logoUrl="/IdentificadorAulaSTEAM.png"
              />
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-8 py-4 border-t flex gap-4">
              <Button
                onClick={() => downloadCertificate()} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar certificado
              </Button>
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
                Esta constancia puede ser verificada en línea utilizando el id único proporcionado.
                La verificación confirma que el estudiante completó exitosamente el curso.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Validez</h4>
              <p>
                Esta constancia es válida indefinidamente y puede ser compartida con empleadores, 
                instituciones educativas y plataformas profesionales. No puede usarse para homologación.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Área oculta para descargar PDF */}
      <div id="certificate-download-html" 
      className="absolute left-[-9999px] top-0">
        <CourseCertificateTemplate
          certificateId={certificateToken}
          courseId={course.id}
          userId={userId}
          courseTitle={course.title}
          level={course.level ?? "Nivel no especificado"}
          completionDate={completionDate}
          userName={userFullName}
          logoUrl="/IdentificadorAulaSTEAM.png"
        />
      </div>
    </div>
  );
};

export default CourseCertificateUser;
