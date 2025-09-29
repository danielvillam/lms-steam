import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import CourseCertificateUser from "./_components/course-certificate-user";
import { randomUUID } from "crypto";

interface CertificatePageProps {
  params: { courseId: string };
}

const CertificatePage = async ({ params }: CertificatePageProps) => {
  const { userId } = await auth();
  if (!userId) return redirect("/sign-in");

  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  const course = await db.course.findUnique({ where: { id: params.courseId } });
  if (!course) return <p>No existe el curso</p>;

  const completionDate = new Date();
  const userFullName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Usuario";

  let certificate = await db.certificate.findFirst({
    where: { courseId: course.id, userId },
  });

  if (!certificate) {
    const certificateToken = randomUUID();
    certificate = await db.certificate.create({
      data: {
        courseId: course.id,
        userId,
        certificateUrl: certificateToken,
      },
    });
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
