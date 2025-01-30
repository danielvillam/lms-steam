"use client";

import toast from "react-hot-toast";
import { UploadDropzone } from '@/lib/uploadthing';
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  action: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ action, endpoint }: FileUploadProps) => {
    return (
        <UploadDropzone
            endpoint={endpoint}
            onClientUploadComplete={(res) => {
                action(res?.[0].url);
            }}
            onUploadError={(error: Error) => {
                toast.error(`${error?.message}`);
            }}
        />
    );
};