export default {
  async fetch(request, { bucket }) {
    switch (request.method) {
      case "GET":
        return await get(request, { bucket });
      case "POST":
        return await post(request, { bucket });
    }
  },
};

async function get(request, { bucket }) {
  const key = new URL(request.url).pathname.slice(1);
  const object = await bucket.get(key);

  const headers = new Headers();
  object?.writeHttpMetadata?.(headers);

  return new Response(object?.body, { headers, status: object ? 200 : 404 });
}

async function post(request, { bucket }) {
  const body = await request.arrayBuffer();
  let seed = body;

  const headers = new Headers(request.headers);

  if (!headers.has("Content-Type"))
    headers.set("Content-Type", "application/octet-stream");

  if (headers.has("Content-Seed"))
    seed = new TextEncoder().encode(headers.get("Content-Seed"));

  headers.delete("Content-Seed");

  const key = await digest(seed);
  const object = await bucket.put(key, body, { httpMetadata: headers });

  return new Response(new URL(object.key, request.url).href, { status: 200 });
}

async function digest(array) {
  const digest = await crypto.subtle.digest("SHA-256", array);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
