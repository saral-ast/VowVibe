import { Card, CardContent ,CardHeader, CardTitle} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Compact stat card component
const CompactStatCard = ({ 
  value, 
  label, 
  icon: Icon,
  className = "",
  color = "text-foreground"
}: { 
  value: number; 
  label: string; 
  icon: React.ElementType;
  className?: string;
  color?: string;
}) => (
  <Card className={`transition-all hover:shadow-sm ${className}`}>
    <CardContent className="px-3 py-3">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <Icon className={`h-3 w-3 ${color}`} />
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </CardContent>
  </Card>
);

interface TaskStatsProps {
  totalTasks: number;
  completedCount: number;
  inProgressCount?: number;
  in_progress?: number;
  todoCount: number;
  completionPercentage: number;
}

export function TaskStats({
  totalTasks,
  completedCount,
  inProgressCount,
  in_progress,
  todoCount,
  completionPercentage,
}: TaskStatsProps) {
  const inProgress: number = (inProgressCount ?? in_progress ?? 0) as number;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        <div className="w-full">
          <CompactStatCard
            value={totalTasks}
            label="Total Tasks"
            icon={CheckSquare}
            className="bg-card/60 h-full"
          />
        </div>
        <div className="w-full">
          <CompactStatCard
            value={completedCount}
            label="Completed"
            icon={CheckCircle}
            color="text-green-500"
            className="bg-card/60 h-full"
          />
        </div>
        <div className="w-full">
          <CompactStatCard
            value={inProgress}
            label="In Progress"
            icon={Clock}
            color="text-blue-500"
            className="bg-card/60 h-full"
          />
        </div>
        <div className="w-full">
          <CompactStatCard
            value={todoCount}
            label="To Do"
            icon={AlertCircle}
            color="text-yellow-500"
            className="bg-card/60 h-full"
          />
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Wedding Planning Progress</span>
            </div>
            <span className="text-xs text-muted-foreground">{completionPercentage.toFixed(0)}%</span>
          </div>
          <div className="space-y-2">
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground text-right">
              {completedCount} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}