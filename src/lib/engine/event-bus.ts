type StreamListener = (event: string, data: unknown) => void;

class EventBus {
  private listeners = new Set<StreamListener>();

  subscribe(fn: StreamListener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  emit(event: string, data: unknown) {
    for (const fn of this.listeners) {
      fn(event, data);
    }
  }
}

export const demoEventBus = new EventBus();

export type StreamEvent =
  | { type: "new_alert"; alert: Record<string, unknown> }
  | { type: "agent_update"; agents: Record<string, unknown>[] }
  | { type: "eps_update"; eps: number }
  | { type: "attack_progress"; data: Record<string, unknown> }
  | { type: "attack_complete"; data: Record<string, unknown> }
  | { type: "bangkaew_alert"; data: Record<string, unknown> }
  | { type: "collie_action"; data: Record<string, unknown> };

export function emitStream(event: StreamEvent) {
  demoEventBus.emit(event.type, event);
}
