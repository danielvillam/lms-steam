"use client";
import React from "react";
import { PDFViewer } from "@react-pdf/renderer";
import CertificateTemplate from "./course-certificate-template";

interface Props {
  certificateId: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  userName: string;
  userEmail?: string;
}

const CourseCertificatePreview: React.FC<Props> = ({
  certificateId,
  courseId,
  userId,
  courseTitle,
  level,
  completionDate,
  userName,
}) => {
  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden">
      <PDFViewer width="100%" height="100%">
        <CertificateTemplate
          certificateId={certificateId}
          courseId={courseId}
          userId={userId}
          courseTitle={courseTitle}
          level={level}
          completionDate={completionDate}
          userName={userName}
        />
      </PDFViewer>
    </div>
  );
};

export default CourseCertificatePreview;

