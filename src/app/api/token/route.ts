import { NextRequest, NextResponse } from "next/server";
import { getCookie, setCookie } from "cookies-next";
import jwt from "jsonwebtoken";
import { Address } from "viem";

export async function POST(req: NextRequest) {
  const secretKey = process.env.JWT_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "JWT_SECRET_KEY is not defined" }, { status: 569 });
  }

  try {
    const { data, contractAddress, cookieName }: { data: string[]; contractAddress: Address; cookieName: string } =
      await req.json();

    if (!data) {
      return NextResponse.json({ error: "Data not provided" }, { status: 469 });
    }

    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address not provided" }, { status: 470 });
    }

    if (!cookieName) {
      return NextResponse.json({ error: "Cookie name not provided" }, { status: 471 });
    }

    const payload = { data };
    const token = jwt.sign(payload, secretKey, { expiresIn: "30d" });
    const response = NextResponse.json({ message: "Token set successfully" });

    setCookie(`${cookieName}_token_${contractAddress}`, token, {
      req,
      res: response,
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 360 * 24 * 3600,
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
    const cookieName = req.nextUrl.searchParams.get("cookieName");

    if (!contractAddress) {
      return NextResponse.json({ error: "Contract address not provided" }, { status: 470 });
    }
    if (!cookieName) {
      return NextResponse.json({ error: "Cookie name not provided" }, { status: 471 });
    }

    const token = getCookie(`${cookieName}_token_${contractAddress}`, { req });

    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 400 });
    }

    const decoded = jwt.verify(token, secretKey);
    return NextResponse.json({ message: "JWT Token valid, data access granted", data: decoded }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: "Invalid token", error: err }, { status: 401 });
  }
}
