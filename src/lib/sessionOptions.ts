export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "token_ui_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export interface SessionData {
  isLoggedIn: boolean;
  walletAddress: string;
}

export const defaultSession: SessionData = {
  isLoggedIn: false,
  walletAddress: "",
};
