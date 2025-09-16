"use client";

import { useState } from "react";
import { useFont, type ArabicFont, ARABIC_FONTS } from "~/contexts/font-context";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function SettingsPage() {
  const { currentFont, setFont } = useFont();
  const [previewText] = useState("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");

  const handleFontChange = (font: ArabicFont) => {
    setFont(font);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-semibold text-neutral-800 mb-8">
        Settings
      </h1>

      <Card className="p-6">
        <h2 className="text-xl font-medium text-neutral-800 mb-6">
          Arabic Font Selection
        </h2>

        <p className="text-neutral-500 text-sm mb-6">
          Choose your preferred Arabic font for displaying Quranic text and other Arabic content.
        </p>

        <div className="space-y-4">
          {Object.entries(ARABIC_FONTS).map(([key, font]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                currentFont === key
                  ? "border-primary bg-primary-subtle"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
              onClick={() => handleFontChange(key as ArabicFont)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-neutral-800">
                      {font.name}
                    </h3>
                    <span className="text-xs text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
                      {font.source}
                    </span>
                  </div>

                  <div
                    className="arabic-text text-2xl mb-2"
                    style={{
                      fontFamily: `${font.cssName}, 'Arabic Typesetting', 'Traditional Arabic', serif`
                    }}
                  >
                    {previewText}
                  </div>

                  <p className="text-neutral-500 text-sm">
                    In the name of Allah, the Most Gracious, the Most Merciful
                  </p>
                </div>

                <div className="ml-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      currentFont === key
                        ? "border-primary bg-primary"
                        : "border-neutral-300"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-neutral-200">
          <h3 className="font-medium text-neutral-800 mb-2">
            Current Selection Preview
          </h3>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="arabic-text text-3xl text-center mb-2" style={{ fontFamily: 'var(--font-arabic)' }}>
              {previewText}
            </div>
            <p className="text-center text-neutral-500 text-sm">
              Using {ARABIC_FONTS[currentFont].name} font
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setFont("muhammadi")}
            variant={currentFont === "muhammadi" ? "default" : "outline"}
            size="sm"
          >
            Reset to Default
          </Button>
        </div>
      </Card>
    </div>
  );
}