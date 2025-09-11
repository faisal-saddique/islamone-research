import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-neutral-50 border-t border-neutral-300 mt-8">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-neutral-800">
              Islam<span className="text-primary">One</span> Research
            </span>
          </div>
          
          <nav className="flex flex-wrap gap-6">
            <Link 
              href="/about" 
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              About
            </Link>
            <Link 
              href="/contact" 
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/privacy" 
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-neutral-500 hover:text-neutral-800 transition-colors"
            >
              Terms
            </Link>
          </nav>
          
          <div className="text-sm text-neutral-500">
            © 2025 IslamOne Research
          </div>
        </div>
      </div>
    </footer>
  );
}