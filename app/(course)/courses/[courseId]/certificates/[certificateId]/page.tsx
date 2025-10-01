import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CourseCertificateUser from "./_components/course-certificate-user";
import { randomUUID } from "crypto";

interface CertificatePageProps {
  params: {
    courseId: string;
  };
}

const CertificatePage = async ({ params }: CertificatePageProps) => {
  console.log("Params:", params);

  const { userId } = await auth();
  console.log("Auth userId:", userId);
  if (!userId) return redirect("/sign-in");

  const user = await currentUser();
  console.log("Current user:", user?.id);
  if (!user) return redirect("/sign-in");

  const course = await db.course.findUnique({ where: { id: params.courseId } });
  console.log("Course found:", course);
  if (!course) return <p>No existe el curso</p>;

  const completionDate = new Date();
  const userFullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Usuario";

  // Buscar certificado existente
  let certificate = await db.certificate.findFirst({
    where: { courseId: course.id, userId },
  });

  // Si no existe, creamos uno nuevo con un token único
  if (!certificate) {
    certificate = await db.certificate.create({
      data: {
        courseId: course.id,
        userId,
        certificateUrl: `${params.courseId}-${randomUUID()}`, // token único
      },
    });
    console.log("Nuevo certificado generado:", certificate);
  } else {
    console.log("Certificate found:", certificate);
  }

  return (
    <CourseCertificateUser
      course={{
        id: course.id,
        title: course.title,
        level: course.level ?? undefined,
      }}
      userId={userId}
      completionDate={completionDate}
      userFullName={userFullName}
      certificateToken={certificate.certificateUrl!}
    />
  );
};

export default CertificatePage;
