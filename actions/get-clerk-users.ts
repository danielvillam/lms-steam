"use server";

import { clerkClient } from "@clerk/nextjs/server";

export async function getClerkUsers(userIds: string[]) {
  if (!userIds || userIds.length === 0) return [];

  try {
    // ✅ Obtener la instancia de Clerk client
    const client = await clerkClient();

    const BATCH_SIZE = 100;
    let allUsers: any[] = [];

    for (let i = 0; i < userIds.length; i += BATCH_SIZE) {
      const batch = userIds.slice(i, i + BATCH_SIZE);
      const res = await client.users.getUserList({ userId: batch });

      // Clerk retorna un objeto con `.data`
      if (res && Array.isArray(res.data)) {
        allUsers = allUsers.concat(res.data);
      }
    }

    // ✅ Mapeo limpio para usar en tablas
    return allUsers.map((u: any) => ({
      id: u.id,
      name:
        ((u.firstName || "") + " " + (u.lastName || "")).trim() ||
        u.username ||
        "Sin nombre",
      email: u.emailAddresses?.[0]?.emailAddress || "Sin correo",
    }));
  } catch (error) {
    console.error("[GET_CLERK_USERS]", error);
    return [];
  }
}
