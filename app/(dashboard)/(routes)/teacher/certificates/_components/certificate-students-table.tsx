"use client";
import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CourseCertificatePreview from "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-preview";
import CertificateTemplate from "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template";

interface Student {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  certificateId: string;
  courseId: string;
  userId: string;
}

interface Props {
  students: Student[];
}

const CertificateStudentsTable: React.FC<Props> = ({ students }) => {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div>
      {/* Tabla básica */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Curso</th>
            <th>Nivel</th>
            <th>Fecha de finalización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.courseTitle}</td>
              <td>{student.level || "-"}</td>
              <td>{student.completionDate.toLocaleDateString()}</td>
              <td>
                {/* Botón de vista previa */}
                <button onClick={() => setSelectedStudent(student)}>
                  Vista previa
                </button>

                {/* Botón de descarga */}
                <PDFDownloadLink
                  document={
                    <CertificateTemplate
                      certificateId={student.certificateId}
                      courseId={student.courseId}
                      userId={student.userId}
                      courseTitle={student.courseTitle}
                      level={student.level}
                      completionDate={student.completionDate}
                      userName={student.name}
                      logoUrl="/IdentificadorAulaSTEAM.png"
                    />
                  }
                  fileName={`${student.name}-certificado.pdf`}
                >
                  <button>Descargar</button>
                </PDFDownloadLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de vista previa */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-11/12 h-[90vh]">
            <button
              className="mb-2"
              onClick={() => setSelectedStudent(null)}
            >
              Cerrar
            </button>
            <CourseCertificatePreview
              certificateId={selectedStudent.certificateId}
              courseId={selectedStudent.courseId}
              userId={selectedStudent.userId}
              courseTitle={selectedStudent.courseTitle}
              level={selectedStudent.level}
              completionDate={selectedStudent.completionDate}
              userName={selectedStudent.name}
              userEmail={selectedStudent.email}
              logoUrl="/IdentificadorAulaSTEAM.png"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateStudentsTable;