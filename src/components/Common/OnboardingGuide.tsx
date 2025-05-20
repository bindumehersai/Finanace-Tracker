
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, BarChart, Wallet, PiggyBank } from "lucide-react";

interface OnboardingGuideProps {
  isOpen: boolean;
  onComplete: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onComplete }) => {
  const [currentTab, setCurrentTab] = useState("welcome");

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">Welcome to Personal Finance Tracker</DialogTitle>
          <DialogDescription>
            Let's get started with managing your finances effectively.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="welcome">Welcome</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="charts">Charts</TabsTrigger>
          </TabsList>

          <TabsContent value="welcome" className="space-y-4">
            <div className="flex justify-center my-6">
              <div className="bg-primary/10 p-6 rounded-full">
                <Wallet className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-center">Your Personal Finance Assistant</h3>
            
            <p className="text-center text-muted-foreground">
              This app helps you track your finances, manage expenses, and stay on budget. All your data is stored locally on your device.
            </p>
            
            <div className="bg-secondary/50 p-4 rounded-md">
              <p className="text-sm">
                <strong>Privacy Note:</strong> Your financial data is stored only in your browser and is not sent to any servers.
              </p>
            </div>
            
            <div className="text-center mt-4">
              <Button onClick={() => setCurrentTab("transactions")}>Next: Transactions</Button>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <div className="flex justify-center my-6">
              <div className="bg-income/10 p-6 rounded-full">
                <Wallet className="h-12 w-12 text-income" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-center">Track Your Transactions</h3>
            
            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Record all your income and expenses to gain insights into your financial habits.
              </p>
              
              <ul className="space-y-2 list-disc pl-4">
                <li>Add income and expense transactions</li>
                <li>Categorize your transactions</li>
                <li>Filter and sort to find patterns</li>
                <li>Edit or delete as needed</li>
              </ul>
            </div>
            
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setCurrentTab("welcome")} className="mr-2">
                Previous
              </Button>
              <Button onClick={() => setCurrentTab("budget")}>Next: Budgets</Button>
            </div>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4">
            <div className="flex justify-center my-6">
              <div className="bg-budget/10 p-6 rounded-full">
                <PiggyBank className="h-12 w-12 text-budget" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-center">Set and Track Budgets</h3>
            
            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Create budgets for different expense categories to keep your spending in check.
              </p>
              
              <ul className="space-y-2 list-disc pl-4">
                <li>Set monthly or yearly budgets</li>
                <li>Get alerts when nearing budget limits</li>
                <li>Track spending against your budget</li>
                <li>Adjust budgets as needed</li>
              </ul>
            </div>
            
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setCurrentTab("transactions")} className="mr-2">
                Previous
              </Button>
              <Button onClick={() => setCurrentTab("charts")}>Next: Charts</Button>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-4">
            <div className="flex justify-center gap-6 my-6">
              <div className="bg-expense/10 p-4 rounded-full">
                <PieChart className="h-10 w-10 text-expense" />
              </div>
              <div className="bg-savings/10 p-4 rounded-full">
                <BarChart className="h-10 w-10 text-savings" />
              </div>
            </div>

            <h3 className="text-lg font-medium text-center">Visual Insights</h3>
            
            <div className="space-y-3">
              <p className="text-center text-muted-foreground">
                Visualize your finances with intuitive charts and summaries.
              </p>
              
              <ul className="space-y-2 list-disc pl-4">
                <li>See expenses by category</li>
                <li>Compare income vs. expenses over time</li>
                <li>Track your savings progress</li>
                <li>Monitor budget usage</li>
              </ul>
            </div>
            
            <div className="text-center mt-4">
              <Button variant="outline" onClick={() => setCurrentTab("budget")} className="mr-2">
                Previous
              </Button>
              <Button onClick={onComplete}>Get Started!</Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="sm:justify-between">
          <Button variant="link" onClick={onComplete} size="sm" className="text-muted-foreground">
            Skip tutorial
          </Button>
          <div className="flex gap-1">
            {["welcome", "transactions", "budget", "charts"].map((tab, index) => (
              <div 
                key={tab}
                className={`h-1.5 w-6 rounded-full ${
                  currentTab === tab ? 'bg-primary' : 'bg-muted'
                }`}
                onClick={() => setCurrentTab(tab)}
              />
            ))}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingGuide;
