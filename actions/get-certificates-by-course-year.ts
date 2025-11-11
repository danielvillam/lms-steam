"use server";
import { db } from "@/lib/db";

export async function getCertificatesByCourseAndYear(courseId: string, year: number) {
  const start = new Date(`${year}-01-01`);
  const end = new Date(`${year + 1}-01-01`);

  const certificates = await db.certificate.findMany({
    where: {
      courseId,
      issuedAt: { gte: start, lt: end },
    },
    select: {
      id: true,
      userId: true,
      certificateUrl: true,
      issuedAt: true,
      course: { select: { title: true } },
    },
    orderBy: { issuedAt: "desc" },
  });

  return certificates;
}
