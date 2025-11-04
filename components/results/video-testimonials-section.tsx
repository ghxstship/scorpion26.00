"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { containerClasses, sectionClasses } from "@/lib/design-tokens";

const videos = [
  {
    title: "Sarah's 90-Day Transformation Journey",
    thumbnail: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop",
    duration: "3:45",
  },
  {
    title: "Mike's Strength Building Success",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop",
    duration: "2:30",
  },
  {
    title: "Emily's Weight Loss Story",
    thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop",
    duration: "4:15",
  },
];

export default function VideoTestimonialsSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section ref={ref} className={`${sectionClasses.xl} bg-gradient-to-b from-zone-purple-base via-zone-purple-secondary/20 to-zone-purple-base relative`}>
      {/* Purple Zone Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zone-purple-primary to-transparent" />
      <div className={containerClasses.default}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-heading text-4xl font-bold sm:text-5xl">
            Video Testimonials
          </h2>
          <p className="mt-4 text-xl text-muted-foreground">
            Hear their stories in their own words
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Card className="overflow-hidden transition-all border-2 border-border bg-card/50 backdrop-blur-sm hover:border-primary hover:shadow-lg hover:shadow-primary/20 cursor-pointer group">
                <div
                  className="relative aspect-video bg-cover bg-center"
                  style={{ backgroundImage: `url(${video.thumbnail})` }}
                >
                  <div className="absolute inset-0 bg-background/40 dark:bg-black/40 flex items-center justify-center transition-all group-hover:bg-background/50 dark:group-hover:bg-black/50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary border-2 border-primary/30 transition-transform group-hover:scale-110">
                      <Play className="h-8 w-8 text-primary-foreground ml-1" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 rounded bg-background/80 dark:bg-black/80 px-2 py-1 text-xs text-foreground">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{video.title}</h3>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
