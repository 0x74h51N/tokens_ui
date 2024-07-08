import { Address } from "viem";

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "token_ui_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: undefined,
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
