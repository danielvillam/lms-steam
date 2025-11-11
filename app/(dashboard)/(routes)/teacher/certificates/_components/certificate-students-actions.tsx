"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Eye, Copy } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { pdf } from "@react-pdf/renderer";
import CertificateTemplate from "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template";

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

export const CertificateStudentsActions = function ({
  certificateId,
  courseId,
  userId,
  userName,
  courseTitle,
  level,
  completionDate,
  verificationCode,
}: CertificateStudentsActionsProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handlePreview = function () {
    setShowPreview(true);
  };

  const handleDownload = async function () {
    try {
      setIsDownloading(true);

      const blob = await pdf(
        <CertificateTemplate
          certificateId={certificateId}
          courseId={courseId}
          userId={userId}
          userName={userName}
          courseTitle={courseTitle}
          level={level}
          completionDate={completionDate}
        />
      ).toBlob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificado_${userName.replace(/\s+/g, "_")}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando certificado:", error);
      alert("Error al descargar el certificado");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = async function () {
    if (!verificationCode) return;

    try {
      await navigator.clipboard.writeText(verificationCode);
      alert("Código copiado al portapapeles");
    } catch (error) {
      console.error("Error copiando código:", error);
    }
  };

  return (
    <>
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
          <Eye size={16} className="mr-1" /> Vista previa
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

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Vista previa - {userName}</DialogTitle>
          </DialogHeader>
          <div className="h-[75vh] w-full overflow-auto">
            <CertificatePreviewClient
              certificateId={certificateId}
              courseId={courseId}
              userId={userId}
              userName={userName}
              courseTitle={courseTitle}
              level={level}
              completionDate={completionDate}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

function CertificatePreviewClient({
  certificateId,
  courseId,
  userId,
  userName,
  courseTitle,
  level,
  completionDate,
}: {
  certificateId: string;
  courseId: string;
  userId: string;
  userName: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
}) {
  const { PDFViewer } = require("@react-pdf/renderer");

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <CertificateTemplate
        certificateId={certificateId}
        courseId={courseId}
        userId={userId}
        userName={userName}
        courseTitle={courseTitle}
        level={level}
        completionDate={completionDate}
      />
    </PDFViewer>
  );
}
