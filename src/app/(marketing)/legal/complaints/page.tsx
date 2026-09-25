import type { Metadata } from "next";
import { PENDING } from "@/lib/compliance";
import { CONTACT_CHANNELS } from "@/../config/contacts";

export const metadata: Metadata = {
  title: "Complaints",
  description:
    "How to raise a complaint with Ashford & Crane and how it is handled.",
};

export default function ComplaintsPage() {
  const compliance = CONTACT_CHANNELS.find((c) => c.id === "compliance");
  return (
    <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
      <h1 className="font-display text-4xl font-medium">Complaints</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
        <div>
          <h2 className="font-display text-xl font-medium text-charcoal-900 dark:text-platinum-100">
            How to complain
          </h2>
          <p className="mt-3">
            Contact our Compliance channel at{" "}
            <span className="font-medium text-midnight-600 dark:text-champagne-500">
              {compliance?.email}
            </span>{" "}
            with your name, account reference if you have one, and a description
            of what happened. You will receive an acknowledgement with a case
            reference.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-charcoal-900 dark:text-platinum-100">
            Response time
          </h2>
          <p className="mt-3">
            Our target is to acknowledge complaints within two business days
            and provide a substantive response within fifteen business days;
            where a regulated partner or jurisdiction sets a stricter standard,
            that standard applies instead.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-medium text-charcoal-900 dark:text-platinum-100">
            Escalation
          </h2>
          <p className="mt-3">
            If you are not satisfied with our response, the case is escalated
            internally for independent review. Once confirmed, this page will
            name the independent ombudsman or regulator for each jurisdiction
            to which unresolved complaints may be taken. {PENDING}.
          </p>
        </div>
      </div>
    </section>
  );
}
