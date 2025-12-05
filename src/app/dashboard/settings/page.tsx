"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Mail, HelpCircle, FileText, RotateCcw, Trash2 } from "lucide-react"; 
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [identity, setIdentity] = useState("User");

  useEffect(() => {
    const fetchUserIdentity = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Try to get display_name from profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (profile?.display_name) {
          setIdentity(profile.display_name);
        } else if (user.email) {
          // 2. Fallback to email if no display_name
          setIdentity(user.email);
        }
      }
    };
    fetchUserIdentity();
  }, []);
  
  
  const handleResetOnboarding = () => {
    localStorage.removeItem("hasSeenDisclaimer_v2"); // Updated to match your current version
    if (confirm("Honor Code reset. Go to Dashboard to see it?")) {
        window.location.href = "/dashboard";
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = confirm("⚠️ ARE YOU SURE? ⚠️\n\nThis will permanently delete your account, all your XP, quests, and leaderboard history.\n\nThis action cannot be undone.");
    
    if (!confirmed) return;

    setIsDeleting(true);

    // Call the RPC function we created in SQL
    const { error } = await supabase.rpc('delete_user_account');

    if (error) {
        alert("Error deleting account: " + error.message);
        setIsDeleting(false);
    } else {
        // Sign out locally to clear session
        await supabase.auth.signOut();
        alert("Account deleted. Goodbye, Adventurer.");
        router.push("/"); // Redirect to landing page
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings & Support</h1>
        <p className="text-muted-foreground">Manage your account and get help.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* SUPPORT SECTION */}
        <Card>
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>We are here to support your journey.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="mailto:syed.abdul.r.2002@gmail.com" className="w-full block">
              <Button className="w-full justify-start gap-2" variant="outline">
                <Mail className="h-4 w-4" />
                Contact Support
              </Button>
            </Link>
            
            {/* Functional Documentation Button */}
            <Link href="/docs" className="w-full block mt-2">
              <Button className="w-full justify-start gap-2" variant="outline">
                <FileText className="h-4 w-4" />
                Read Documentation
              </Button>
            </Link>
            
             <Button className="w-full justify-start gap-2" variant="outline">
                <HelpCircle className="h-4 w-4" />
                Help Center
              </Button>
          </CardContent>
        </Card>

        {/* ACCOUNT SECTION */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle>Account & Preferences</CardTitle>
            <CardDescription>Manage your profile settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <p className="text-sm text-muted-foreground">
                Logged in as <span className="font-semibold text-foreground">{identity}</span>.
             </p>
             
             <Button variant="outline" onClick={handleResetOnboarding} className="w-full justify-start gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset Honor Code Popup
             </Button>

             <div className="pt-4 border-t border-destructive/20">
               <p className="text-xs text-destructive mb-2 font-medium">Danger Zone</p>
               <Button 
                 variant="destructive" 
                 className="w-full justify-start gap-2"
                 onClick={handleDeleteAccount}
                 disabled={isDeleting}
               >
                 <Trash2 className="h-4 w-4" />
                 {isDeleting ? "Deleting..." : "Delete Account"}
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ SECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>How is XP calculated?</AccordionTrigger>
              <AccordionContent>
                XP (Experience Points) are awarded based on the difficulty of the task. Daily tasks typically award 10-20 XP, while major milestones can award 100-200 XP.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Can I edit a task after creating it?</AccordionTrigger>
              <AccordionContent>
                Currently, tasks cannot be edited to preserve the integrity of the gamification system. You can delete a task and create a new one if needed.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Is the AI plan personalized?</AccordionTrigger>
              <AccordionContent>
                Yes! The AI analyzes your specific prompt to build a custom roadmap tailored to your goal, breaking it down into manageable steps.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}