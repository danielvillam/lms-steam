"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CourseCertificateTemplate from "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template";

interface CertificateStudentsActionsProps {
  certificateId: string;
  courseId: string;
  userId: string;
  userName: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  verificationCode?: string | null;
}

export const CertificateStudentsActions = ({
  certificateId,
  courseId,
  userId,
  userName,
  courseTitle,
  level,
  completionDate,
  verificationCode,
}: CertificateStudentsActionsProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [previewImg, setPreviewImg] = useState<string | null>(null);

  const captureRef = useRef<HTMLDivElement | null>(null);

  const handleDownload = async () => {
    if (!captureRef.current) return;

    try {
      setIsDownloading(true);

      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("landscape", "pt", "a4");
      const width = pdf.internal.pageSize.getWidth();
      const height = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, width, height);
      pdf.save(`Certificado_${userName.replace(/\s+/g, "_")}.pdf`);

    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Error al descargar el certificado");
    } finally {
      setIsDownloading(false);
    }
  };


  const handlePreview = async () => {
    if (!captureRef.current) return;

    const canvas = await html2canvas(captureRef.current, {
      scale: 1.3,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    setPreviewImg(canvas.toDataURL("image/png"));
    setShowPreview(true);
  };
  const handleCopyCode = async () => {
    if (!verificationCode) return;

    try {
      await navigator.clipboard.writeText(verificationCode);
      alert("Código copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <>
      {/* ACTION BUTTONS */}
      <div className="flex gap-2">
        <Button
          className="bg-sky-800 hover:bg-sky-600 text-white"
          size="sm"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          <Download size={16} className="mr-1" />
          {isDownloading ? "..." : "Descargar"}
        </Button>

        <Button variant="outline" size="sm" onClick={handlePreview}>
          <Eye size={16} className="mr-1" />
          Vista previa
        </Button>

        {verificationCode && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyCode}
            title="Copiar código"
          >
            <Copy size={16} />
          </Button>
        )}
      </div>

      {/* MODAL DE PREVIEW */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vista previa - {userName}</DialogTitle>
          </DialogHeader>

          <div className="h-[75vh] w-full overflow-auto flex justify-center bg-gray-100 p-4">
            {previewImg ? (
              <img
                src={previewImg}
                className="max-w-full rounded shadow"
                alt="Vista previa del certificado"
              />
            ) : (
              "Generando vista previa..."
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* TEMPLATE OCULTO PARA CAPTURA */}
      <div
        ref={captureRef}
        className="absolute left-[-9999px] top-0"
      >
        <CourseCertificateTemplate
          certificateId={certificateId}
          courseId={courseId}
          userId={userId}
          userName={userName}
          courseTitle={courseTitle}
          level={level}
          completionDate={completionDate}
          logoUrl="/IdentificadorAulaSTEAM.png"
        />
      </div>
    </>
  );
};
export default CertificateStudentsActions;