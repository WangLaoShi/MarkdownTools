import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">That page is not on the map</h1>
      <p className="mt-3 text-muted">The tool or guide you asked for is not in this build.</p>
      <Link href="/tools" className="mt-6 inline-block rounded-lg bg-accent px-4 py-2 text-sm text-accent-foreground">
        Browse tools
      </Link>
    </div>
  );
}
