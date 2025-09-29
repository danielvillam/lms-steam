import React from "react";
import Link from "next/link";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateCardProps {
  idCurso: string;
  nombre: string;
  curso: string;
  nivel: string;
  fecha_finalizacion: Date;
}

const CertificateCard: React.FC<CertificateCardProps> = ({
  idCurso,
  nombre,
  curso,
  nivel,
  fecha_finalizacion,
}) => {
  const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(fecha_finalizacion);

  return (
    <div className="group hover:shadow-lg transition-all overflow-hidden border rounded-xl p-5 h-full bg-white hover:scale-[1.02] relative flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center gap-x-2 mb-3">
        <Award className="w-6 h-6 text-yellow-600" />
        <h2 className="text-lg font-semibold text-foreground">
          Certificado disponible
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-col space-y-1 mb-4">
        <p className="text-sm text-muted-foreground">Otorgado a:</p>
        <p className="text-base font-medium">{nombre}</p>

        <p className="text-sm text-muted-foreground">Curso:</p>
        <p className="text-base font-semibold text-sky-700">{curso}</p>

        <p className="text-sm text-muted-foreground">Nivel: {nivel}</p>
        <p className="text-xs text-gray-500">Finalizado el {fechaFormateada}</p>
      </div>

      {/* Footer / Action */}
      <div className="flex justify-end">
        <Link href={`/certificates/${idCurso}`}>
          <Button size="sm" variant="outline">
            Ver certificado
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default CertificateCard;
