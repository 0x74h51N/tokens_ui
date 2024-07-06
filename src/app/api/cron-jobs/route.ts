import { NextRequest, NextResponse } from "next/server";
import { runCronJobs } from "~~/services/cron/cronJobs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await runCronJobs();
    return NextResponse.json({ message: "Cron jobs completed successfully" }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
