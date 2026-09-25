export type FaqItem = { q: string; a: string };
export type FaqGroup = { title: string; items: FaqItem[] };

export function Faq({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="space-y-12">
      {groups.map((group) => (
        <section key={group.title}>
          <h2 className="font-display text-2xl font-medium">{group.title}</h2>
          <div className="mt-4 divide-y divide-platinum-200/60 dark:divide-navy-700/60">
            {group.items.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="cursor-pointer list-none text-base font-medium marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal-500 dark:text-platinum-200">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
