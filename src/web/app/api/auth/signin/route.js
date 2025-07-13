// src/web/app/api/main/route.js

export async function GET() {
  // The string below is the *text* sent back to the frontend
  return new Response("Bigstone community is undergoing maintenance.<br/>We're fixing things up to serve you better.<br/>Check back later!</p>", {
    status: 200,
    headers: { "Content-Type": "text/plain" },
  });
}
