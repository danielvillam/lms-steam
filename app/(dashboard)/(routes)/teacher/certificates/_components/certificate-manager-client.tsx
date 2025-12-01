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
import { CertificateStudentsActions } from "./certificate-students-actions"
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  
  const filteredCourses = useMemo(() => {
    return initialFacets
      .filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [initialFacets, searchTerm]);

  
  const filteredYears = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.years.filter((y) =>
      y.year.toString().includes(search)
    );
  }, [selectedCourse, search]);

  
  const chartData = useMemo(() => {
    if (!selectedCourse) return [];
    return selectedCourse.years.map((y) => ({
      name: y.year.toString(),
      constancias: y.count,  
    }));
  }, [selectedCourse]);

  
  const totalCertificates = useMemo(() => {
    if (!selectedCourse) return 0;
    return selectedCourse.years.reduce((sum, y) => sum + y.count, 0);
  }, [selectedCourse]);

  
  const studentsInYear = useMemo(() => {
    if (!selectedCourse?.students || !selectedYear) return [];
    return selectedCourse.students.filter((student) => {
      const studentYear = new Date(student.issuedAt).getFullYear();
      return studentYear === selectedYear;
    });
  }, [selectedCourse?.students, selectedYear]);

  
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    studentsInYear.forEach((student) => {
      const date = new Date(student.issuedAt);
      const month = date.toLocaleString("es-ES", { month: "long" });
      months.add(month.charAt(0).toUpperCase() + month.slice(1));
    });
    return Array.from(months);
  }, [studentsInYear]);

  
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
      const zip = new JSZip();

      alert(`Generando ${filteredStudents.length} constancias...`);

      for (let student of filteredStudents) {
        
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.style.top = "-9999px";
        document.body.appendChild(container);

        
        const { createRoot } = await import("react-dom/client");
        const root = createRoot(container);

        root.render(
          <CertificateTemplate
            certificateId={student.certificateId}
            courseId={selectedCourse!.id}
            userId={student.userId}
            userName={student.fullName}
            courseTitle={selectedCourse!.title}
            level={selectedCourse!.level}
            completionDate={student.issuedAt}
            logoUrl="/IdentificadorAulaSTEAM.png"
            firma="/firmaMonicaVallejo.png"
          />
        );

        
        await new Promise((resolve) => setTimeout(resolve, 500));

        
        const canvas = await html2canvas(container, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: "#ffffff",
        });

        
        const { jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "pt", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, width, height);

        
        const pdfBlob = pdf.output("blob");
        const fileName =
          `${selectedCourse!.title.replace(/\s+/g, "_")}` +
          `_${student.fullName.replace(/\s+/g, "_")}.pdf`;

        zip.file(fileName, pdfBlob);

        
        root.unmount();
        document.body.removeChild(container);
      }

      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = window.URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Constancias_${selectedCourse!.title}_${selectedYear}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);

      alert("¡Descarga completada!");
    } catch (error) {
      console.error(error);
      alert("Error al generar ZIP");
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
                    {course.certificateCount} constancias
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
                  {course.certificateCount} {course.certificateCount === 1 ? "constancia" : "constancia"} emitida{course.certificateCount === 1 ? "" : "s"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Última constancia: {lastYear}
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
          <Chart data={chartData} dataKey="constancias" label="Constancias" />
        </div>

        <p>Total acumulado: {totalCertificates} {totalCertificates === 1 ? "constancia" : "constancias"}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {selectedCourse.years.map((year) => (
            <Card
              key={year.year}
              onClick={() => setSelectedYear(year.year)}
              className="p-4 cursor-pointer hover:shadow-lg transition"
            >
              <h3 className="font-semibold">{year.year}</h3>
              <p className="text-sm text-muted-foreground">
                {year.count} {year.count === 1 ? "constancia" : "constancias"}
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
                  No se encontraron constancias
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



export default CertificatesManagerClient;