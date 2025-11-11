"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chart } from "@/components/ui/chart";
import { Download, Eye, Copy } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { select } from "slate";

const CertificateTemplate = dynamic(
  () => import("@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template"),
  { ssr: false }
);

type FacetYear = { year: number; count: number };
type FacetStudent = {
  certificateId: string;
  userId: string;
  fullName: string;
  certificateUrl?: string | null;
  issuedAt: Date;
};
type FacetCourse = {
  id: string;
  title: string;
  level?: string;
  certificateCount: number;
  years: FacetYear[];
  students: FacetStudent[];
};

interface CertificatesManagerClientProps {
  initialFacets: FacetCourse[];
}

const CertificatesManagerClient = ({ initialFacets }: CertificatesManagerClientProps) => {
  const [selectedCourse, setSelectedCourse] = useState<FacetCourse | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState("");
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<string>("Todos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filtrar y ordenar cursos
  const filteredCourses = useMemo(() => {
    return initialFacets
      .filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [initialFacets, searchTerm]);

  // Filtrar años
  const filteredYears = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.years.filter((y) =>
      y.year.toString().includes(search)
    );
  }, [selectedCourse, search]);

  // Datos del gráfico
  const chartData = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.years.map((y) => ({
      name: y.year.toString(),
      certificados: y.count,
    }));
  }, [selectedCourse]);

  // Total de certificados
  const totalCertificates = useMemo(() => {
    if (!selectedCourse) return 0;
    return selectedCourse.years.reduce((sum, y) => sum + y.count, 0);
  }, [selectedCourse]);

  // Estudiantes del año seleccionado
  const studentsInYear = useMemo(() => {
    if (!selectedCourse?.students || !selectedYear) return [];
    return selectedCourse.students.filter((student) => {
      const studentYear = new Date(student.issuedAt).getFullYear();
      return studentYear === selectedYear;
    });
  }, [selectedCourse?.students, selectedYear]);

  // Meses disponibles
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    studentsInYear.forEach((student) => {
      const date = new Date(student.issuedAt);
      const month = date.toLocaleString("es-ES", { month: "long" });
      months.add(month.charAt(0).toUpperCase() + month.slice(1));
    });
    return Array.from(months);
  }, [studentsInYear]);

  // Filtrado de estudiantes
  const filteredStudents = useMemo(() => {
    return studentsInYear.filter((student) => {
      const matchesSearch = student.fullName
        .toLowerCase()
        .includes(studentSearchTerm.toLowerCase());
      
      const matchesMonth =
        selectedMonth === "Todos" ||
        new Date(student.issuedAt)
          .toLocaleString("es-ES", { month: "long" })
          .toLowerCase() === selectedMonth.toLowerCase();
      
      return matchesSearch && matchesMonth;
    });
  }, [studentsInYear, studentSearchTerm, selectedMonth]);

  // Paginación
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const currentData = useMemo(() => {
    return filteredStudents.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredStudents, currentPage, itemsPerPage]);

  const reset = () => {
    setSelectedCourse(null);
    setSelectedYear(null);
    setStudentSearchTerm("");
    setSelectedMonth("Todos");
    setCurrentPage(1);
  };

  const handleBulkDownload = async () => {
    try {
      const JSZip = (await import("jszip")).default;
      const { pdf } = await import("@react-pdf/renderer");
      const { default: Template } = await import(
        "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template"
      );

      const zip = new JSZip();

      alert(`Generando ${filteredStudents.length} certificados...`);

      for (let i = 0; i < filteredStudents.length; i++) {
        const student = filteredStudents[i];

        const blob = await pdf(
          <Template
            certificateId={student.certificateId}
            courseId={selectedCourse!.id}
            userId={student.userId}
            userName={student.fullName}
            courseTitle={selectedCourse!.title}
            level={selectedCourse!.level}
            completionDate={student.issuedAt}
          />
        ).toBlob();

        const fileName = `${selectedCourse!.title.replace(/\s+/g, "_")}_${student.fullName.replace(/\s+/g, "_")}.pdf`;
        zip.file(fileName, blob);
      }

      const content = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Certificados_${selectedCourse!.title}_${selectedYear}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("¡Descarga completada!");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al generar el ZIP");
    }
  };

  // 🔹 Nivel 1 — Vista de cursos
  if (!selectedCourse) {
    return (
      <div className="space-y-6 relative">
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar curso"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onFocus={() => {
              if (searchTerm.length > 0) setShowDropdown(true);
            }}
          />

          {showDropdown && filteredCourses.length > 0 && (
            <div className="absolute z-10 w-full bg-white border rounded-md shadow-md mt-1 max-h-60 overflow-y-auto">
              {filteredCourses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  onMouseDown={() => {
                    setSelectedCourse(course);
                    setShowDropdown(false);
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <p className="font-medium">{course.title}</p>
                  <p className="text-xs text-gray-500">
                    {course.certificateCount} certificados
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-muted-foreground">
          Mostrando {filteredCourses.length} de {initialFacets.length} cursos
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredCourses.map((course) => {
            const lastYear =
              course.years.length > 0
                ? Math.max(...course.years.map((y) => y.year))
                : "N/A";

            return (
              <Card
                key={course.id}
                onClick={() => setSelectedCourse(course)}
                className="p-4 cursor-pointer hover:shadow-lg transition"
              >
                <h3 className="font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {course.certificateCount} {course.certificateCount === 1 ? "certificado" : "certificados"} emitido{course.certificateCount === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Último certificado: {lastYear}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // 🔹 Nivel 2: selección de año
  if (!selectedYear) {
    const dropdownYears = filteredYears.slice(0, 5);
    const currentYear = new Date().getFullYear();

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={reset}>
            Volver
          </Button>
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
        </div>

        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            placeholder="Buscar año"
            className="w-full px-3 py-2 border rounded"
          />

          {showDropdown && dropdownYears.length > 0 && (
            <div className="absolute z-10 w-full border bg-white rounded shadow">
              {dropdownYears.map((year) => (
                <div
                  key={year.year}
                  onClick={() => {
                    setSelectedYear(year.year);
                    setShowDropdown(false);
                    setSearch("");
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                >
                  {year.year}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <Chart data={chartData} dataKey="certificados" label="Certificados" />
        </div>

        <p>Total acumulado: {totalCertificates} {totalCertificates === 1 ? "certificado" : "certificados"}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedCourse.years.map((year) => (
            <Card
              key={year.year}
              onClick={() => setSelectedYear(year.year)}
              className="p-4 cursor-pointer hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{year.year}</h3>
              <p className="text-sm text-muted-foreground">
                {year.count} {year.count === 1 ? "certificado" : "certificados"}
              </p>

              {year.year === currentYear && (
                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-800">
                  Año actual
                </span>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // 🔹 Nivel 3: tabla de estudiantes
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => {
          setSelectedYear(null);
          setStudentSearchTerm("");
          setSelectedMonth("Todos");
          setCurrentPage(1);
        }}>
          Volver
        </Button>
        <h2 className="text-xl font-semibold">
          {selectedCourse.title} — {selectedYear}
        </h2>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2">
          <Input
            placeholder="Buscar por nombre estudiante"
            value={studentSearchTerm}
            onChange={(e) => setStudentSearchTerm(e.target.value)}
          />

          <select
            className="w-[160px] border rounded px-2 py-1"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <Button className="bg-sky-800 hover:bg-sky-600 text-white" onClick={handleBulkDownload}>
            Descargar ZIP
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Nombre</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Código de Verificación</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Fecha de Emisión</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentData.length > 0 ? (
              currentData.map((student) => (
                <tr key={student.certificateId} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{student.fullName}</td>
                  <td className="px-4 py-3 text-sm font-mono text-xs">
                    {student.certificateUrl || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Date(student.issuedAt).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <CertificateStudentsActions
                      certificateId={student.certificateId}
                      courseId={selectedCourse.id}
                      userId={student.userId}
                      userName={student.fullName}
                      courseTitle={selectedCourse.title}
                      level={selectedCourse.level}
                      completionDate={student.issuedAt}
                      verificationCode={student.certificateUrl}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500">
                  No se encontraron certificados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Anterior
          </Button>
          <span className="text-sm">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente de acciones de certificados (integrado en el mismo archivo)
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

const CertificateStudentsActions = ({
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

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const { pdf } = await import("@react-pdf/renderer");
      const { default: Template } = await import(
        "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template"
      );

      const blob = await pdf(
        <Template
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
      a.download = `Certificado_${courseTitle.replace(/\s+/g, "_")}_${new Date(completionDate).getFullYear()}_${userName.replace(/\s+/g, "_")}.pdf`;
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

  const handleCopyCode = async () => {
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
            {showPreview && (
              <CertificatePreviewClient
                certificateId={certificateId}
                courseId={courseId}
                userId={userId}
                userName={userName}
                courseTitle={courseTitle}
                level={level}
                completionDate={completionDate}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 🔹 Componente de preview del certificado
const CertificatePreviewClient = ({
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
}) => {
  const [PDFViewer, setPDFViewer] = useState<any>(null);
  const [Template, setTemplate] = useState<any>(null);

  useState(() => {
    async function loadPDF() {
      const { PDFViewer: Viewer } = await import("@react-pdf/renderer");
      const { default: CertTemplate } = await import(
        "@/app/(course)/courses/[courseId]/certificates/[certificateId]/_components/course-certificate-template"
      );
      setPDFViewer(() => Viewer);
      setTemplate(() => CertTemplate);
    }
    loadPDF();
  });

  if (!PDFViewer || !Template) {
    return <div className="flex items-center justify-center h-full">Cargando vista previa...</div>;
  }

  return (
    <PDFViewer width="100%" height="100%" showToolbar={false}>
      <Template
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
};

export default CertificatesManagerClient;