"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { redirect } from "next/navigation";
import { cache } from "react";

export const getUser = cache(async () => {
  const cookie = cookies().get("session")?.value;
  const session: any = await decrypt(cookie);

  if (!session?.user) {
    redirect("/login");
  }

  return { isAuth: true, user: session.user, data: session };
});

export const getUserToken = cache(async () => {
  const cookie = cookies().get("session")?.value;
  const session: any = await decrypt(cookie);

  if (!session?.user) {
    redirect("/login");
  }

  return session.token;
});
