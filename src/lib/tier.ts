export type Tier = "member" | "supervisor" | "chief" | "staff";

const TIER_RANK: Record<Tier, number> = {
  member: 0,
  supervisor: 1,
  chief: 2,
  staff: 3,
};

export const TIERS: Tier[] = ["member", "supervisor", "chief", "staff"];

export function tierAtLeast(tier: Tier, required: Tier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[required];
}

export function tierLabel(tier: Tier): string {
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}
