"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronLeft, Rocket } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: string;
  highlight?: string;
}

interface OnboardingProps {
  steps: Step[];
  onComplete: () => void;
  storageKey?: string;
}

export default function Onboarding({ steps, onComplete, storageKey = "onboarding-completed" }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      setIsVisible(true);
    }
  }, [storageKey]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem(storageKey, "true");
    setIsVisible(false);
    onComplete();
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Card */}
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-panel rounded-3xl p-8 border border-white/10"
          >
            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 right-4 text-on-surface-variant/60 hover:text-on-surface transition-colors text-sm"
            >
              Saltar
            </button>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    width: i === currentStep ? 24 : 8,
                    backgroundColor: i === currentStep ? "#d0bcff" : "#494454",
                  }}
                  className="h-2 rounded-full"
                  transition={{ duration: 0.2 }}
                />
              ))}
            </div>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center mb-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                  className="text-6xl mb-4"
                >
                  {steps[currentStep].icon}
                </motion.div>
                <h3 className="font-display text-2xl font-bold text-on-surface mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {steps[currentStep].description}
                </p>
                {steps[currentStep].highlight && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full"
                  >
                    <Rocket className="w-4 h-4 text-primary" />
                    <span className="text-sm text-primary font-medium">
                      {steps[currentStep].highlight}
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                  currentStep === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                Anterior
              </button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-on-primary font-bold rounded-xl shadow-[0_0_20px_rgba(208,188,255,0.3)]"
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Começar!
                    <Rocket className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Próximo
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Preset onboarding steps for QuizVerse
export const QUIZVERSE_STEPS: Step[] = [
  {
    title: "Bem-vindo ao QuizVerse!",
    description: "Prepara-te para uma viagem cósmica pelo conhecimento. Desafia os teus amigos num jogo de perguntas épico!",
    icon: "🚀",
    highlight: "Mais de 10.000 perguntas disponíveis",
  },
  {
    title: "Cria o teu Jogo",
    description: "Escolhe categorias, define o tempo e gera um PIN único para os teus amigos se juntarem.",
    icon: "🎮",
    highlight: "Suporta até 10 jogadores simultâneos",
  },
  {
    title: "Joga no Telemóvel",
    description: "Entra com o PIN no teu telemóvel e responde às perguntas o mais rápido possível!",
    icon: "📱",
    highlight: "Sincronização em tempo real",
  },
  {
    title: "Sobe no Ranking",
    description: "Ganha pontos por velocidade e precisão. Completa conquistas e sobe de nível!",
    icon: "🏆",
    highlight: "Sistema de XP e conquistas",
  },
];
