"use server";

import { db } from "@/lib/db";
import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";

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

export const getCertificatesFacets = async (): Promise<FacetCourse[]> => {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const user = await currentUser();
    if (!user) return [];

    const role = user.publicMetadata?.role || user.privateMetadata?.role;
    if (role !== "teacher") {
      console.warn("[GET_CERTIFICATES_FACETS] Usuario no es profesor.");
      return [];
    }

    // Obtener cursos con level incluido
    const courses = await db.course.findMany({
      where: { isPublished: true },
      select: { 
        id: true, 
        title: true,
        level: true,  // 👈 Incluir level
      },
    });

    if (courses.length === 0) return [];

    const courseIds = courses.map(function (c) {
      return c.id;
    });

    const certificates = await db.certificate.findMany({
      where: { courseId: { in: courseIds } },
      select: {
        id: true,          // 👈 ID del certificado
        courseId: true,
        userId: true,
        issuedAt: true,
        certificateUrl: true,
      },
    });

    if (certificates.length === 0) return [];

    // Obtener IDs únicos de usuarios
    const uniqueUserIds: string[] = [];
    for (var i = 0; i < certificates.length; i++) {
      var uid = certificates[i].userId;
      if (uniqueUserIds.indexOf(uid) === -1) {
        uniqueUserIds.push(uid);
      }
    }

    // Obtener usuarios de Clerk
    const client = await clerkClient();

    const BATCH_SIZE = 100;
    const userPromises: Promise<any>[] = [];
    for (var j = 0; j < uniqueUserIds.length; j += BATCH_SIZE) {
      const batchIds = uniqueUserIds.slice(j, j + BATCH_SIZE);
      userPromises.push(
        client.users.getUserList({ userId: batchIds }) as Promise<any>
      );
    }

    const batches = await Promise.all(userPromises);
    let allUsers: any[] = [];
    for (var b = 0; b < batches.length; b++) {
      const r = batches[b];
      if (r && r.data && Array.isArray(r.data)) {
        allUsers = allUsers.concat(r.data);
      } else if (Array.isArray(r)) {
        allUsers = allUsers.concat(r);
      }
    }

    // Crear mapa de usuarios
    const userMap: { [key: string]: string } = {};
    for (var u = 0; u < allUsers.length; u++) {
      const user = allUsers[u];
      const fullName =
        ((user.firstName || "") + " " + (user.lastName || "")).trim() ||
        "Usuario";
      userMap[user.id] = fullName;
    }

    // Agrupar resultados por curso
    const resultMap: { [key: string]: FacetCourse } = {};
    for (var c = 0; c < courses.length; c++) {
      const course = courses[c];
      resultMap[course.id] = {
        id: course.id,
        title: course.title,
        level: course.level || undefined,  // 👈 Incluir level
        certificateCount: 0,
        years: [],
        students: [],
      };
    }

    // Procesar certificados
    for (var k = 0; k < certificates.length; k++) {
      const cert = certificates[k];
      const year = new Date(cert.issuedAt).getFullYear();
      const courseFacet = resultMap[cert.courseId];
      if (!courseFacet) continue;

      courseFacet.certificateCount++;

      // Agrupar por año
      const yearFacet = courseFacet.years.find(function (y) {
        return y.year === year;
      });
      if (yearFacet) yearFacet.count++;
      else courseFacet.years.push({ year: year, count: 1 });

      // Agregar info del estudiante con todos los datos necesarios
      courseFacet.students.push({
        certificateId: cert.id,        // ✅ ID del certificado
        userId: cert.userId,           // ✅ ID del usuario
        fullName: userMap[cert.userId] || "Usuario desconocido",
        certificateUrl: cert.certificateUrl,
        issuedAt: cert.issuedAt,
      });
    }

    // Ordenar y retornar
    return Object.values(resultMap).map(function (c) {
      return {
        ...c,
        years: c.years.sort(function (a, b) {
          return b.year - a.year;
        }),
        students: c.students.sort(function (a, b) {
          return b.issuedAt.getTime() - a.issuedAt.getTime();
        }),
      };
    });
  } catch (error) {
    console.error("[GET_CERTIFICATES_FACETS]", error);
    return [];
  }
};
