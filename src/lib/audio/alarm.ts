"use client";

const MUTE_KEY = "bangkaew_alarm_muted";

export function isAlarmMuted(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MUTE_KEY) === "1";
}

export function setAlarmMuted(muted: boolean) {
  localStorage.setItem(MUTE_KEY, muted ? "1" : "0");
}

export function playAlarm(type: "critical" | "warning" | "notification" = "critical") {
  if (typeof window === "undefined" || isAlarmMuted()) return;

  try {
    const ctx = new AudioContext();

    if (type === "critical") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sawtooth";
      gain.gain.value = 0.3;
      for (let i = 0; i < 3; i++) {
        osc.frequency.setValueAtTime(440, ctx.currentTime + i * 0.5);
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + i * 0.5 + 0.25);
        osc.frequency.linearRampToValueAtTime(440, ctx.currentTime + i * 0.5 + 0.5);
      }
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
    }

    if (type === "warning") {
      [0, 0.3].forEach((delay) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = 660;
        gain.gain.value = 0.2;
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.15);
      });
    }

    if (type === "notification") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = 800;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    }
  } catch {
    // Audio not available
  }
}
