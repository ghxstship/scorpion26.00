"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Lock, Dumbbell, Zap, Activity, Apple, Brain, Heart, Users, Star, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROGRAMS } from "@/lib/programs-list";
import { TRACKS, LEVELS, TIER_ORDER, TRACK_ORDER } from "@/lib/programs-data";
import { ProgramLevel, PricingPeriod } from "@/types/shop";
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

const tierIcons = {
  starter: Star,
  advanced: Dumbbell,
  pro: Zap,
  elite: Crown,
};

export default function ProgramsTierColumns() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  // Filter out fancy programs
  const mainPrograms = PROGRAMS.filter(p => (p.level as string) !== 'fancy');

  const getPriceDisplay = (program: typeof PROGRAMS[0]) => {
    const price = program.pricing[pricingPeriod];
    const periodLabel = pricingPeriod === 'weekly' ? '/wk' : pricingPeriod === 'monthly' ? '/mo' : '/yr';
    return { price, periodLabel };
  };

  const getZoneStyles = (trackId: string) => {
    const trackInfo = TRACKS[trackId as keyof typeof TRACKS];
    const zone = gymZones[trackInfo.zone];
    return {
      borderColor: zone.colors.primary,
      accentColor: zone.colors.accent,
      bgColor: zone.colors.base,
      secondaryColor: zone.colors.secondary,
    };
  };

  return (
    <section id="programs" ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-background via-muted/20 to-background relative">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-10 md:mb-12 text-center"
        >
          <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Choose Your Training Tier
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            28 specialized programs across 7 tracks and 4 tiers. Find your perfect fit.
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

        {/* Individual Program Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {TIER_ORDER.map((tierId) => {
            const tierInfo = LEVELS[tierId];
            const TierIcon = tierIcons[tierId];
            
            return TRACK_ORDER.map((trackId, trackIndex) => {
              const program = mainPrograms.find(p => p.track === trackId && p.level === tierId);
              if (!program) return null;

              const trackInfo = TRACKS[trackId];
              const zone = gymZones[trackInfo.zone];
              const { price, periodLabel } = getPriceDisplay(program);
              const Icon = iconMap[trackInfo.icon as keyof typeof iconMap];
              const cardIndex = TIER_ORDER.indexOf(tierId) * TRACK_ORDER.length + trackIndex;

              return (
                <motion.div
                  key={program.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.05 * cardIndex }}
                  className="flex"
                >
                  <Card 
                    className="flex flex-col w-full transition-all hover:shadow-2xl border-2 group"
                    style={{
                      backgroundColor: `${zone.colors.base}dd`,
                      borderColor: tierId === 'advanced' ? 'hsl(var(--primary))' :
                                   tierId === 'elite' ? '#eab308' :
                                   `${zone.colors.secondary}80`,
                    }}
                  >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className={`p-2 sm:p-2.5 rounded-lg ${
                        tierId === 'advanced' ? 'bg-primary/20' :
                        tierId === 'elite' ? 'bg-yellow-500/20' :
                        'bg-muted'
                      }`}>
                        <TierIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          tierId === 'advanced' ? 'text-primary' :
                          tierId === 'elite' ? 'text-yellow-500' :
                          'text-foreground'
                        }`} />
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{tierInfo.name}</h3>
                        {tierId === 'advanced' && (
                          <Badge className="mt-1 text-[10px] sm:text-xs">Most Popular</Badge>
                        )}
                        {tierId === 'elite' && (
                          <Badge variant="outline" className="mt-1 text-[10px] sm:text-xs border-yellow-500 text-yellow-500">
                            <Lock className="mr-1 h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            Invite Only
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">{tierInfo.description}</p>
                </div>

                {/* Track Programs */}
                <div className="flex flex-col gap-3 sm:gap-4 p-3 sm:p-4 md:p-5 bg-muted/10 border-x-2 border-b-2 rounded-b-xl border-muted">
                  {tierPrograms.map((program, idx) => {
                    if (!program) return null;
                    
                    const trackInfo = TRACKS[program.track];
                    const zone = gymZones[trackInfo.zone];
                    const { price, periodLabel } = getPriceDisplay(program);
                    const Icon = iconMap[trackInfo.icon as keyof typeof iconMap];

                    return (
                      <motion.div
                        key={program.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4, delay: 0.05 * idx }}
                      >
                        <Card 
                          className="transition-all hover:shadow-lg group cursor-pointer border-l-4"
                          style={{
                            backgroundColor: `${zone.colors.base}dd`,
                            borderLeftColor: zone.colors.primary,
                            borderColor: `${zone.colors.secondary}80`,
                          }}
                        >
                          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <div 
                                  className="p-1.5 sm:p-2 rounded-lg flex-shrink-0"
                                  style={{ backgroundColor: `${zone.colors.primary}20` }}
                                >
                                  <Icon 
                                    className="h-4 w-4 sm:h-5 sm:w-5" 
                                    style={{ color: zone.colors.accent }}
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <CardTitle className="text-sm sm:text-base md:text-lg truncate" style={{ color: zone.colors.metallic }}>
                                    {trackInfo.name}
                                  </CardTitle>
                                </div>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="p-3 sm:p-4 pt-0 space-y-2 sm:space-y-3">
                            {/* Price */}
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: zone.colors.accent }}>
                                ${price}
                              </span>
                              <span className="text-xs sm:text-sm text-muted-foreground">{periodLabel}</span>
                            </div>

                            {/* Key Features (condensed) */}
                            <ul className="space-y-1 sm:space-y-1.5">
                              {program.features.slice(0, 3).map((feature, i) => (
                                <li key={i} className="flex items-start text-[10px] sm:text-xs leading-tight">
                                  <Check 
                                    className="mr-1.5 sm:mr-2 mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" 
                                    style={{ color: zone.colors.accent }}
                                  />
                                  <span className="line-clamp-1" style={{ color: `${zone.colors.metallic}cc` }}>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>

                          <CardFooter className="p-3 sm:p-4 pt-0">
                            <Button 
                              className="w-full text-xs sm:text-sm h-8 sm:h-9" 
                              style={{
                                backgroundColor: zone.colors.primary,
                                color: '#fff',
                              }}
                              asChild
                              disabled={program.isInviteOnly}
                            >
                              <Link href={program.isInviteOnly ? '#' : `/programs/${program.id}`}>
                                {program.isInviteOnly ? 'Request' : 'Select'}
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile Scroll Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-6 sm:mt-8 text-center sm:hidden"
        >
          <p className="text-xs text-muted-foreground">← Swipe to see all tiers →</p>
        </motion.div>
      </div>
    </section>
  );
}
