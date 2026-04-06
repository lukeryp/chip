import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ background: "var(--black)" }}
    >
      <div className="text-4xl mb-4">🏌️</div>
      <h1
        className="font-raleway font-black text-3xl mb-2"
        style={{ color: "var(--green)" }}
      >
        404
      </h1>
      <p className="mb-6 text-sm" style={{ color: "var(--text-muted)" }}>
        This page is out of bounds.
      </p>
      <Link
        href="/app"
        className="px-8 py-3 rounded-xl font-raleway font-black text-black text-sm"
        style={{ background: "linear-gradient(135deg, var(--green), var(--green-bright))" }}
      >
        BACK TO APP
      </Link>
    </div>
  );
}
