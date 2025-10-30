"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Dumbbell, Zap, Crown, Check } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { BUNDLES } from "@/lib/programs-list";
import { LEVELS } from "@/lib/programs-data";

const tierIcons = {
  starter: Star,
  advanced: Dumbbell,
  pro: Zap,
  elite: Crown,
};

export default function ProgramShowcaseSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const tierBundles = BUNDLES.filter(b => b.type === 'single-tier-all-tracks');

  return (
    <section ref={ref} className="py-16 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-14 md:mb-16 text-center"
        >
          <h2 className="font-montserrat text-3xl sm:text-4xl md:text-5xl font-bold">
            Choose Your Tier
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-muted-foreground px-4">
            All 7 training tracks at your chosen level
          </p>
        </motion.div>

        {/* Tier Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
          {tierBundles.map((bundle, index) => {
            const levelInfo = bundle.tier ? LEVELS[bundle.tier] : null;
            if (!levelInfo) return null;
            
            const TierIcon = tierIcons[bundle.tier as keyof typeof tierIcons];
            const isPopular = bundle.badge === 'Most Popular';
            const isElite = bundle.tier === 'elite';

            return (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className={`flex h-full flex-col transition-all hover:shadow-2xl relative overflow-hidden ${
                  isPopular ? 'border-primary border-2' : isElite ? 'border-yellow-500 border-2' : 'border-2'
                }`}>
                  {/* Accent Bar */}
                  <div className={`h-1.5 absolute top-0 left-0 right-0 z-10 ${
                    isPopular ? 'bg-primary' : isElite ? 'bg-yellow-500' : 'bg-muted'
                  }`} />

                  {/* Badge */}
                  {bundle.badge && (
                    <div className="p-3 sm:p-4 pb-0 pt-5 sm:pt-6 relative z-10">
                      <Badge className={isPopular ? 'bg-primary' : isElite ? 'bg-yellow-500' : 'bg-secondary'}>
                        {bundle.badge}
                      </Badge>
                    </div>
                  )}

                  <CardHeader className={bundle.badge ? 'pt-2 sm:pt-3 p-3 sm:p-4' : 'pt-5 sm:pt-6 p-3 sm:p-4'}>
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className={`p-2 sm:p-2.5 rounded-lg ${
                        isPopular ? 'bg-primary/20' : isElite ? 'bg-yellow-500/20' : 'bg-muted'
                      }`}>
                        <TierIcon className={`h-5 w-5 sm:h-6 sm:w-6 ${
                          isPopular ? 'text-primary' : isElite ? 'text-yellow-500' : 'text-foreground'
                        }`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg sm:text-xl md:text-2xl">{levelInfo.name}</CardTitle>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{levelInfo.description}</p>
                  </CardHeader>

                  <CardContent className="flex-1 space-y-3 sm:space-y-4 p-3 sm:p-4 pt-0">
                    {/* Price */}
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
                          ${bundle.pricing.monthly}
                        </span>
                        <span className="text-xs sm:text-sm text-muted-foreground">/month</span>
                      </div>
                      <Badge variant="outline" className="text-green-500 border-green-500 mt-2 text-xs">
                        Save {bundle.savings}%
                      </Badge>
                    </div>

                    {/* Included */}
                    <div className="p-2.5 sm:p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs sm:text-sm font-semibold text-primary mb-1">
                        All 7 Training Tracks
                      </p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Strength • Performance • Cardio • Nutrition • Mental • Recovery • Team Sports
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 sm:space-y-2">
                      {bundle.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-start text-xs sm:text-sm">
                          <Check className="mr-1.5 sm:mr-2 mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 flex-shrink-0 text-primary" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="p-3 sm:p-4 pt-0">
                    <Button 
                      className="w-full text-xs sm:text-sm h-9 sm:h-10" 
                      variant={isPopular ? 'default' : 'outline'}
                      asChild
                    >
                      <Link href="/programs#bundles">
                        {isElite ? 'Request Access' : 'Get Started'}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 sm:mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild className="text-sm sm:text-base">
            <Link href="/programs">
              View All Programs →
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
