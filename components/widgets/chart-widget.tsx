// Chart Widget Component
// Displays data visualizations with various chart types

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export type ChartType = "line" | "bar" | "area" | "pie";

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface ChartWidgetProps {
  title: string;
  description?: string;
  data: ChartDataPoint[];
  chartType?: ChartType;
  showTrend?: boolean;
  trendValue?: number;
  trendLabel?: string;
  height?: number;
}

export default function ChartWidget({
  title,
  description,
  data,
  chartType = "line",
  showTrend = false,
  trendValue,
  trendLabel,
  height = 200,
}: ChartWidgetProps) {
  // Calculate trend direction
  const getTrendIcon = () => {
    if (!trendValue) return <Minus className="h-4 w-4" />;
    if (trendValue > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trendValue < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!trendValue) return "text-muted-foreground";
    return trendValue > 0 ? "text-green-500" : "text-red-500";
  };

  // Simple bar chart visualization (placeholder for actual charting library)
  const renderSimpleBarChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    
    return (
      <div className="flex items-end justify-between gap-2" style={{ height: `${height}px` }}>
        {data.map((point, index) => {
          const heightPercent = (point.value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '100%' }}>
                <div
                  className="w-full bg-primary rounded-t transition-all hover:opacity-80"
                  style={{ height: `${heightPercent}%` }}
                  title={`${point.label}: ${point.value}`}
                />
              </div>
              <span className="text-xs text-muted-foreground truncate w-full text-center">
                {point.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  // Simple line chart visualization
  const renderSimpleLineChart = () => {
    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    return (
      <div className="relative" style={{ height: `${height}px` }}>
        <svg width="100%" height="100%" className="overflow-visible">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((percent) => (
            <line
              key={percent}
              x1="0"
              y1={`${percent}%`}
              x2="100%"
              y2={`${percent}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-muted-foreground/20"
            />
          ))}
          
          {/* Line path */}
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-primary"
            points={data.map((point, index) => {
              const x = (index / (data.length - 1)) * 100;
              const y = 100 - ((point.value - minValue) / range) * 100;
              return `${x}%,${y}%`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="currentColor"
                className="text-primary"
              >
                <title>{`${point.label}: ${point.value}`}</title>
              </circle>
            );
          })}
        </svg>
        
        {/* Labels */}
        <div className="flex justify-between mt-2">
          {data.map((point, index) => (
            <span key={index} className="text-xs text-muted-foreground">
              {point.label}
            </span>
          ))}
        </div>
      </div>
    );
  };

  // Render chart based on type
  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return renderSimpleBarChart();
      case "line":
      case "area":
        return renderSimpleLineChart();
      case "pie":
        return (
          <div className="text-center text-muted-foreground py-8">
            Pie chart visualization
          </div>
        );
      default:
        return renderSimpleBarChart();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          {showTrend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>
              {trendLabel && <span className="text-xs text-muted-foreground ml-1">{trendLabel}</span>}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          renderChart()
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
