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