"use client";

import { useState } from "react";
import { useFont, type ArabicFont, type UrduFont, type EnglishTranslation, type UrduTranslation, ARABIC_FONTS, URDU_FONTS, ENGLISH_TRANSLATIONS, URDU_TRANSLATIONS } from "~/contexts/font-context";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

export default function SettingsPage() {
  const {
    currentFont,
    setFont,
    currentUrduFont,
    setUrduFont,
    currentEnglishTranslation,
    setEnglishTranslation,
    currentUrduTranslation,
    setUrduTranslation,
    showUrduTranslation,
    setShowUrduTranslation
  } = useFont();
  const [previewText] = useState("بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ");
  const [urduPreviewText] = useState("بسم اللہ الرحمن الرحیم");

  const handleFontChange = (font: ArabicFont) => {
    setFont(font);
  };

  const handleUrduFontChange = (font: UrduFont) => {
    setUrduFont(font);
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

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-medium text-neutral-800 mb-6">
          Urdu Font Selection
        </h2>

        <p className="text-neutral-500 text-sm mb-6">
          Choose your preferred Urdu font for displaying Urdu translations and other Urdu content.
        </p>

        <div className="space-y-4">
          {Object.entries(URDU_FONTS).map(([key, font]) => (
            <div
              key={key}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                currentUrduFont === key
                  ? "border-primary bg-primary-subtle"
                  : "border-neutral-300 hover:border-neutral-400"
              }`}
              onClick={() => handleUrduFontChange(key as UrduFont)}
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
                    className="urdu-text text-2xl mb-2"
                    style={{
                      fontFamily: `${font.cssName}, 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif`
                    }}
                  >
                    {urduPreviewText}
                  </div>

                  <p className="text-neutral-500 text-sm">
                    In the name of Allah, the Most Gracious, the Most Merciful
                  </p>
                </div>

                <div className="ml-4">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      currentUrduFont === key
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
            Current Urdu Selection Preview
          </h3>
          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="urdu-text text-3xl text-center mb-2" style={{ fontFamily: 'var(--font-urdu)' }}>
              {urduPreviewText}
            </div>
            <p className="text-center text-neutral-500 text-sm">
              Using {URDU_FONTS[currentUrduFont].name} font
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button
            onClick={() => setUrduFont("noto-nastaliq")}
            variant={currentUrduFont === "noto-nastaliq" ? "default" : "outline"}
            size="sm"
          >
            Reset to Default
          </Button>
        </div>
      </Card>

      <Card className="p-6 mt-6">
        <h2 className="text-xl font-medium text-neutral-800 mb-6">
          Translation Preferences
        </h2>

        <p className="text-neutral-500 text-sm mb-6">
          Choose your preferred translations for reading the Quran.
        </p>

        <div className="space-y-6">
          {/* Show Urdu Translation Toggle */}
          <div className="flex items-center justify-between p-4 border border-neutral-300 rounded-lg">
            <div>
              <h3 className="font-medium text-neutral-800">Show Urdu Translation</h3>
              <p className="text-sm text-neutral-500">Display Urdu translation alongside Arabic text</p>
            </div>
            <button
              onClick={() => setShowUrduTranslation(!showUrduTranslation)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                showUrduTranslation ? 'bg-primary' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  showUrduTranslation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* English Translation Selection */}
          <div>
            <h3 className="font-medium text-neutral-800 mb-4">English Translation</h3>
            <div className="space-y-3">
              {Object.entries(ENGLISH_TRANSLATIONS).map(([key, translation]) => (
                <div
                  key={key}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    currentEnglishTranslation === key
                      ? "border-primary bg-primary-subtle"
                      : "border-neutral-300 hover:border-neutral-400"
                  }`}
                  onClick={() => setEnglishTranslation(key as EnglishTranslation)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-800">{translation.name}</h4>
                      <p className="text-sm text-neutral-500">{translation.description}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        currentEnglishTranslation === key
                          ? "border-primary bg-primary"
                          : "border-neutral-300"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Urdu Translation Selection */}
          {showUrduTranslation && (
            <div>
              <h3 className="font-medium text-neutral-800 mb-4">Urdu Translation</h3>
              <div className="space-y-3">
                {Object.entries(URDU_TRANSLATIONS).map(([key, translation]) => (
                  <div
                    key={key}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      currentUrduTranslation === key
                        ? "border-primary bg-primary-subtle"
                        : "border-neutral-300 hover:border-neutral-400"
                    }`}
                    onClick={() => setUrduTranslation(key as UrduTranslation)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-medium text-neutral-800">{translation.nameEnglish}</h4>
                          <span className="urdu-text text-sm text-neutral-600">{translation.name}</span>
                        </div>
                        <p className="text-sm text-neutral-500 urdu-text">{translation.description}</p>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          currentUrduTranslation === key
                            ? "border-primary bg-primary"
                            : "border-neutral-300"
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}