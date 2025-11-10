interface StudentsTableProps {
  rows: {
    id: string;
    fullName: string;
    certificateUrl?: string | null; // es el código de verificación
    issuedAt: Date;
  }[];
}

export default function StudentsTable({ rows }: StudentsTableProps) {
  if (!rows.length)
    return <p className="text-gray-500">No hay certificados en este año.</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow">
      <table className="min-w-full text-sm text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Código de verificación</th>
            <th className="px-4 py-2">Fecha emisión</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">{row.fullName}</td>
              <td className="px-4 py-2 font-mono">
                {row.certificateUrl || "N/A"}
              </td>
              <td className="px-4 py-2">
                {new Date(row.issuedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

