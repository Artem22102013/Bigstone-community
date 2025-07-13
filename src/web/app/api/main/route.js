// src/web/app/api/main/route.js

export async function GET() {
  return new Response("We are currently under maintenance because we are fixing data leaks. <br>Please check back later!</br>", {
    status: 200, 
    headers: { "Content-Type": "text/html" } 
  });
}
