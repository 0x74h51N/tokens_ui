"use server";
import { getIronSession } from "iron-session";
import { defaultSession, SessionData, sessionOptions } from "./lib/sessionOptions";
import { cookies } from "next/headers";
import { Address, isAddress, recoverMessageAddress } from "viem";
import { redirect } from "next/navigation";
import { SignMessageReturnType } from "viem/accounts";

export const getSession = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
  }

  return session;
};

export const loginAction = async (address: Address, signature: SignMessageReturnType, message: string) => {
  const session = await getSession();

  if (!isAddress(address)) {
    return { error: "Wrong adress!" };
  }

  const recoveredAddress = await recoverMessageAddress({ message, signature });

  if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
    return { error: "Invalid signature" };
  }

  session.isLoggedIn = true;
  session.walletAddress = address;
  await session.save();
  redirect("/");
};

export const logoutAction = async () => {
  const session = await getSession();
  session.destroy();
  return { success: true };
};

export const validateSessionAction = async () => {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);

  return { isValid: session.isLoggedIn && session.walletAddress ? true : false };
};
