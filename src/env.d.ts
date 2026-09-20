/// <reference types="astro/client" />

interface Env {
  DISCORD_CLIENT_ID: string;
  DISCORD_CLIENT_SECRET: string;
}

type AppUser = {
  id: number;
  discordId: string;
  username: string;
  avatarUrl: string | null;
  tier: "member" | "supervisor" | "chief" | "staff";
  department: string | null;
  rank: string | null;
  supervisorId: number | null;
  status: "pending" | "active" | "suspended";
};

declare namespace App {
  interface Locals {
    user: AppUser | null;
  }
}
