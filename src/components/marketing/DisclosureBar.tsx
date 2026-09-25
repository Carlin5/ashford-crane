/**
 * Persistent disclosure line shown on marketing pages: services are subject
 * to eligibility, jurisdictional availability, regulatory requirements, and
 * partner availability.
 */
export function DisclosureBar() {
  return (
    <div className="border-t border-platinum-200 bg-platinum-100/50 dark:border-navy-700 dark:bg-navy-900/40">
      <p className="mx-auto max-w-6xl px-6 py-4 text-xs leading-relaxed text-charcoal-500 dark:text-platinum-200">
        Services described on this site are subject to eligibility assessment,
        jurisdictional availability, applicable regulatory requirements, and
        the availability of regulated partner providers. Nothing on this page
        is an offer of regulated financial services. Information pending
        regulatory confirmation is shown as such wherever it appears.
      </p>
    </div>
  );
}
