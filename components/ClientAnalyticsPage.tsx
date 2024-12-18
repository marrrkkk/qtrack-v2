"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface ClassData {
  id: number;
  teacherName: string;
  teacherId: string;
  subject: string;
  room: string;
  schedule: string;
  students: string[] | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

interface ClientAnalyticsPageProps {
  classes: ClassData[];
}

export default function ClientAnalyticsPage({ classes }: ClientAnalyticsPageProps) {
  // Calculate analytics
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((acc, curr) => acc + (curr.students?.length || 0), 0);
  const averageStudentsPerClass = totalClasses > 0 ? Math.round(totalStudents / totalClasses) : 0;
  const activeClasses = classes.filter(c => {
    const endDate = new Date(c.endDate);
    return endDate >= new Date();
  }).length;

  const analyticsData = [
    {
      title: "Total Classes",
      value: totalClasses,
      icon: BookOpen,
      description: "Total number of classes created"
    },
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      description: "Total number of enrolled students"
    },
    {
      title: "Active Classes",
      value: activeClasses,
      icon: Calendar,
      description: "Number of currently active classes"
    },
    {
      title: "Avg. Students per Class",
      value: averageStudentsPerClass,
      icon: TrendingUp,
      description: "Average number of students per class"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 dark:from-background dark:to-background/80 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Overview of your teaching statistics and class performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analyticsData.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {item.title}
                  </CardTitle>
                  <item.icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{item.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* You can add more sections here like:
            - Class size distribution chart
            - Attendance trends
            - Subject distribution
            - Schedule heatmap
        */}
      </div>
    </div>
  );
} 