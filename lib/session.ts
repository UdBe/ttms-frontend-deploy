"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, time: string = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload.data;
  } catch (error) {
    return;
  }
}

export async function createSession(data: any, days: number = 1) {
  const expiresAt = new Date(Date.now() + days * 20 * 60 * 60 * 1000);
  const session = await encrypt({ data, expiresAt }, `${days}d`);

  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = cookies().get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
  cookies().set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  cookies().delete("session");
}

export async function updateSessionKey(key: string, value: any) {
  const session = cookies().get("session")?.value;
  let payload: any = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  let settings = payload.settings;
  settings[key] = value;
  payload.settings = settings;
  console.log(payload);
  await createSession(payload);
}
