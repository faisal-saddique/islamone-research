import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - IslamOne Research",
  description: "Get in touch with the IslamOne Research team",
};

export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">
          Contact Us
        </h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-neutral-800 mb-2">
              Get in Touch
            </h2>
            <p className="text-neutral-500 mb-4">
              We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
            </p>
          </div>

          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-800 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-800 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-neutral-800 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded text-neutral-800 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary hover:bg-primary-light text-neutral-50 rounded transition-colors"
            >
              Send Message
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-300">
            <p className="text-sm text-neutral-500 text-center">
              You can also reach us at{" "}
              <a href="mailto:contact@islamone.research" className="text-primary hover:underline">
                contact@islamone.research
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}