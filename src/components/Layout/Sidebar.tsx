
import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  PieChart,
  BarChart,
  Wallet,
  Home,
  PiggyBank,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'transactions', label: 'Transactions', icon: Wallet },
    { id: 'budget', label: 'Budget', icon: PiggyBank },
    { id: 'expenses', label: 'Expenses', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: BarChart },
  ];

  return (
    <div className="bg-white shadow-sm border-r w-16 md:w-48 h-full flex flex-col py-4">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant={activeTab === item.id ? 'default' : 'ghost'}
          className={`my-1 justify-start ${
            activeTab === item.id 
              ? 'bg-primary text-primary-foreground' 
              : 'hover:bg-secondary'
          } ${
            activeTab === item.id 
              ? 'w-full rounded-none border-r-4 border-primary' 
              : ''
          }`}
          onClick={() => setActiveTab(item.id)}
        >
          <item.icon className="h-5 w-5 md:mr-2" />
          <span className="hidden md:inline">{item.label}</span>
        </Button>
      ))}
      
      <Separator className="my-4" />
      
      <div className="mt-auto px-3">
        <p className="text-xs text-muted-foreground hidden md:block">
          Version 1.0.0
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
