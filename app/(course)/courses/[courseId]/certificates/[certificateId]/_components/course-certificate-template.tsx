"use client";
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


interface Props {
  certificateId: string;
  courseId: string;
  userId: string;
  courseTitle: string;
  level?: string;
  completionDate: Date;
  userName: string;
}

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#f8fafc",
    fontFamily: "Helvetica",
  },
  container: {
    flex: 1,
    margin: 10,
    borderWidth: 4,
    borderColor: "#d97706",
    borderStyle: "solid",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  // Decoraciones de esquina
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 128,
    height: 128,
    backgroundColor: "#92400e",
    opacity: 0.1,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    backgroundColor: "#92400e",
    opacity: 0.1,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: 96,
    height: 96,
    backgroundColor: "#92400e",
    opacity: 0.1,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 96,
    height: 96,
    backgroundColor: "#92400e",
    opacity: 0.1,
  },
  // Overlay sutil
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#3b82f6",
    opacity: 0.05,
  },
  // Contenido principal
  content: {
    position: "relative",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 48,
    textAlign: "center",
  },
  // Header
  header: {
    alignItems: "center",
  },
  headerLine: {
    width: 64,
    height: 4,
    backgroundColor: "#2563eb",
    marginBottom: 16,
    alignSelf: "center",
  },
  title: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 1,
  },
  titleUnderline: {
    width: 96,
    height: 2,
    backgroundColor: "#60a5fa",
    alignSelf: "center",
  },
  // Sección principal
  main: {
    alignItems: "center",
  },
  certificationText: {
    fontSize: 18,
    color: "#4b5563",
    fontFamily: "Helvetica",
    marginBottom: 12,
    textAlign: "center",
  },
  nameContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  recipientName: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "center",
    letterSpacing: 2,
    marginBottom: 8,
  },
  nameUnderline: {
    width: 192,
    height: 2,
    backgroundColor: "#93c5fd",
  },
  courseSection: {
    alignItems: "center",
    paddingVertical: 24,
  },
  completionText: {
    fontSize: 18,
    color: "#374151",
    marginBottom: 16,
    textAlign: "center",
  },
  courseContainer: {
    backgroundColor: "#eff6ff",
    border: "1px solid #dbeafe",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
  },
  courseName: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
    textAlign: "center",
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: "#dbeafe",
    border: "1px solid #bfdbfe",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  levelText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e40af",
  },
  // Footer
  footer: {
    alignItems: "center",
  },
  footerLine: {
    width: 80,
    height: 2,
    backgroundColor: "#d1d5db",
    marginBottom: 12,
    alignSelf: "center",
  },
  disclaimer: {
    fontSize: 12,
    color: "#6b7280",
    fontFamily: "Helvetica-Oblique",
    marginBottom: 8,
    textAlign: "center",
  },
  dateContainer: {
    backgroundColor: "#f9fafb",
    border: "1px solid #e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  dateText: {
    fontSize: 14,
    fontFamily: "Helvetica",
    color: "#4b5563",
    textAlign: "center",
  },
});


const CertificateTemplate: React.FC<Props> = ({
  userId,
  courseTitle,
  level,
  completionDate,
  userName,
}) => {
  const fechaFormateada = new Intl.DateTimeFormat("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(completionDate);

  return (
    <Document>
      <Page size="A4" orientation="landscape">
        <View>
          <Text>Certificado de {userName}</Text>
          <Text>Curso: {courseTitle}</Text>
          {level && <Text>Nivel: {level}</Text>}
          <Text>Finalizado el {fechaFormateada}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CertificateTemplate;