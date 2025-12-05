import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BookOpen, Shield, Zap, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Background (Same as Dashboard) */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background dark:hidden bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
      </div>

      <div className="container mx-auto max-w-3xl py-12 px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard/settings">
            <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent hover:text-primary">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Settings
            </Button>
          </Link>
          <h1 className="text-4xl font-bold flex items-center gap-3 text-primary">
            <BookOpen className="h-8 w-8" />
            Adventurer&apos;s Guide
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Everything you need to know about leveling up your life.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          
          <section id="xp-system">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  The XP System
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <p>
                  Experience Points (XP) are the core of LevelUp Life. You earn them by completing tasks.
                  The amount of XP depends on the difficulty and type of the task:
                </p>
                <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
                  <li><strong>Daily Tasks:</strong> 10-20 XP. These reset every day.</li>
                  <li><strong>Weekly Quests:</strong> 50-80 XP. Larger tasks that require consistent effort.</li>
                  <li><strong>Milestones:</strong> 150-200 XP. Significant achievements in your journey.</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section id="quests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-500" />
                  Quests & AI Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <p>
                  Dont know where to start? Use the <strong>AI Planner</strong> to generate a custom roadmap.
                  Enter a goal like <em>&quot;Learn to run a 5K&quot;</em>, and our AI coach will break it down into
                  manageable steps for you.
                </p>
                <p>
                  Each plan is saved as a <strong>Quest</strong> in your dashboard. You can switch between active quests using the tabs.
                </p>
              </CardContent>
            </Card>
          </section>

          <section id="integrity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  The Honor Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed">
                <p>
                  LevelUp Life is built on trust. There is no one checking your work but you.
                  Cheating on tasks only cheats your own potential.
                </p>
                <p>
                  <strong>Tip:</strong> If you miss a task, do not just check it off to keep a streak. 
                  Accept the miss, and try harder tomorrow. That is where real growth happens.
                </p>
              </CardContent>
            </Card>
          </section>

        </div>
      </div>
    </div>
  );
}