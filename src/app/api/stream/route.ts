import { getSessionFromRequest } from "@/lib/auth/session";
import { demoEventBus } from "@/lib/engine/event-bus";
import { startMockEngine } from "@/lib/engine/mock-engine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getSessionFromRequest(request as import("next/server").NextRequest);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  startMockEngine();

  const encoder = new TextEncoder();
  let unsubscribe: (() => void) | undefined;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`));
      };

      send("connected", { userId: session.userId });

      unsubscribe = demoEventBus.subscribe((event, data) => {
        send(event, data);
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(heartbeat);
        unsubscribe?.();
        controller.close();
      });
    },
    cancel() {
      unsubscribe?.();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
