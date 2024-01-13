"use client";

import cn from "@/lib/cn";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  BarChart,
  Boxes,
  Code2,
  Lock,
  Users,
  X,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CTAButton } from "../CTAButton";
import Footer from "../Footer";
import Head from "../Head";
import Header from "../Header";
import { HorizontalLine } from "../HorizontalLine";
import { Section } from "../Section";

const LOREM_IPSUM = `Lorem ipsum dolor sit amet, consectetur adipiscing elit proin sagittis.`;

export const SectionTitle: React.FC<{ title: string }> = ({ title }) => {
  return (
    <h2 className="mb-4 text-center text-3xl font-bold md:text-4xl lg:text-4xl">
      {title}
    </h2>
  );
};

export const SectionSubtitle: React.FC<{ subtitle: string }> = ({
  subtitle,
}) => {
  return (
    <h3 className="mb-12 text-center text-xl font-light text-gray-600">
      {subtitle}
    </h3>
  );
};

export const Hero = () => {
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <Link href="/setup">
        <div className="mx-auto mb-8 flex w-fit items-center rounded-lg border bg-gray-100 p-2 pr-1 ring-0 ring-gray-200 transition-[ring] hover:ring-4">
          <span className="rounded-md bg-gray-300 px-2 py-[4px] text-xs font-semibold">
            SETUP
          </span>
          <p className="mx-2 hidden md:block">
            Check out the step-by-step setup guide
          </p>
          <p className="mx-2 md:hidden">Setup Guide</p>
          <div className="hidden items-center space-x-1 p-1 px-2 md:flex">
            <span className="font-medium">Go to setup</span>
            <ArrowRight className="w-3" />
          </div>
        </div>
      </Link>
      <h1 className="mb-5 text-4xl font-extrabold md:text-5xl">Demorepo</h1>
      <h3 className="mb-8 flex flex-wrap items-center justify-center space-x-3 font-light text-gray-500 md:text-xl">
        A modern tool to help your business collaborate and grow.
      </h3>
      <div className="mb-8 flex flex-col items-center space-y-4">
        <CTAButton />
      </div>
      <div className="mx-auto max-w-4xl">
        <video
          src="https://framerusercontent.com/modules/assets/F818ge165BSYQBgAx7TyxLKxYk~gbtiW8JGxGiWrTwjC0rBncFn8PE_QNTfMkkQBZ25WRc.mp4"
          autoPlay
          loop
          muted
          className="h-auto w-full rounded-lg border border-gray-200 shadow-lg"
        />
      </div>
    </motion.div>
  );
};

const FAQ_ITEMS = [
  {
    question: "Who should buy Demorepo?",
    answer: LOREM_IPSUM,
  },
  {
    question: "Who should not buy Demorepo?",
    answer: LOREM_IPSUM,
  },
  {
    question: "What's your refund policy?",
    answer: LOREM_IPSUM,
  },
];

export const FAQAccordion: React.FC = () => {
  const [activeIndexes, setActiveIndexes] = useState<number[]>([]);

  const handleClick = (index: number) => {
    setActiveIndexes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  return (
    <div className="mx-auto rounded-lg border bg-gray-100">
      {FAQ_ITEMS.map((item, index) => {
        const open = activeIndexes.includes(index);

        return (
          <div
            key={index}
            className="whitespace-pre-line border-b border-gray-200 text-base last:border-none"
          >
            <button
              className="flex w-full items-center space-x-4 py-6 px-5 text-gray-600"
              onClick={() => handleClick(index)}
            >
              <X
                className={cn("w-3 shrink-0 text-gray-400 transition", {
                  "rotate-45": !open,
                })}
              />
              <p className="text-left">{item.question}</p>
            </button>
            <div
              className={cn(
                "duration-400 overflow-hidden px-8 transition-[max-height,padding]",
                {
                  "max-h-0": !open,
                  "max-h-48 pb-8": open,
                }
              )}
            >
              <p>{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const FeatureCard: React.FC<{
  title: string;
  icon: LucideIcon;
  description: string;
}> = ({ title, icon: Icon, description }) => {
  return (
    <div className="flex flex-col space-y-4 rounded-lg border p-6 ring-0 ring-gray-100 transition-[ring] hover:ring-4 md:p-8">
      <Icon className="h-8 w-8 stroke-1" />
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="text-base font-light leading-snug text-gray-500">
        {description}
      </p>
    </div>
  );
};

export default function UnauthenticatedHome() {
  return (
    <>
      <Head
        title="Demorepo - a modern tool"
        description="A modern tool to help your business collaborate and grow"
        image="https://framerusercontent.com/images/U10Ma2ZnGwFCA5tjS4wsy53KbmE.png"
      />
      <Header />
      <div className="">
        <Section>
          <Hero />
        </Section>
        <HorizontalLine />
        <Section>
          <SectionTitle title="Features" />
          <SectionSubtitle subtitle="Built for performance and speed. You'll wonder how your team ever worked before." />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Zap}
              title="Blazing fast"
              description={LOREM_IPSUM}
            />
            <FeatureCard
              icon={BarChart}
              title="Unlimited scale"
              description={LOREM_IPSUM}
            />
            <FeatureCard
              icon={Boxes}
              title="Endlessly configurable"
              description={LOREM_IPSUM}
            />

            <FeatureCard
              icon={Users}
              title="Seamless collaboration"
              description={LOREM_IPSUM}
            />

            <FeatureCard
              icon={Lock}
              title="Secure and private"
              description={LOREM_IPSUM}
            />
            <FeatureCard
              icon={Code2}
              title="Designed for developers"
              description={LOREM_IPSUM}
            />
          </div>
        </Section>
        <HorizontalLine />
        <Section>
          <SectionTitle title="FAQ" />
          <SectionSubtitle subtitle="Answers to help you decide if Demorepo is a good fit." />
          <FAQAccordion />
        </Section>
        <div className="h-8" />
        <Footer />
      </div>
    </>
  );
}
