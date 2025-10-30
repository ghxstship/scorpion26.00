"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Crown, Sparkles, Dumbbell, Zap, Activity, Apple, Brain, Heart, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROGRAMS } from "@/lib/programs-list";
import { TRACKS, TRACK_ORDER, CUSTOM_LEVEL } from "@/lib/programs-data";
import { PricingPeriod } from "@/types/shop";
import { gymZones } from "@/lib/gym-colors";

const iconMap = {
  Dumbbell,
  Zap,
  Activity,
  Apple,
  Brain,
  Heart,
  Users,
};

export default function CustomProgramsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  // Get fancy programs
  const customPrograms = PROGRAMS.filter(p => (p.level as string) === 'fancy');

  const getPriceDisplay = (program: typeof PROGRAMS[0]) => {
    const price = program.pricing[pricingPeriod];
    const periodLabel = pricingPeriod === 'weekly' ? '/week' : pricingPeriod === 'monthly' ? '/month' : '/year';
    return { price, periodLabel };
  };

  return (
    <section id="custom" ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 px-3 sm:px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
            <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <span className="text-xs sm:text-sm font-semibold text-primary">Private 1-on-1 Coaching</span>
          </div>
          <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Custom Private Training
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Exclusive one-on-one coaching with unlimited support. Your personal coach, your custom program.
          </p>
        </motion.div>

        {/* Pricing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8 sm:mb-10 md:mb-12"
        >
          <Tabs value={pricingPeriod} onValueChange={(v: string) => setPricingPeriod(v as PricingPeriod)} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 h-9 sm:h-10">
              <TabsTrigger value="weekly" className="text-xs sm:text-sm">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="text-xs sm:text-sm">
                Monthly
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-2">Popular</Badge>
              </TabsTrigger>
              <TabsTrigger value="annual" className="text-xs sm:text-sm">
                Annual
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-[10px] sm:text-xs px-1 sm:px-2 bg-green-500/20 text-green-400">-17%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Custom Programs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {TRACK_ORDER.map((trackId, index) => {
            const program = customPrograms.find(p => p.track === trackId);
            if (!program) return null;

            const trackInfo = TRACKS[trackId];
            const zone = gymZones[trackInfo.zone];
            const { price, periodLabel } = getPriceDisplay(program);
            const Icon = iconMap[trackInfo.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card 
                  className="flex h-full flex-col transition-all hover:shadow-2xl relative overflow-hidden group border-2"
                  style={{
                    backgroundColor: `${zone.colors.base}ee`,
                    borderColor: zone.colors.primary,
                  }}
                >
                  {/* Premium accent bar */}
                  <div 
                    className="h-1.5 absolute top-0 left-0 right-0 z-10 bg-gradient-to-r"
                    style={{ 
                      backgroundImage: `linear-gradient(to right, ${zone.colors.primary}, ${zone.colors.accent}, ${zone.colors.primary})`
                    }}
                  />
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{ backgroundColor: zone.colors.accent }}
                  />

                  {/* Premium Badge */}
                  <div className="p-3 sm:p-4 pb-0 pt-5 sm:pt-6 relative z-10">
                    <Badge 
                      className="text-[10px] sm:text-xs"
                      style={{ 
                        backgroundColor: zone.colors.primary,
                        color: '#fff'
                      }}
                    >
                      <Crown className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      Private Coaching
                    </Badge>
                  </div>
                  
                  <CardHeader className="pt-2 sm:pt-3 p-3 sm:p-4">
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div 
                        className="p-2 sm:p-2.5 rounded-lg"
                        style={{ backgroundColor: `${zone.colors.primary}20` }}
                      >
                        <Icon 
                          className="h-5 w-5 sm:h-6 sm:w-6" 
                          style={{ color: zone.colors.accent }}
                        />
                      </div>
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" style={{ color: zone.colors.metallic }} />
                    </div>
                    <CardTitle className="text-lg sm:text-xl md:text-2xl" style={{ color: zone.colors.metallic }}>
                      {program.name}
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm" style={{ color: `${zone.colors.metallic}99` }}>
                      {program.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: zone.colors.accent }}>
                          ${price}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">{periodLabel}</span>
                      </div>
                      {pricingPeriod === 'annual' && (
                        <p className="text-[10px] sm:text-xs text-green-400 mt-1">Save 17% vs monthly</p>
                      )}
                    </div>

                    {/* Limited Spots */}
                    {program.maxParticipants && (
                      <div 
                        className="px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border text-center"
                        style={{ 
                          backgroundColor: `${zone.colors.secondary}40`,
                          borderColor: `${zone.colors.accent}40`
                        }}
                      >
                        <p className="text-[10px] sm:text-xs font-medium" style={{ color: zone.colors.accent }}>
                          Limited to {program.maxParticipants} members
                        </p>
                      </div>
                    )}

                    {/* Features */}
                    <ul className="space-y-1.5 sm:space-y-2">
                      {program.features.slice(0, 5).map((feature, i) => (
                        <li key={i} className="flex items-start text-xs sm:text-sm">
                          <Check 
                            className="mr-1.5 sm:mr-2 mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" 
                            style={{ color: zone.colors.accent }}
                          />
                          <span style={{ color: `${zone.colors.metallic}cc` }}>{feature}</span>
                        </li>
                      ))}
                      {program.features.length > 5 && (
                        <li className="text-xs sm:text-sm" style={{ color: `${zone.colors.accent}99` }}>
                          +{program.features.length - 5} more features
                        </li>
                      )}
                    </ul>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2 p-3 sm:p-4 pt-0">
                    <Button 
                      className="w-full text-xs sm:text-sm h-9 sm:h-10" 
                      style={{
                        backgroundColor: zone.colors.primary,
                        color: '#fff',
                      }}
                      asChild
                    >
                      <Link href={`/programs/${program.id}`}>
                        Get Started
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs sm:text-sm"
                      style={{ color: zone.colors.accent }}
                      asChild
                    >
                      <Link href={`/programs/${program.id}`}>
                        Learn More →
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 sm:mt-10 md:mt-12 text-center"
        >
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Not sure which track is right for you?
          </p>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9">
            Schedule a Consultation
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
