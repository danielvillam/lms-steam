interface InformationFormProps {
    attempt: number;
    maxAttempts: number;
    questions: number;
}

/**
 * Displays general information about an upcoming evaluation.
 *
 * Shows:
 * - Total number of questions.
 * - Required passing score (80%).
 * - Remaining available attempts.
*/
const InformationForm = ({
                             attempt,
                             questions,
                             maxAttempts,
                         }: InformationFormProps) => {
    return(
        <div className="space-y-4 text-center p-4 rounded-xl border border-slate-200 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-bold">Información de la evaluación</h2>
            <p>
                Esta evaluación contiene <strong>{questions}</strong> preguntas. Necesitas al menos un{" "}
                <strong>80%</strong> para aprobar.
            </p>
            <p className="text-sm text-gray-500">
                Intentos disponibles: {maxAttempts - attempt}
            </p>
        </div>
    )
}
export { InformationForm };