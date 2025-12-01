+"use client";

import React, { forwardRef } from "react";

interface Props {
  certificateId: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  userName: string;
  logoUrl: string;
  firma: string;
  
}

const CourseCertificateTemplate = forwardRef<HTMLDivElement, Props>(
  (
    {
      certificateId,
      courseId,
      userId,
      courseTitle,
      level,
      completionDate,
      userName,
      logoUrl,
      firma,
    },
    ref
  ) => {
    const formattedCompletionDate = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(completionDate);

    return (
      <div
        ref={ref}
        className="relative bg-white shadow-2xl overflow-hidden"
        style={{
          width: "297mm",
          height: "210mm",
        }}
      >

        {/* ONDAS FLUIDAS CON BORDER-RADIUS - Diseño más confiable */}
        
        {/* Onda superior izquierda - Azul oscuro */}
        <div 
          className="absolute bg-gradient-to-br from-blue-900 to-blue-700 opacity-20"
          style={{
            top: "-128px",
            left: "-192px",
            width: "650px",
            height: "280px",
            borderRadius: "40% 60% 65% 35% / 60% 40% 60% 40%",
            transform: "rotate(-8deg)"
          }}
        />
        
        {/* Onda superior derecha - Naranja */}
        <div 
          className="absolute bg-gradient-to-bl from-orange-500 to-orange-400 opacity-25"
          style={{
            top: "-160px",
            right: "-256px",
            width: "720px",
            height: "320px",
            borderRadius: "35% 65% 40% 60% / 55% 45% 55% 45%",
            transform: "rotate(12deg)"
          }}
        />

        {/* Detalles decorativos en las esquinas */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-4 border-t-4 border-orange-500 opacity-40 rounded-tl-lg" />
        <div className="absolute top-6 right-6 w-16 h-16 border-r-4 border-t-4 border-blue-900 opacity-40 rounded-tr-lg" />
        <div className="absolute bottom-6 left-6 w-16 h-16 border-l-4 border-b-4 border-blue-900 opacity-40 rounded-bl-lg" />
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-4 border-b-4 border-orange-500 opacity-40 rounded-br-lg" />

        {/* CONTENIDO PRINCIPAL */}
        <div className="relative z-10 h-full flex flex-col justify-between p-14 text-center">
          
          {/* Logo institucional - Sin cuadro blanco y más cerca del borde */}
          <div className="flex justify-center items-center -mt-4">
            <img 
              src={logoUrl}
              alt="Aula STEAM" 
              className="h-32 w-auto object-contain"
            />
          </div>

          {/* Header - REDUCIDO EN TAMAÑO */}
          <div className="space-y-2 mt-4">
            
            {/* TÍTULO */}
            <h1 
              className="text-2xl font-bold tracking-wide"
              style={{ 
                color: "#1e3a8a",
                textShadow: "1px 1px 2px rgba(0,0,0,0.04)"
              }}
            >
              CONSTANCIA DE FINALIZACIÓN
            </h1>
            
            <div className="space-y-1 pt-1">
              <p className="text-base font-semibold text-gray-700 leading-relaxed">
                El Aula STEAM Sonny Jiménez
              </p>
              <p className="text-base text-gray-600">
                entrega este reconocimiento a:
              </p>
            </div>
          </div>

          {/* NOMBRE DEL ESTUDIANTE - Reducido y menos separación */}
          <div className="space-y-3 my-4">
            <h2 
              className="text-5xl font-extrabold tracking-wide relative z-10"
              style={{ 
                color: "#1e3a8a",
                textShadow: "2px 2px 3px rgba(0,0,0,0.04)"
              }}
            >
              {userName}
            </h2>
          </div>

          {/* Información del curso */}
          <div className="space-y-4 py-2">
            <p className="text-sm font-medium text-gray-700">
              Por completar con éxito el curso
            </p>
            
            <div 
              className="mx-auto max-w-xl rounded-3xl p-5 relative overflow-hidden shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(30, 58, 138, 0.12) 0%, rgba(249, 115, 22, 0.12) 100%)",
                border: "3px solid transparent",
                backgroundClip: "padding-box"
              }}
            >
              <h3 
                className="text-2xl font-extrabold relative z-10 leading-tight"
                style={{ 
                  color: "#1e3a8a",
                  textShadow: "1px 1px 2px rgba(0,0,0,0.03)"
                }}
              >
                {courseTitle}
              </h3>
              
              {level && (
                <span className="text-sm font-medium text-gray-700">
                  Nivel: {level}
                </span>

              )}
            </div>
          </div>

          {/* Footer */}
          <div className="space-y-2.5 mt-2">
            

            
            <div className="flex justify-center mt-1.5">
              <div 
                className="inline-block rounded-2xl px-5 py-2 shadow-sm"
                style={{
                  background: "linear-gradient(135deg, rgba(30, 58, 138, 0.08), rgba(249, 115, 22, 0.08))",
                  border: "2px solid rgba(249, 115, 22, 0.25)"
                }}
              >
                <p className="text-sm font-bold text-gray-700">
                  Finalizado el {formattedCompletionDate}
                </p>
              </div>
            </div>


            {/* Sección de firma */}
            <div className="flex flex-col items-center justify-center space-y-1 mt-3">
              <div className="flex justify-center items-center">
                <img 
                  src={firma}
                  alt="Firma" 
                  className="h-20 w-auto object-contain"
                />
              </div>
              
              <div className="border-t-2 border-gray-800 w-64 mt-1"></div>
              
              <div className="text-center space-y-0.5 pt-1">
                <p className="text-base font-bold text-gray-800">
                  Mónica Vallejo Velásquez
                </p>
                <p className="text-sm text-gray-600">
                  Directora del Instituto de Educación en Ingeniería
                </p>
              </div>
            </div>
  
            <div className="pt-1.5">
              <p className="text-xs text-gray-400 font-mono">
                ID: {certificateId}
              </p>
              <p className="text-xs text-gray-500 italic font-medium">
              Curso en línea no válido para homologación
            </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CourseCertificateTemplate.displayName = "CourseCertificateTemplateHTML";

export default CourseCertificateTemplate;