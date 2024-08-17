import { NextResponse } from "next/server";
import { runCronJobs } from "~~/services/cron/cronJobs";

export async function GET() {
  console.log("Cron job endpoint called");
  try {
    const response = await runCronJobs();
    if (response) {
      console.log("Cron job completed successfully: ", response);
      return NextResponse.json({ message: "Cron jobs completed successfully: ", response }, { status: 200 });
    } else {
      console.log("No response from runCronJobs");
      return NextResponse.json({ error: "No response from runCronJobs" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error running cron jobs:", error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Unknown error" }, { status: 509 });
    }
  }
}

export const dynamic = "force-dynamic";
