"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Dumbbell, Zap, Activity, Apple, Brain, Heart, Users, Crown } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROGRAMS } from "@/lib/programs-list";
import { TRACKS, LEVELS, TIER_ORDER, TRACK_ORDER } from "@/lib/programs-data";
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

const tierIcons = {
  starter: Star,
  advanced: Dumbbell,
  pro: Zap,
  elite: Crown,
};

export default function ProgramsCardsGrid() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  const mainPrograms = PROGRAMS.filter(p => (p.level as string) !== 'fancy');

  const getPriceDisplay = (program: typeof PROGRAMS[0]) => {
    const price = program.pricing[pricingPeriod];
    const periodLabel = pricingPeriod === 'weekly' ? '/wk' : pricingPeriod === 'monthly' ? '/mo' : '/yr';
    return { price, periodLabel };
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
            Choose Your Program
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

        {/* Program Cards Grid */}
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
                  transition={{ duration: 0.4, delay: 0.02 * cardIndex }}
                  className="flex h-full"
                >
                  <Card 
                    className="flex flex-col w-full transition-all hover:shadow-2xl border-2 group relative overflow-hidden"
                    style={{
                      backgroundColor: `${zone.colors.base}dd`,
                      borderColor: tierId === 'advanced' ? 'hsl(var(--primary))' :
                                   tierId === 'elite' ? '#eab308' :
                                   `${zone.colors.secondary}80`,
                    }}
                  >
                    {/* Tier Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <Badge 
                        className="text-[10px] sm:text-xs"
                        style={{
                          backgroundColor: tierId === 'advanced' ? 'hsl(var(--primary))' :
                                         tierId === 'elite' ? '#eab308' :
                                         zone.colors.primary,
                          color: '#fff'
                        }}
                      >
                        {tierInfo.name}
                        {tierId === 'advanced' && ' - Popular'}
                        {tierId === 'elite' && ' - Invite Only'}
                      </Badge>
                    </div>

                    <CardHeader className="p-4 sm:p-5 pb-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div 
                          className="p-2 sm:p-2.5 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${zone.colors.primary}20` }}
                        >
                          <Icon 
                            className="h-5 w-5 sm:h-6 sm:w-6" 
                            style={{ color: zone.colors.accent }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-base sm:text-lg md:text-xl mb-1" style={{ color: zone.colors.metallic }}>
                            {trackInfo.name}
                          </CardTitle>
                          <p className="text-xs sm:text-sm" style={{ color: `${zone.colors.metallic}99` }}>
                            {trackInfo.description}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-4 sm:p-5 pt-0 space-y-3 sm:space-y-4">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold" style={{ color: zone.colors.accent }}>
                            ${price}
                          </span>
                          <span className="text-xs sm:text-sm text-muted-foreground">{periodLabel}</span>
                        </div>
                        {pricingPeriod === 'annual' && (
                          <p className="text-xs text-green-400 mt-1">Save 17% vs monthly</p>
                        )}
                      </div>

                      {/* Key Features */}
                      <ul className="space-y-1.5 sm:space-y-2">
                        {program.features.slice(0, 4).map((feature, i) => (
                          <li key={i} className="flex items-start text-xs sm:text-sm">
                            <Check 
                              className="mr-1.5 sm:mr-2 mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0" 
                              style={{ color: zone.colors.accent }}
                            />
                            <span className="line-clamp-2" style={{ color: `${zone.colors.metallic}cc` }}>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="p-4 sm:p-5 pt-0">
                      <Button 
                        className="w-full text-xs sm:text-sm h-9 sm:h-10" 
                        style={{
                          backgroundColor: zone.colors.primary,
                          color: '#fff',
                        }}
                        asChild
                        disabled={program.isInviteOnly}
                      >
                        <Link href={program.isInviteOnly ? '#' : `/programs/${program.id}`}>
                          {program.isInviteOnly ? 'Request Invite' : 'Select Program'}
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            });
          })}
        </div>
      </div>
    </section>
  );
}
