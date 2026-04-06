import { describe, it, expect, beforeEach } from "vitest";
import { rateLimit, getIp } from "@/lib/rate-limit";

// Each test uses a unique prefix to isolate state
let testId = 0;
function freshKey(): string {
  return `test_ip_${++testId}_${Date.now()}`;
}

describe("rateLimit", () => {
  it("allows requests within the limit", () => {
    const ip = freshKey();
    const result = rateLimit(ip, { limit: 5, windowSeconds: 60, prefix: "test" });
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.limit).toBe(5);
  });

  it("tracks remaining count correctly", () => {
    const ip = freshKey();
    const opts = { limit: 3, windowSeconds: 60, prefix: "track" };

    const r1 = rateLimit(ip, opts);
    expect(r1.remaining).toBe(2);

    const r2 = rateLimit(ip, opts);
    expect(r2.remaining).toBe(1);

    const r3 = rateLimit(ip, opts);
    expect(r3.remaining).toBe(0);
    expect(r3.success).toBe(true);

    const r4 = rateLimit(ip, opts);
    expect(r4.success).toBe(false);
    expect(r4.remaining).toBe(0);
  });

  it("blocks after limit is exceeded", () => {
    const ip = freshKey();
    const opts = { limit: 2, windowSeconds: 60, prefix: "block" };

    rateLimit(ip, opts); // 1
    rateLimit(ip, opts); // 2
    const blocked = rateLimit(ip, opts); // 3 — over limit

    expect(blocked.success).toBe(false);
  });

  it("isolates by prefix", () => {
    const ip = freshKey();
    const opts1 = { limit: 1, windowSeconds: 60, prefix: "prefix_a" };
    const opts2 = { limit: 1, windowSeconds: 60, prefix: "prefix_b" };

    rateLimit(ip, opts1); // fills prefix_a

    const r2 = rateLimit(ip, opts2);
    expect(r2.success).toBe(true); // prefix_b is separate
  });

  it("isolates by identifier", () => {
    const ip1 = freshKey();
    const ip2 = freshKey();
    const opts = { limit: 1, windowSeconds: 60, prefix: "iso" };

    rateLimit(ip1, opts); // fills ip1

    const r2 = rateLimit(ip2, opts);
    expect(r2.success).toBe(true); // ip2 unaffected
  });

  it("returns reset timestamp in the future", () => {
    const ip = freshKey();
    const result = rateLimit(ip, { limit: 5, windowSeconds: 30, prefix: "ts" });
    expect(result.reset).toBeGreaterThan(Date.now());
    expect(result.reset).toBeLessThanOrEqual(Date.now() + 31_000);
  });
});

describe("getIp", () => {
  it("extracts first IP from x-forwarded-for", () => {
    const req = new Request("http://localhost", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getIp(req)).toBe("1.2.3.4");
  });

  it("uses x-real-ip when x-forwarded-for absent", () => {
    const req = new Request("http://localhost", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getIp(req)).toBe("9.9.9.9");
  });

  it("returns unknown when no IP headers", () => {
    const req = new Request("http://localhost");
    expect(getIp(req)).toBe("unknown");
  });
});
