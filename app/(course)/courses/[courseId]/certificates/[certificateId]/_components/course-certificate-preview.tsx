"use client";
import React, { useRef, useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import CourseCertificateTemplate from "./course-certificate-template";


interface Props {
  certificateId: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  userName: string;
  userEmail?: string;
  logoUrl: string;
  firma: string;
}

const pxToMm = (px: number) => {
  // 1px = 25.4 / 96 mm
  return (px * 25.4) / 96;
};

const CourseCertificatePreviewPDF: React.FC<Props> = ({
  certificateId,
  courseId,
  userId,
  courseTitle,
  level,
  completionDate,
  userName,
}) => {
  const hiddenRef = useRef<HTMLDivElement | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    const generatePdf = async () => {
      try {
        if (!hiddenRef.current) {
          throw new Error("Referencia al certificado no encontrada");
        }

        await new Promise((res) => setTimeout(res, 250));

        const canvas = await html2canvas(hiddenRef.current, {
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: "#ffffff", 
        });

        
        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();

        // Convert canvas px to mm
        const imgWidthMm = pxToMm(canvas.width);
        const imgHeightMm = pxToMm(canvas.height);

        // Fit the image width to pdf width, keep aspect ratio
        const scale = Math.min(pdfWidth / imgWidthMm, pdfHeight / imgHeightMm);
        const renderWidth = imgWidthMm * scale;
        const renderHeight = imgHeightMm * scale;

      
        const x = (pdfWidth - renderWidth) / 2;
        const y = (pdfHeight - renderHeight) / 2;

        doc.addImage(imgData, "JPEG", x, y, renderWidth, renderHeight, undefined, "FAST");

        // Output as blob then createObjectURL for the iframe
        const blob = doc.output("blob");
        const url = URL.createObjectURL(blob);

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        
        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return url;
        });

        setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.message ?? "Error generando el PDF");
          setLoading(false);
        }
      }
    };

    generatePdf();

    return () => {
      cancelled = true;
    };
    
  }, [certificateId, courseId, userId, courseTitle, level, completionDate, userName]);

  
  const handleDownload = async () => {
    if (!hiddenRef.current) return;

    setLoading(true);
    try {
      const canvas = await html2canvas(hiddenRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const doc = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      const imgWidthMm = pxToMm(canvas.width);
      const imgHeightMm = pxToMm(canvas.height);
      const scale = Math.min(pdfWidth / imgWidthMm, pdfHeight / imgHeightMm);
      const renderWidth = imgWidthMm * scale;
      const renderHeight = imgHeightMm * scale;
      const x = (pdfWidth - renderWidth) / 2;
      const y = (pdfHeight - renderHeight) / 2;

      doc.addImage(imgData, "JPEG", x, y, renderWidth, renderHeight, undefined, "FAST");

      doc.save(`certificado_${certificateId || courseId || userId}.pdf`);
    } catch (err) {
      console.error(err);
      setError("Error al descargar el PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3 gap-3">

      </div>

      <div className="w-full h-[500px] border rounded-lg overflow-hidden">
        {pdfUrl ? (
          <iframe
            title="PDF Preview"
            src={pdfUrl}
            className="w-full h-full"
            style={{ border: "none" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            Generando PDF...
          </div>
        )}
      </div>


      <div
        aria-hidden
        style={{
          position: "absolute",
          left: -9999,
          top: -9999,
          width: "297mm",
          height: "210mm",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <CourseCertificateTemplate
          ref={hiddenRef}
          certificateId={certificateId}
          courseId={courseId}
          userId={userId}
          courseTitle={courseTitle}
          level={level}
          completionDate={completionDate}
          userName={userName}
          logoUrl="/IdentificadorAulaSTEAM.png"
          firma="/firmaMonicaVallejo.png"
        />
      </div>
    </div>
  );
};

export default CourseCertificatePreviewPDF;
