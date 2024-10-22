import { Address } from "viem";

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "token_ui_session",
  cookieOptions: {
    secure: process.env.VERCEL_ENV === "production",
    maxAge: undefined,
    sameSite: "strict" as const,
  },
};

export interface SessionData {
  isLoggedIn: boolean;
  walletAddress: Address;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  walletAddress: "0x00",
};
