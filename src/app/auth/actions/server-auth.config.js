// app/actions/auth.js
'use server'

import { db } from "@/db";
import { user, account } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers"; // For session handling

export async function authAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const mode = formData.get("mode"); // "signin" or "signup"
  const now = new Date().toISOString();

  // 1. Basic Validation
  if (!email || !password) return { error: "Missing fields" };

  const existingUser = await db.query.user.findFirst({
    where: eq(user.email, email),
    with: { accounts: true } // Assuming you defined relations in Drizzle
  });

  // --- LOGIC FOR SIGN UP ---
  if (mode === "signup") {
    if (existingUser) return { error: "User already exists. Try signing in." };

    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = crypto.randomUUID();

    await db.transaction(async (tx) => {
      await tx.insert(user).values({ id: userId, name: email.split('@')[0], email, updatedAt: now });
      await tx.insert(account).values({
        id: crypto.randomUUID(),
        userId,
        accountId: email,
        providerId: "credential",
        password: hashedPassword,
        updatedAt: now
      });
    });
    // Add logic here to create a session/cookie
    redirect("/dashboard");
  }

  // --- LOGIC FOR SIGN IN ---
  if (mode === "signin") {
    if (!existingUser) return { error: "No user found with this email." };

    // Find the password in the account table
    const userAccount = await db.query.account.findFirst({
      where: eq(account.userId, existingUser.id)
    });

    const isPasswordCorrect = await bcrypt.compare(password, userAccount.password);
    if (!isPasswordCorrect) return { error: "Invalid password" };

    // Add logic here to create a session/cookie
    redirect("/dashboard");
  }
}