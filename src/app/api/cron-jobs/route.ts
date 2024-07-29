import { NextResponse } from "next/server";
import { runCronJobs } from "~~/services/cron/cronJobs";

export async function GET() {
  try {
    const response = await runCronJobs();
    if (response) {
      return NextResponse.json({ message: "Cron jobs completed successfully" }, { status: 200 });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
