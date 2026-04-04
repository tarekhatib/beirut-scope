import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Beirut Scope is an independent digital news platform focused on covering local and regional stories with integrity.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-accent rounded-full" />
        <h1 className="text-3xl font-bold text-ink">About Us</h1>
      </div>

      <div className="space-y-10 text-ink-soft leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">Welcome to Beirut Scope</h2>
          <p className="mb-3">
            At Beirut Scope, we believe in delivering news as it is — clear, honest, and without
            influence.
          </p>
          <p className="text-right text-ink font-medium" dir="rtl">
            نكتب الأمر الواقع بقلم حر، إعلام غير مأجور وغير ممول، لضمان الشفافية
          </p>
          <p className="mt-3">
            We are an independent digital news platform focused on covering local and regional
            stories with integrity. Our goal is to provide accurate information, thoughtful
            perspectives, and straightforward reporting in a time where trust in media matters more
            than ever.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">Our Mission</h2>
          <p className="text-lg font-medium text-ink mb-3">To inform, not to influence.</p>
          <p>
            We aim to present facts without bias, giving readers the ability to form their own
            opinions based on reliable information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">What We Cover</h2>
          <ul className="space-y-2">
            {[
              "Local news in Lebanon",
              "Social and political developments",
              "Breaking news and current events",
              "Public interest stories",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-4">Our Values</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Independence",
                desc: "We are not funded or controlled by any external entity.",
              },
              {
                title: "Transparency",
                desc: "We are open about how we operate.",
              },
              {
                title: "Accuracy",
                desc: "We strive to report verified and factual information.",
              },
              {
                title: "Clarity",
                desc: "We keep our content simple and direct.",
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-card border border-line rounded-lg p-4">
                <p className="font-semibold text-ink mb-1">{title}</p>
                <p className="text-sm text-ink-muted">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-ink mb-3">Why Beirut Scope</h2>
          <p className="mb-3">
            In a world full of noise, Beirut Scope focuses on what matters.
          </p>
          <p>
            We aim to be a trusted source for readers looking for real stories without hidden
            agendas.
          </p>
        </section>

        <section className="bg-card border border-line rounded-lg p-6">
          <h2 className="text-xl font-semibold text-ink mb-3">Contact Us</h2>
          <div className="space-y-2 text-sm">
            <p>
              <span className="text-ink-muted">Email: </span>
              <a
                href="mailto:beirutscope@gmail.com"
                className="text-accent hover:underline"
              >
                beirutscope@gmail.com
              </a>
            </p>
            <p>
              <span className="text-ink-muted">WhatsApp: </span>
              <a
                href="https://wa.me/96176312540"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                +961 76 312 540
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
