import type { Metadata } from "next";
import { getSession } from "@/server/auth";
import { getLocale } from "@/lib/i18n/server";
import { getMessages } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfileForm } from "@/components/app/ProfileForm";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  const session = await getSession();
  const locale = await getLocale();
  const t = getMessages(locale);
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-medium">Profile</h1>
      <Card className="p-6">
        <h2 className="font-medium">Your details</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Name</dt><dd className="font-medium">{session.name}</dd></div>
          <div><dt className="text-charcoal-500 dark:text-platinum-200">Email</dt><dd className="font-medium">{session.email}</dd></div>
        </dl>
      </Card>
      <Card className="p-6">
        <h2 className="font-medium">Preferences</h2>
        <div className="mt-4 flex items-center gap-4">
          <span className="text-sm">Theme</span>
          <ThemeToggle label={t.theme.toggle} />
        </div>
        <ProfileForm locale={locale} />
      </Card>
    </div>
  );
}
