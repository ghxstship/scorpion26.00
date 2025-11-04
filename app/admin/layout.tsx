export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally excludes the main Header and Footer
  // since admin pages use their own custom headers
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}
