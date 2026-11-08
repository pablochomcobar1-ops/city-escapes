import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Towers } from "@/components/home/Towers";
import { DawnToDusk } from "@/components/home/DawnToDusk";
import { Residences } from "@/components/home/Residences";
import { StepInside } from "@/components/home/StepInside";
import { Materials } from "@/components/home/Materials";
import { Progress } from "@/components/home/Progress";
import { CtaBand } from "@/components/home/CtaBand";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Towers />
      <DawnToDusk />
      <Residences />
      <StepInside />
      <Materials />
      <Progress />
      <CtaBand />
    </>
  );
}
