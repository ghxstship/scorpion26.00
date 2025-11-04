'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Award, Flame, Star, Sparkles, X } from 'lucide-react';
import Confetti from 'react-confetti';

interface Milestone {
  id: string;
  milestone_type: 'level_up' | 'badge_earned' | 'challenge_completed' | 'streak_milestone';
  milestone_value?: number;
  title: string;
  description: string;
  icon: string;
  viewed: boolean;
  created_at: string;
}

interface MilestoneCelebrationProps {
  milestone: Milestone;
  onDismiss: () => void;
}

const iconMap: Record<string, any> = {
  trophy: Trophy,
  award: Award,
  flame: Flame,
  star: Star,
  sparkles: Sparkles,
};

export function MilestoneCelebration({ milestone, onDismiss }: MilestoneCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const Icon = iconMap[milestone.icon] || Trophy;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const getBackgroundColor = () => {
    switch (milestone.milestone_type) {
      case 'level_up':
        return 'bg-gradient-to-br from-purple-500/20 to-pink-500/20';
      case 'badge_earned':
        return 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20';
      case 'challenge_completed':
        return 'bg-gradient-to-br from-green-500/20 to-emerald-500/20';
      case 'streak_milestone':
        return 'bg-gradient-to-br from-orange-500/20 to-red-500/20';
      default:
        return 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20';
    }
  };

  const getIconColor = () => {
    switch (milestone.milestone_type) {
      case 'level_up':
        return 'text-purple-500';
      case 'badge_earned':
        return 'text-yellow-500';
      case 'challenge_completed':
        return 'text-green-500';
      case 'streak_milestone':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onDismiss}
      >
        {showConfetti && (
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        <motion.div
          initial={{ rotate: -5 }}
          animate={{ rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Card className={`w-full max-w-md ${getBackgroundColor()} border-2`}>
            <CardHeader className="text-center relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={onDismiss}
              >
                <X className="h-4 w-4" />
              </Button>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto mb-4"
              >
                <div className={`h-24 w-24 rounded-full ${getBackgroundColor()} flex items-center justify-center mx-auto`}>
                  <Icon className={`h-12 w-12 ${getIconColor()}`} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <CardTitle className="text-2xl font-bold mb-2">
                  {milestone.title}
                </CardTitle>
              </motion.div>
            </CardHeader>

            <CardContent className="text-center space-y-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground"
              >
                {milestone.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button onClick={onDismiss} className="w-full" size="lg">
                  Awesome!
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface MilestoneNotificationProps {
  milestone: Milestone;
  onDismiss: () => void;
}

export function MilestoneNotification({ milestone, onDismiss }: MilestoneNotificationProps) {
  const Icon = iconMap[milestone.icon] || Trophy;

  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const getIconColor = () => {
    switch (milestone.milestone_type) {
      case 'level_up':
        return 'text-purple-500 bg-purple-500/10';
      case 'badge_earned':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'challenge_completed':
        return 'text-green-500 bg-green-500/10';
      case 'streak_milestone':
        return 'text-orange-500 bg-orange-500/10';
      default:
        return 'text-blue-500 bg-blue-500/10';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="fixed top-4 right-4 z-50 w-80"
    >
      <Card className="border-2 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${getIconColor()}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm mb-1">{milestone.title}</p>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {milestone.description}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 flex-shrink-0"
              onClick={onDismiss}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface MilestoneManagerProps {
  userId: string;
  showFullCelebration?: boolean;
}

export function MilestoneManager({ userId, showFullCelebration = true }: MilestoneManagerProps) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null);

  useEffect(() => {
    loadMilestones();
    const interval = setInterval(loadMilestones, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [userId]);

  const loadMilestones = async () => {
    // TODO: Implement actual API call to fetch unviewed milestones
    // For now, this is a placeholder
  };

  const handleDismiss = async (milestoneId: string) => {
    // TODO: Mark milestone as viewed in database
    setMilestones(prev => prev.filter(m => m.id !== milestoneId));
    setCurrentMilestone(null);
  };

  useEffect(() => {
    if (milestones.length > 0 && !currentMilestone) {
      setCurrentMilestone(milestones[0]);
    }
  }, [milestones, currentMilestone]);

  if (!currentMilestone) return null;

  if (showFullCelebration) {
    return (
      <MilestoneCelebration
        milestone={currentMilestone}
        onDismiss={() => handleDismiss(currentMilestone.id)}
      />
    );
  }

  return (
    <MilestoneNotification
      milestone={currentMilestone}
      onDismiss={() => handleDismiss(currentMilestone.id)}
    />
  );
}
