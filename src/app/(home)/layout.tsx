export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section className="flex flex-col min-h-screen">{children}</section>;
}
