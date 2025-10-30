"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Package, Sparkles, Lock } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BUNDLES } from "@/lib/programs-list";
import { LEVELS } from "@/lib/programs-data";
import { PricingPeriod } from "@/types/shop";

export default function BundlesSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [pricingPeriod, setPricingPeriod] = useState<PricingPeriod>('monthly');

  const tierBundles = BUNDLES.filter(b => b.type === 'single-tier-all-tracks');
  const trackBundles = BUNDLES.filter(b => b.type === 'single-track-all-tiers');

  const getPriceDisplay = (bundle: typeof BUNDLES[0]) => {
    const price = bundle.pricing[pricingPeriod];
    const periodLabel = pricingPeriod === 'weekly' ? '/week' : pricingPeriod === 'monthly' ? '/month' : '/year';
    return { price, periodLabel };
  };

  return (
    <section ref={ref} className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-b from-muted/20 via-background to-muted/20 relative">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Package className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Save up to 45%</span>
          </div>
          <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Bundled Packages
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4">
            Get more value with our comprehensive bundles. All tracks at one tier, or one track at all tiers.
          </p>
        </motion.div>

        {/* Pricing Period Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center mb-12"
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

        {/* All Tracks Bundles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            All Tracks - Single Level
          </h3>
          <p className="text-muted-foreground mb-8">
            Access all 7 training tracks at your chosen level. Perfect for comprehensive fitness development.
          </p>
          
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tierBundles.map((bundle, index) => {
              const { price, periodLabel } = getPriceDisplay(bundle);
              const levelInfo = bundle.tier ? LEVELS[bundle.tier] : null;
              const isElite = bundle.tier === 'elite';

              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className={`flex h-full flex-col transition-all hover:shadow-2xl relative overflow-hidden group ${
                    bundle.badge === 'Most Popular' ? 'border-primary border-2' : 'border-2'
                  }`}>
                    {/* Gradient accent */}
                    <div className={`h-1.5 absolute top-0 left-0 right-0 z-10 ${
                      isElite ? 'bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500' : 'bg-gradient-to-r from-primary via-primary/80 to-primary'
                    }`} />
                    
                    {/* Badges */}
                    {bundle.badge && (
                      <div className="p-4 pb-0 pt-6 relative z-10">
                        <Badge className={bundle.badge === 'Most Popular' ? 'bg-primary' : 'bg-secondary'}>
                          {bundle.badge}
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className={bundle.badge ? 'pt-2' : 'pt-6'}>
                      <CardTitle className="text-2xl flex items-center gap-2">
                        {bundle.name}
                        {isElite && <Lock className="h-5 w-5 text-yellow-500" />}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {bundle.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-primary">
                            ${price}
                          </span>
                          <span className="text-sm text-muted-foreground">{periodLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Save {bundle.savings}%
                          </Badge>
                          {pricingPeriod === 'annual' && (
                            <span className="text-xs text-green-400">+ 17% annual discount</span>
                          )}
                        </div>
                      </div>

                      {/* Level Info */}
                      {levelInfo && (
                        <div className="p-3 rounded-lg bg-muted/50 border">
                          <p className="text-sm font-semibold mb-1">{levelInfo.displayName}</p>
                          <p className="text-xs text-muted-foreground">{levelInfo.description}</p>
                        </div>
                      )}

                      {/* Included Programs */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-semibold text-primary mb-1">
                          Includes {bundle.includedPrograms.length} Programs
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All 7 training tracks at the {levelInfo?.name} level
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {bundle.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      {bundle.maxParticipants && (
                        <p className="text-xs text-yellow-500 font-medium">
                          Limited to {bundle.maxParticipants} members
                        </p>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        variant={bundle.badge === 'Most Popular' ? 'default' : 'outline'}
                        asChild
                      >
                        <Link href={`/programs/bundle/${bundle.id}`}>
                          Get This Bundle
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Single Track Bundles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Single Track - All Levels
          </h3>
          <p className="text-muted-foreground mb-8">
            Master one track completely with progressive access to all 5 levels. Perfect for specialized development.
          </p>
          
          <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
            {trackBundles.map((bundle, index) => {
              const { price, periodLabel } = getPriceDisplay(bundle);

              return (
                <motion.div
                  key={bundle.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="flex h-full flex-col transition-all hover:shadow-2xl border-2">
                    <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
                    
                    <CardHeader>
                      <CardTitle className="text-2xl">{bundle.name}</CardTitle>
                      <CardDescription className="text-base">
                        {bundle.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-4">
                      {/* Price */}
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-primary">
                            ${price}
                          </span>
                          <span className="text-sm text-muted-foreground">{periodLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            Save {bundle.savings}%
                          </Badge>
                          {pricingPeriod === 'annual' && (
                            <span className="text-xs text-green-400">+ 17% annual discount</span>
                          )}
                        </div>
                      </div>

                      {/* Included Programs */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-sm font-semibold text-primary mb-1">
                          Includes {bundle.includedPrograms.length} Programs
                        </p>
                        <p className="text-xs text-muted-foreground">
                          All 5 levels: Open → Advanced → Pro → Fancy → Elite
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {bundle.features.map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Check className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-2">
                      <Button 
                        className="w-full" 
                        size="lg"
                        asChild
                      >
                        <Link href={`/programs/bundle/${bundle.id}`}>
                          Get This Bundle
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
