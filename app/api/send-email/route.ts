import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);
const hiringEmail=process.env.HIRING_EMAIL

interface SendEmailBody {
  to: string;
  toName: string;
  subject: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: SendEmailBody = await req.json();
    const { to, toName, subject, message } = body;

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields: to, subject, message" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: hiringEmail as string, 
      to: [to],
      subject,
      text: message,
    });

    if (error) {
      console.error("[send-email] Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error("[send-email] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}