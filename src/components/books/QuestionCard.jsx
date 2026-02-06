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
        <div className="flex justify-between text-sm text-stone-400 mb-2">
          <span>Frage {questionNumber}</span>
          <span>{questionNumber} von {totalQuestions}</span>
        </div>
        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-stone-800"
            initial={{ width: 0 }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-light text-stone-800 mb-4 leading-relaxed">
        {question}
      </h2>

      {description && (
        <p className="text-stone-500 text-sm mb-8">{description}</p>
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
            className="w-full px-4 py-3 text-base"
          />
          <Button
            onClick={() => onTextSubmit && onTextSubmit()}
            disabled={!textValue.trim()}
            className="w-full bg-stone-800 hover:bg-stone-700"
          >
            Weiter
          </Button>
        </div>
      ) : (
        <div className="space-y-2.5 pb-6">
          {options?.map((option, index) => (
            <motion.button
              key={option.value}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(option.value)}
              className={cn(
                "w-full text-left px-5 py-3.5 rounded-xl border transition-all duration-300",
                "hover:border-stone-400 hover:bg-stone-50",
                selectedValue === option.value
                  ? "border-stone-800 bg-stone-50"
                  : "border-stone-200 bg-white"
              )}
            >
              <span className="text-stone-700 font-light text-[15px]">{option.label}</span>
            </motion.button>
          ))}
        </div>
      )}
    </motion.div>
  );
}