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
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";
import { Icon as IconAtom } from "@/components/atoms/icon";
import { PriceDisplay } from "@/components/molecules/price-display";
import { spacingClasses, gridClasses } from "@/lib/design-tokens";

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
    <section id="programs" ref={ref} className={`${spacingClasses.sectionY.lg} bg-gradient-to-b from-background via-muted/20 to-background relative`}>
      <div className={`container mx-auto ${spacingClasses.containerX}`}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className={`${spacingClasses.mb.xl} text-center`}
        >
          <Heading level={2} className="font-montserrat mb-4">
            Choose Your Program
          </Heading>
          <Text variant="body-lg" className="text-muted-foreground max-w-3xl mx-auto">
            28 specialized programs across 7 tracks and 4 tiers. Find your perfect fit.
          </Text>
        </motion.div>

        {/* Pricing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`flex justify-center ${spacingClasses.mb.xl}`}
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
        <div className={gridClasses.cards['4col']}>
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
                      borderColor: `${zone.colors.secondary}80`,
                    }}
                  >
                    {/* Tier Badge - Normalized position and styling */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge 
                        className="text-xs font-medium px-2.5 py-0.5"
                        style={{
                          backgroundColor: tierId === 'advanced' ? 'hsl(var(--primary))' :
                                         tierId === 'elite' ? '#eab308' :
                                         zone.colors.primary,
                          color: '#fff'
                        }}
                      >
                        {tierId === 'advanced' ? 'Most Popular' : tierId === 'elite' ? 'Invite Only' : tierInfo.name}
                      </Badge>
                    </div>

                    <CardHeader className={spacingClasses.card}>
                      <div className="flex items-start gap-3">
                        <div 
                          className="p-2.5 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${zone.colors.primary}20`, color: zone.colors.accent }}
                        >
                          <IconAtom 
                            icon={iconMap[trackInfo.icon as keyof typeof iconMap]} 
                            size="md"
                            aria-hidden={true}
                          />
                        </div>
                        <div className="flex-1 min-w-0 pr-20">
                          <CardTitle className="text-xl font-bold mb-1.5" style={{ color: zone.colors.metallic }}>
                            {trackInfo.name}
                          </CardTitle>
                          <Text variant="body-sm" className="text-muted-foreground leading-snug">
                            {trackInfo.description}
                          </Text>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 p-5 pt-0 space-y-4">
                      {/* Price Section - Normalized layout */}
                      <div className="pb-3 border-b border-border/50">
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-4xl font-bold tracking-tight" style={{ color: zone.colors.accent }}>
                            ${price}
                          </span>
                          <span className="text-sm text-muted-foreground font-medium">{periodLabel}</span>
                        </div>
                        {pricingPeriod === 'annual' && (
                          <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                            Save 17%
                          </Badge>
                        )}
                      </div>

                      {/* Training Tracks Label - Normalized */}
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: zone.colors.accent }}>
                          All 7 Training Tracks
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                          Strength • Performance • Cardio • Nutrition • Mental • Recovery • Team Sports
                        </p>
                      </div>

                      {/* Key Features - Normalized spacing */}
                      <ul className="space-y-2">
                        {program.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Check 
                              className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0" 
                              style={{ color: zone.colors.accent }}
                            />
                            <span className="text-foreground/90 leading-snug">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="p-5 pt-0">
                      <Button 
                        className="w-full text-sm font-semibold h-11 transition-all hover:scale-[1.02]" 
                        style={{
                          backgroundColor: zone.colors.primary,
                          color: '#fff',
                        }}
                        asChild
                        disabled={program.isInviteOnly}
                      >
                        <Link href={program.isInviteOnly ? '#' : `/programs/${program.id}`}>
                          {program.isInviteOnly ? 'Request Access' : 'Get Started'}
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
