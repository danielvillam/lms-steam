export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Aquí podrías poner un header muy simple si quieres,
          pero NADA del layout del curso */}
      <main className="max-w-5xl mx-auto py-10 px-4">
        {children}
      </main>
    </div>
  );
}