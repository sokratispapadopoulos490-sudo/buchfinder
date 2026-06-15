import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function QuestionCard({ 
  question, 
  options, 
  onSelect, 
  selectedValue,
  questionNumber,
  totalQuestions,
  isTextInput,
  placeholder,
  description,
  onTextSubmit
}) {
  const [textValue, setTextValue] = useState(selectedValue || '');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-medium text-stone-400 dark:text-stone-500 uppercase tracking-wide">
            Schritt {questionNumber} von {totalQuestions}
          </span>
          <span className="text-xs text-stone-300 dark:text-stone-600">
            {Math.round((questionNumber / totalQuestions) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-amber-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-light text-stone-800 dark:text-stone-100 mb-5 leading-relaxed">
        {question}
      </h2>

      {description && (
        <p className="text-stone-500 dark:text-stone-400 text-sm mb-8">{description}</p>
      )}

      {/* Text Input oder Options */}
      {isTextInput ? (
        <div className="space-y-4">
          <Input
            value={textValue}
            onChange={(e) => {
              setTextValue(e.target.value);
              onSelect(e.target.value);
            }}
            placeholder={placeholder}
            className="w-full px-4 py-3 text-base dark:bg-stone-800 dark:border-stone-700 dark:text-stone-100 dark:placeholder-stone-500"
          />
          <Button
            onClick={() => onTextSubmit && onTextSubmit()}
            disabled={!textValue.trim()}
            className="w-full bg-stone-800 hover:bg-stone-700 dark:bg-amber-600 dark:hover:bg-amber-700"
          >
            Weiter
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5 pb-8">
          {options?.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              onClick={() => onSelect(option.value)}
              className={cn(
                "w-full text-left px-5 py-4 rounded-xl border-2 transition-all duration-200",
                "active:scale-[0.99]",
                selectedValue === option.value
                  ? "border-amber-500 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/20 shadow-sm"
                  : "border-stone-200 bg-white dark:border-stone-700 dark:bg-stone-900 hover:border-stone-300 hover:bg-stone-50 dark:hover:border-stone-600 dark:hover:bg-stone-800"
              )}
            >
              <span className={cn(
                "text-[15px] leading-snug",
                selectedValue === option.value
                  ? "text-amber-800 dark:text-amber-300 font-medium"
                  : "text-stone-700 dark:text-stone-200 font-light"
              )}>
                {option.label}
              </span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}