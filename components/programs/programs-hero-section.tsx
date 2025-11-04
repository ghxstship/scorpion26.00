"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Dumbbell, Zap, Activity, Apple, Brain, Heart, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgramsHeroSection() {
  const tracks = [
    { icon: Dumbbell, name: "Strength", color: "#8B0000" },
    { icon: Zap, name: "Performance", color: "#A0522D" },
    { icon: Activity, name: "Cardio", color: "#8B7500" },
    { icon: Apple, name: "Nutrition", color: "#2F4538" },
    { icon: Brain, name: "Mental", color: "#1C2841" },
    { icon: Heart, name: "Recovery", color: "#3E2347" },
    { icon: Users, name: "Team", color: "#8B2252" },
  ];

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-muted/20 to-background pt-24 pb-12">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" style={{ animationDuration: '8s' }} />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-5xl text-center"
        >
          <Badge className="mb-6 text-sm px-4 py-2">
            7 Tracks • 4 Tiers • Custom Training
          </Badge>
          
          <h1 className="font-montserrat text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl mb-6">
            Your Complete Fitness
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
              Transformation System
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-muted-foreground sm:text-2xl max-w-3xl mx-auto">
            28 specialized programs across 7 performance tracks. Plus custom private training.
          </p>
          
          {/* Track Icons */}
          <div className="mt-10 flex flex-wrap justify-center gap-4 mb-10">
            {tracks.map((track, i) => (
              <motion.div
                key={track.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all cursor-pointer group"
              >
                <div 
                  className="p-2 rounded-full transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${track.color}20` }}
                >
                  <track.icon className="h-5 w-5" style={{ color: track.color }} />
                </div>
                <span className="text-xs font-medium">{track.name}</span>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => {
                document.getElementById("programs")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Explore Programs
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                document.getElementById("bundles")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Bundles
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Weekly, monthly, and annual pricing available • 30-day money-back guarantee
          </p>
        </motion.div>
      </div>
    </section>
  );
}
