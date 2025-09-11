import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "About - IslamOne Research",
  description: "Learn about our comprehensive Islamic research platform",
};

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-neutral-50 rounded-lg p-6 border border-neutral-300">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-6">
          About IslamOne Research
        </h1>
        
        <div className="space-y-4 text-neutral-500">
          <p>
            IslamOne Research is a comprehensive platform dedicated to providing 
            authentic Islamic knowledge through the study of the Quran, Hadith, 
            and Islamic literature.
          </p>
          
          <p>
            Our mission is to make Islamic scholarship accessible to Muslims 
            worldwide through modern technology while maintaining the highest 
            standards of authenticity and accuracy.
          </p>
          
          <div className="mt-8">
            <h2 className="text-xl font-medium text-neutral-800 mb-4">Features</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Complete Quran with translations
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Authentic Hadith collections
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                Islamic research tools
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full"></span>
                User-friendly interface
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}