"use client";

import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StudentsTable from "./studentsTable"; 
import { Input } from "@/components/ui/input";
import { Chart } from "@/components/ui/chart";

type FacetYear = { year: number; count: number };
type FacetStudent = {
  id: string;
  fullName: string;
  certificateUrl?: string | null; // ahora código de verificación
  issuedAt: Date;
};
type FacetCourse = {
  id: string;
  title: string;
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


  const reset = () => {
    setSelectedCourse(null);
    setSelectedYear(null);
  };

  // ✅ Filtrar y ordenar cursos
  const filteredCourses = useMemo(() => {
    return initialFacets
      .filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [initialFacets, searchTerm]);

  // 🔹 Nivel 1 — Vista de cursos
  if (!selectedCourse) {
    return (
      <div className="space-y-6 relative">
        {/* 🔍 Buscador */}
        <div className="relative w-full max-w-md">
          <Input
            placeholder="Buscar curso..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // evita que desaparezca antes del click
            onFocus={() => {
              if (searchTerm.length > 0) setShowDropdown(true);
            }}
          />

          {/* 🔽 Dropdown de resultados */}
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

        {/* 🔹 Contador opcional */}
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredCourses.length} de {initialFacets.length} cursos
        </p>

        {/* 🔹 Cards de cursos */}
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

  // Nivel 2: selección de año
  if (!selectedYear) {

    // Filtrar años según búsqueda
    const filteredYears = selectedCourse.years.filter((y) =>
      y.year.toString().includes(search)
    );

    // Mostrar máximo 5 en dropdown
    const dropdownYears = filteredYears.slice(0, 5);

    // Año actual
    const currentYear = new Date().getFullYear();

    // Total acumulado
    const totalCertificates = selectedCourse.years.reduce(
      (sum, y) => sum + y.count,
      0
    );

    // Datos para el gráfico
    const chartData = selectedCourse.years.map((y) => ({
      name: y.year.toString(),
      certificados: y.count,
    }));

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={reset}>
            ← Volver a cursos
          </Button>
          <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
        </div>

        {/* Buscador de años */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            placeholder="Buscar año..."
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

        {/* Gráfico de barras */}
        <div>
          <Chart data={chartData} dataKey="certificados" label="Certificados" />
        </div>

        {/* Total acumulado */}
        <p>Total acumulado: {totalCertificates} certificados</p>

        {/* Cards de años */}
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

              {/* Badge del año actual */}
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

  // 👇 Nivel 3: tabla de estudiantes y códigos
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setSelectedYear(null)}>
          ← Volver a años
        </Button>
        <h2 className="text-xl font-semibold">
          {selectedCourse.title} — {selectedYear}
        </h2>
      </div>

      <p className="text-sm text-muted-foreground">
        Aquí se mostrará la tabla de certificados por estudiante.
      </p>
    </div>
  );
};

export default CertificatesManagerClient;
