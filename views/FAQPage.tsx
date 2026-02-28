import React from 'react';
import { Language, translations } from '@/lib/translations';

interface FAQPageProps {
  language: Language;
}

export const FAQPage: React.FC<FAQPageProps> = ({ language }) => {
  const t = translations[language];

  const faqs = [
    { q: t.seo.faq1Q, a: t.seo.faq1A },
    { q: t.seo.faq2Q, a: t.seo.faq2A },
    { q: t.seo.faq3Q, a: t.seo.faq3A },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto pt-8 pb-12 flex justify-center">
      <div className="bg-[#f0e6d2] p-6 md:p-10 rounded shadow-2xl relative border-8 border-[#3b2f2f] paper-texture transform -rotate-1 transition-transform hover:rotate-0 duration-300 w-full">
        
        {/* TOP SECRET Stamp */}
        <div className="absolute top-4 right-4 text-stone-500/30 transform rotate-12 font-bold text-3xl font-hand pointer-events-none border-4 border-stone-500/30 p-2 rounded tracking-widest uppercase">
          FAQ
        </div>

        {/* Tape */}
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-yellow-200 opacity-50 rotate-2 tape"></div>

        <h2 className="font-hand text-heading-2 mb-6 border-b-2 border-stone-400 pb-3 font-bold text-stone-800 tracking-wider">
          {t.seo.faqTitle}
        </h2>

        <div className="space-y-4 relative z-10">
          {faqs.map((faq, idx) => (
            <details 
              key={idx} 
              className="group bg-white/60 hover:bg-white/80 transition-colors p-4 rounded-lg shadow-sm border border-stone-300 backdrop-blur-sm"
              open={idx === 0} // Open the first one by default
            >
              <summary className="cursor-pointer font-bold text-body-large font-hand text-stone-800 hover:text-black transition-colors list-none flex justify-between items-center outline-none">
                  {faq.q}
                  <span className="text-stone-500 group-open:rotate-180 transition-transform font-body text-sm">▼</span>
              </summary>
              <div className="mt-3 pl-4 border-l-4 border-stone-800">
                <p className="font-hand text-body-normal text-gray-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

      </div>
    </div>
  );
};
