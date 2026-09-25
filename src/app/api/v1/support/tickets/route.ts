import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { parseBody, requireSession } from "@/server/api";
import { getStore, nextId } from "@/server/store";
import { ensureSeed } from "@/server/store/seed";

const schema = z.object({
  subject: z.string().min(3),
  message: z.string().min(3),
});

export async function POST(req: NextRequest) {
  const session = await requireSession(req);
  if (session instanceof NextResponse) return session;
  const body = await parseBody(req, schema);
  if (body instanceof NextResponse) return body;
  const store = getStore();
  ensureSeed(store);
  const ticket = {
    id: nextId(store, "tkt"),
    customerId: session.customerId!,
    subject: body.subject,
    status: "open" as const,
    createdAt: Date.now(),
  };
  store.tickets.set(ticket.id, ticket);
  store.threads.set(`thr_${ticket.id}`, {
    id: `thr_${ticket.id}`,
    customerId: session.customerId!,
    subject: body.subject,
    messages: [{ from: "client", text: body.message, at: Date.now() }],
  });
  return NextResponse.json({ ticket }, { status: 201 });
}
