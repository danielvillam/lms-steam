"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";


interface LocateChoiceFormProps {
    courseId: string;
    moduleId: string;
    evaluationId: string;
}

/**
 * A form component to manage locate-choice evaluations
 */
//TODO: Build this component taking into account the ideas presented. Can it be based on the image? Or upload the image with some numbers and respond in sequences?

export const LocateChoiceForm = ({
                                       courseId,
                                       moduleId,
                                       evaluationId,
                                   }: LocateChoiceFormProps) => {
    const [isCreating, setIsCreating] = useState(false);

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Agregar pregunta de localizar
                <Button onClick={() => setIsCreating(!isCreating)} variant="ghost">
                    {isCreating ? "Cancelar" : "Agregar"}
                </Button>
            </div>
            <p>En construcción...</p>
        </div>
    );
};
