/**
 * Contact channels (spec Section 8 Contact). Addresses are env-driven; until
 * real mailboxes are confirmed, each shows a pending placeholder rather than
 * an invented address.
 */
export type ContactChannel = {
  id: string;
  name: string;
  description: string;
  email: string;
};

function envEmail(envVar: string): string {
  return process.env[envVar] ?? "[Contact email — pending]";
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: "general",
    name: "General Enquiries",
    description: "Questions about Ashford & Crane and how the platform works.",
    email: envEmail("CONTACT_EMAIL_GENERAL"),
  },
  {
    id: "private",
    name: "Private Banking",
    description: "Personal accounts, tiers, and relationship management.",
    email: envEmail("CONTACT_EMAIL_PRIVATE"),
  },
  {
    id: "corporate",
    name: "Corporate Services",
    description: "Business accounts, employee cards, and approvals workflows.",
    email: envEmail("CONTACT_EMAIL_CORPORATE"),
  },
  {
    id: "compliance",
    name: "Compliance",
    description: "Regulatory, AML/KYC, and documentation matters.",
    email: envEmail("CONTACT_EMAIL_COMPLIANCE"),
  },
  {
    id: "support",
    name: "Technical Support",
    description: "Help with signing in, the app, and technical issues.",
    email: envEmail("CONTACT_EMAIL_SUPPORT"),
  },
  {
    id: "partnerships",
    name: "Partnerships",
    description: "Regulated providers interested in working with the platform.",
    email: envEmail("CONTACT_EMAIL_PARTNERSHIPS"),
  },
];
