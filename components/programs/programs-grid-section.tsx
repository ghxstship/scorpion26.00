"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Lock, Dumbbell, Zap, Activity, Apple, Brain, Heart, Users, Crown, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { PROGRAMS } from "@/lib/programs-list";
import { TRACKS, LEVELS, CUSTOM_LEVEL } from "@/lib/programs-data";
import { ProgramTrack, ProgramLevel, PricingPeriod } from "@/types/shop";
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

const levelIcons = {
  starter: Star,
  advanced: Dumbbell,
  pro: Zap,
  fancy: Crown,
  elite: Lock,
};

export default function ProgramsGridSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedTrack, setSelectedTrack] = useState<ProgramTrack | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<ProgramLevel | 'all'>('all');
  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  const filteredPrograms = useMemo(() => {
    return PROGRAMS.filter(program => {
      const trackMatch = selectedTrack === 'all' || program.track === selectedTrack;
      const levelMatch = selectedLevel === 'all' || program.level === selectedLevel;
      return trackMatch && levelMatch;
    });
  }, [selectedTrack, selectedLevel]);

  const getPriceDisplay = (program: typeof PROGRAMS[0]) => {
    const price = program.pricing[pricingPeriod];
    const periodLabel = pricingPeriod === 'weekly' ? '/week' : pricingPeriod === 'monthly' ? '/month' : '/year';
    return { price, periodLabel };
  };

  const getZoneStyles = (track: ProgramTrack) => {
    const trackInfo = TRACKS[track];
    const zone = gymZones[trackInfo.zone];
    return {
      borderColor: zone.colors.primary,
      accentColor: zone.colors.accent,
      bgColor: zone.colors.base,
      secondaryColor: zone.colors.secondary,
    };
  };

  return (
    <section id="programs" ref={ref} className="py-24 bg-gradient-to-b from-background via-muted/20 to-background relative">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="font-montserrat text-4xl font-bold sm:text-5xl mb-4">
            Choose Your Training Path
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            7 specialized tracks, 5 progressive levels, flexible pricing. Find your perfect program.
          </p>
        </motion.div>

        {/* Pricing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-8"
        >
          <Tabs value={pricingPeriod} onValueChange={(v: string) => setPricingPeriod(v as PricingPeriod)} className="w-auto">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">
                Monthly
                <Badge variant="secondary" className="ml-2 text-xs">Popular</Badge>
              </TabsTrigger>
              <TabsTrigger value="annual">
                Annual
                <Badge variant="secondary" className="ml-2 text-xs bg-green-500/20 text-green-400">Save 17%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Track Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedTrack === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedTrack('all')}
              className="transition-all"
            >
              All Tracks
            </Button>
            {Object.values(TRACKS).map((track) => {
              const Icon = iconMap[track.icon as keyof typeof iconMap];
              const zone = gymZones[track.zone];
              return (
                <Button
                  key={track.id}
                  variant={selectedTrack === track.id ? 'default' : 'outline'}
                  onClick={() => setSelectedTrack(track.id)}
                  className="transition-all"
                  style={{
                    backgroundColor: selectedTrack === track.id ? zone.colors.primary : undefined,
                    borderColor: zone.colors.primary,
                    color: selectedTrack === track.id ? '#fff' : undefined,
                  }}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {track.name}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Level Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedLevel === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedLevel('all')}
              size="sm"
            >
              All Levels
            </Button>
            {Object.values(LEVELS).map((level) => {
              const LevelIcon = levelIcons[level.id];
              return (
                <Button
                  key={level.id}
                  variant={selectedLevel === level.id ? 'default' : 'outline'}
                  onClick={() => setSelectedLevel(level.id)}
                  size="sm"
                  className="transition-all"
                >
                  <LevelIcon className="mr-2 h-3 w-3" />
                  {level.displayName}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Programs Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredPrograms.map((program, index) => {
            const trackInfo = TRACKS[program.track];
            const levelInfo = program.level === 'fancy' ? CUSTOM_LEVEL : LEVELS[program.level];
            const zone = gymZones[trackInfo.zone];
            const { price, periodLabel } = getPriceDisplay(program);
            const Icon = iconMap[trackInfo.icon as keyof typeof iconMap];
            const LevelIcon = levelIcons[program.level];

            return (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * (index % 12) }}
              >
                <Card 
                  className="flex h-full flex-col transition-all hover:shadow-2xl relative overflow-hidden group"
                  style={{
                    backgroundColor: `${zone.colors.base}ee`,
                    borderColor: zone.colors.secondary,
                    borderWidth: '2px',
                  }}
                >
                  {/* Zone accent bar */}
                  <div 
                    className="h-1.5 absolute top-0 left-0 right-0 z-10"
                    style={{ backgroundColor: zone.colors.primary }}
                  />
                  
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
                    style={{ backgroundColor: zone.colors.accent }}
                  />

                  {/* Badges */}
                  {(program.badge || program.isInviteOnly) && (
                    <div className="p-4 pb-0 pt-6 flex gap-2 flex-wrap relative z-10">
                      {program.badge && (
                        <Badge 
                          className="text-xs"
                          style={{ 
                            backgroundColor: zone.colors.primary,
                            color: '#fff'
                          }}
                        >
                          {program.badge}
                        </Badge>
                      )}
                      {program.isInviteOnly && (
                        <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-500">
                          <Lock className="mr-1 h-3 w-3" />
                          Invite Only
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <CardHeader className={program.badge || program.isInviteOnly ? 'pt-2' : 'pt-6'}>
                    <div className="flex items-start justify-between mb-2">
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${zone.colors.primary}20` }}
                      >
                        <Icon 
                          className="h-6 w-6" 
                          style={{ color: zone.colors.accent }}
                        />
                      </div>
                      <div 
                        className="p-1.5 rounded-lg"
                        style={{ backgroundColor: `${zone.colors.secondary}40` }}
                      >
                        <LevelIcon className="h-4 w-4" style={{ color: zone.colors.metallic }} />
                      </div>
                    </div>
                    <CardTitle className="text-xl" style={{ color: zone.colors.metallic }}>
                      {program.name}
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                      {program.tagline}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-4">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold" style={{ color: zone.colors.accent }}>
                          ${price}
                        </span>
                        <span className="text-sm text-muted-foreground">{periodLabel}</span>
                      </div>
                      {pricingPeriod === 'annual' && (
                        <p className="text-xs text-green-400 mt-1">Save 17% vs monthly</p>
                      )}
                    </div>

                    {/* Level Badge */}
                    <div 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{ 
                        backgroundColor: `${zone.colors.secondary}60`,
                        color: zone.colors.metallic
                      }}
                    >
                      <LevelIcon className="h-3 w-3" />
                      {levelInfo.displayName}
                    </div>

                    {/* Features */}
                    <ul className="space-y-2">
                      {program.features.slice(0, 4).map((feature, i) => (
                        <li key={i} className="flex items-start text-xs">
                          <Check 
                            className="mr-2 mt-0.5 h-3.5 w-3.5 flex-shrink-0" 
                            style={{ color: zone.colors.accent }}
                          />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                      {program.features.length > 4 && (
                        <li className="text-xs" style={{ color: zone.colors.accent }}>
                          +{program.features.length - 4} more features
                        </li>
                      )}
                    </ul>

                    {program.maxParticipants && (
                      <p className="text-xs" style={{ color: zone.colors.accent }}>
                        Limited to {program.maxParticipants} members
                      </p>
                    )}
                  </CardContent>

                  <CardFooter className="flex flex-col gap-2">
                    <Button 
                      className="w-full" 
                      size="sm"
                      style={{
                        backgroundColor: zone.colors.primary,
                        color: '#fff',
                      }}
                      asChild
                      disabled={program.isInviteOnly}
                    >
                      <Link href={program.isInviteOnly ? '#' : `/programs/${program.id}`}>
                        {program.isInviteOnly ? 'Request Invitation' : 'Get Started'}
                      </Link>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
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

        {filteredPrograms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No programs match your current filters. Try adjusting your selection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
