// Serve /favicon.ico by reading the existing PNG in /public and returning it under the canonical path.
// Google accepts PNG favicons, even at /favicon.ico, as long as the URL is reachable and cacheable.

export const dynamic = "force-static"; // rarely changes; enable static opt-in

export async function GET() {
  const fs = await import("fs/promises");
  const path = await import("path");
  try {
    const pngPath = path.join(process.cwd(), "public", "favicon.png");
  const pngBuffer = await fs.readFile(pngPath);
  const uint8 = new Uint8Array(pngBuffer);
  const blob = new Blob([uint8.buffer], { type: "image/x-icon" });
    return new Response(blob, {
      headers: {
        // Use x-icon for broader compatibility; PNG is still valid content
        "Content-Type": "image/x-icon",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
