import { EndpointDetailView } from "@/components/demo/views/assets-incidents";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EndpointDetailView id={id} />;
}
