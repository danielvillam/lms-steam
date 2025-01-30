import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { isTeacher } from '@/lib/teacher';

const f = createUploadthing();

// Función de autenticación centralizada
const handleAuth = async (req: Request) => {
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
        throw new UploadThingError("Unauthorized");
    }

    return { userId };
};

// Define las rutas de carga (FileRoutes)
export const ourFileRouter = {
    // Ruta para imágenes del curso
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
        }),

    // Ruta para adjuntos del curso
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
        }),

    // Ruta para videos de capítulos
    chapterVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

