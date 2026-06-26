import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { PackDemoProvider } from "@/lib/demo/pack-demo-store";
import { DemoStreamProvider } from "@/context/DemoStreamProvider";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PackDemoProvider>
      <DemoStreamProvider>
        <div className="min-h-screen bg-navy-950">
          <div className="bg-grid-pattern fixed inset-0 bg-[size:48px_48px] opacity-30" />
          <DemoSidebar />
          <main className="relative lg:pl-56">
            <div className="p-4 pt-16 lg:p-8 lg:pt-8">{children}</div>
          </main>
        </div>
      </DemoStreamProvider>
    </PackDemoProvider>
  );
}
