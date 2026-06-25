import { IncidentStoryView } from "@/components/demo/views/pack-demo";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <IncidentStoryView id={id} />;
}
