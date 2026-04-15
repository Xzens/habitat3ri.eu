"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Sun, Building2, Battery, Network, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PillarsProps = {
  dict: {
    pillars: {
      sectionTag: string;
      title: string;
      subtitle: string;
      items: {
        title: string;
        description: string;
        detail: string;
      }[];
    };
  };
};

const pillarIcons = [Sun, Building2, Battery, Network, Car];
const pillarGradients = [
  "from-yellow-400 to-orange-500",
  "from-eco-green to-emerald-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-pink-500",
  "from-teal-400 to-cyan-500",
];

export default function Pillars({ dict }: PillarsProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="piliers" className="relative py-24 sm:py-32" ref={ref}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Badge variant="outline" className="mb-4 border-eco-green/30 bg-eco-green/5 text-eco-green">
            {dict.pillars.sectionTag}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {dict.pillars.title}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">{dict.pillars.subtitle}</p>
        </div>

        {/* Pillars grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dict.pillars.items.map((item, i) => {
            const Icon = pillarIcons[i];
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={i >= 3 ? "md:col-span-1 lg:col-span-1" : ""}
              >
                <Card className="group relative h-full overflow-hidden border-border/50 bg-card/50 transition-all duration-300 hover:border-eco-green/30 hover:shadow-lg hover:shadow-eco-green/5">
                  <CardContent className="p-6">
                    {/* Number + Icon */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${pillarGradients[i]} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-5xl font-black text-muted/60">{String(i + 1).padStart(2, "0")}</span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold">{item.title}</h3>
                    <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="rounded-lg bg-muted/50 px-3 py-2">
                      <p className="text-xs font-medium text-muted-foreground">{item.detail}</p>
                    </div>
                  </CardContent>

                  {/* Hover gradient border */}
                  <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${pillarGradients[i]} opacity-0 transition-opacity group-hover:opacity-100`} />
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
