import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function BookCard({ book, reasons, index, isContrast }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className={cn(
        "bg-white rounded-2xl border overflow-hidden",
        isContrast ? "border-amber-200" : "border-stone-200"
      )}
    >
      {isContrast && (
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200">
          <div className="flex items-center gap-2 text-amber-700 text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Horizont-Erweiterung</span>
          </div>
        </div>
      )}
      
      <div className="p-6 md:p-8">
        <div className="flex gap-6">
          {/* Book cover placeholder */}
          <div className={cn(
            "w-20 h-28 md:w-24 md:h-32 rounded-lg flex-shrink-0 flex items-center justify-center",
            book.coverColor || "bg-stone-100"
          )}>
            <span className="text-2xl md:text-3xl font-serif text-stone-400">
              {book.title.charAt(0)}
            </span>
          </div>

          {/* Book info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-xl md:text-2xl font-light text-stone-800 mb-1 leading-tight">
              {book.title}
            </h3>
            <p className="text-stone-500 text-sm mb-3">{book.author}</p>
            <p className="text-stone-600 text-sm leading-relaxed">
              {book.description}
            </p>
          </div>
        </div>

        {/* Why this book */}
        <div className="mt-6 pt-6 border-t border-stone-100">
          <p className="text-stone-800 font-medium mb-4">
            {reasons.mainReason}
          </p>
          
          <ul className="space-y-2 mb-6">
            {reasons.bullets.map((bullet, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-stone-600">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-2 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <a 
            href={book.link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button 
              variant="outline"
              className="gap-2 border-stone-300 hover:bg-stone-50 hover:border-stone-400 transition-all"
            >
              Zum Buch
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </div>
    </motion.div>
  );
}