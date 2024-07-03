import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "JWT_SECRET_KEY is not defined" }, { status: 569 });
  }

  try {
    const { data, contractAddress }: { data: string[]; contractAddress: `0x${string}` } = await req.json();

    if (!data || !contractAddress) {
      return NextResponse.json({ error: "Data or contractAddress not provided" }, { status: 400 });
    }

    const payload = { data };
    const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    const response = NextResponse.json({ message: "Token set successfully" });

    setCookie(`token_${contractAddress}`, token, {
      req,
      res: response,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 30 * 24 * 3600,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error during token creation:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error during token creation:", error);
      return NextResponse.json({ error: "An unknown error occurred" }, { status: 500 });
    }
  }
}

export async function GET(req: NextRequest) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "JWT_SECRET_KEY is not defined" }, { status: 569 });
  }

  try {
    const contractAddress = req.nextUrl.searchParams.get("contractAddress");

    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address not provided" }, { status: 400 });
    }

    const token = getCookie(`token_${contractAddress}`, { req });

    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 400 });
    }

    const decoded = jwt.verify(token, secretKey);
    return NextResponse.json({ message: "JWT Token valid, data access granted", data: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token", error: err }, { status: 401 });
  }
}
