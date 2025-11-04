export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout intentionally excludes the main Header and Footer
  // since dashboard pages use their own DashboardLayout component
  return (
    <div className="relative min-h-screen">
      {children}
    </div>
  );
}
