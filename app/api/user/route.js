import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";// Adjust this path based on your project structure
import { auth } from "@clerk/nextjs/server";

export async function GET(req) {
   const { userId } = await auth(); 
   
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { skills: true, industry: true }
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
