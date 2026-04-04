import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Beirut Scope. Send us a message, tip, or inquiry via email, WhatsApp, or our contact form.",
};

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1 h-8 bg-accent rounded-full" />
        <div>
          <h1 className="text-3xl font-bold text-ink">Contact Us</h1>
          <p className="text-sm text-ink-muted mt-1">We'd love to hear from you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-ink mb-4">Get in touch</h2>
            <div className="space-y-4">
              <a href="mailto:beirutscope@gmail.com" className="flex items-center gap-3 group">
                <span className="w-9 h-9 rounded-lg bg-card border border-line flex items-center justify-center text-ink-muted group-hover:text-accent group-hover:border-accent transition-colors">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-ink-muted">Email</p>
                  <p className="text-sm text-ink group-hover:text-accent transition-colors">
                    beirutscope@gmail.com
                  </p>
                </div>
              </a>

              <a
                href="https://wa.me/96176312540"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <span className="w-9 h-9 rounded-lg bg-card border border-line flex items-center justify-center text-ink-muted group-hover:text-accent group-hover:border-accent transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.563 4.14 1.545 5.877L0 24l6.31-1.524A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.369l-.36-.213-3.724.899.935-3.618-.235-.372A9.818 9.818 0 1112 21.818z" />
                  </svg>
                </span>
                <div>
                  <p className="text-xs text-ink-muted">WhatsApp</p>
                  <p className="text-sm text-ink group-hover:text-accent transition-colors">
                    +961 76 312 540
                  </p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-card border border-line rounded-lg p-4 text-sm text-ink-muted leading-relaxed">
            For press inquiries, story tips, corrections, or general feedback — reach out via
            email or WhatsApp and we'll get back to you as soon as possible.
          </div>
        </div>

        <div>
          <h2 className="text-base font-semibold text-ink mb-4">Send a message</h2>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
