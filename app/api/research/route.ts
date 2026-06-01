import { auth } from "@/auth";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { query } = await req.json();
  const email = session.user.email;

  const response = await fetch(
    process.env.NEXT_PUBLIC_RESEARCH_API_URL!,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, email }),
    }
  );

  if (!response.ok) {
    return Response.json(
      { error: "Research API failed" },
      { status: response.status }
    );
  }

  // Stream the SSE response back to the client
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
