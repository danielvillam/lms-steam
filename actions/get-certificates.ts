"use server";

import { db } from "@/lib/db";
import { z } from "zod";

// ✅ Esquema opcional de filtros válidos según tu modelo real
const CertificateFilterSchema = z.object({
  courseId: z.string().optional(),
  userId: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

// ✅ Función principal
export async function getCertificates(
  filters?: z.infer<typeof CertificateFilterSchema>
) {
  try {
    const { courseId, userId, fromDate, toDate } = filters || {};

    const where: any = {};

    if (courseId) where.courseId = courseId;
    if (userId) where.userId = userId;

    // Filtros por rango de fechas si los deseas usar
    if (fromDate || toDate) {
      where.issuedAt = {};
      if (fromDate) where.issuedAt.gte = fromDate;
      if (toDate) where.issuedAt.lte = toDate;
    }

    // ✅ Consulta a la base de datos
    const certificates = await db.certificate.findMany({
      where,
      select: {
        id: true,
        userId: true,
        courseId: true,
        issuedAt: true,
        certificateUrl: true,
        createdAt: true,
        updatedAt: true,
        course: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        issuedAt: "desc",
      },
    });

    return certificates;
  } catch (error) {
    console.error("[GET_CERTIFICATES]", error);
    return [];
  }
}
