import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { isTeacher } from '@/lib/teacher';

/**
 * Centralized Authentication and File Upload Routes for Course Resources.
 */
const f = createUploadthing();

// Centralized Authentication Function.
const handleAuth = async (req: Request) => {
    const { userId } = await auth();

    if (!userId || !isTeacher(userId)) {
        throw new UploadThingError("Unauthorized");
    }

    return { userId };
};

// Defines File Upload Routes for Course Resources.
export const ourFileRouter = {
    // Route for course images
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
        }),

    // Route for course attachments (multiple file types allowed)
    courseAttachment: f(["text", "image", "video", "audio", "pdf"])
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
        }),

    // Route for module videos
    moduleVideo: f({ video: { maxFileSize: "512GB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const userId = await handleAuth(req);
            return { userId: userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

