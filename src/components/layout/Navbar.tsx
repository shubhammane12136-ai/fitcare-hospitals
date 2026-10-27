import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { storage } from '../../db/storage';
import {
  Dumbbell,
  Bell,
  UserCheck,
  ChevronDown,
  Database,
  LogOut,
  Shield,
  Award,
  User,
  Check,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openDatabaseModal: () => void;
  openAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openDatabaseModal,
  openAuthModal,
}) => {
  const { currentUser, quickSwitchRole, switchUser, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const allUsers = storage.getUsers();
  const notifications = currentUser ? storage.getNotifications(currentUser.id) : [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getRoleBadge = (role?: UserRole) => {
    switch (role) {
      case 'owner':
        return { text: 'Gym Owner', color: 'text-amber-400 bg-amber-950/60 border-amber-800/60' };
      case 'trainer':
        return { text: 'Coach / Trainer', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60' };
      case 'member':
      default:
        return { text: 'Member', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60' };
    }
  };

  const badge = getRoleBadge(currentUser?.role);

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
              <Dumbbell className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-white font-['Outfit']">
                FitCare
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider uppercase font-medium -mt-1">
                Smart Gym & Health
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'dashboard'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Dashboard
          </button>

          {currentUser?.role === 'owner' && (
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'directory'
                  ? 'text-white bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              Member Directory
            </button>
          )}

          {currentUser?.role === 'trainer' && (
            <button
              onClick={() => setActiveTab('trainer_members')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'trainer_members'
                  ? 'text-white bg-slate-800/90 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              My Trainees
            </button>
          )}

          <button
            onClick={() => setActiveTab('workouts')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'workouts'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Workout Plans
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Nutrition & Catalog
          </button>

          <button
            onClick={() => setActiveTab('community')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'community'
                ? 'text-white bg-slate-800/90 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            Community
          </button>
        </nav>

        {/* Zone 3: Actions & Quick Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={openDatabaseModal}
            title="Supabase Schema & RLS Inspector"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>SQL / RLS</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg relative transition-colors focus:outline-none"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-200">Notifications</span>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/50">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          storage.markNotificationRead(n.id);
                          setShowNotifications(false);
                        }}
                        className={`p-3 text-left hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !n.read ? 'bg-slate-800/30' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-200 line-clamp-1">
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-400 tabular-nums shrink-0">
                            {n.date}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all focus:outline-none"
            >
              <img
                src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                alt={currentUser?.fullName || 'User'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-slate-700"
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-200 line-clamp-1 max-w-[110px]">
                  {currentUser?.fullName}
                </span>
                <span className="text-[10px] text-emerald-400 capitalize">
                  {badge.text}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 divide-y divide-slate-800/60">
                <div className="px-4 py-2.5">
                  <p className="text-xs font-semibold text-white">{currentUser?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{currentUser?.email}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${badge.color}`}>
                      {badge.text}
                    </span>
                    <span className="text-[10px] text-slate-400">·</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Gym: {currentUser?.gymCode || 'APEX-2026'}
                    </span>
                  </div>
                </div>

                <div className="py-2 px-2">
                  <p className="px-2 pb-1 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Switch Test Account / Role
                  </p>
                  
                  <button
                    onClick={() => {
                      quickSwitchRole('owner');
                      setShowRoleMenu(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-amber-400" />
                      <span>Varad Sutar (Owner)</span>
                    </div>
                    {currentUser?.role === 'owner' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => {
                      const trainer = allUsers.find((u) => u.role === 'trainer');
                      if (trainer) switchUser(trainer.id);
                      setShowRoleMenu(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Marcus Cole (Trainer)</span>
                    </div>
                    {currentUser?.role === 'trainer' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>

                  <button
                    onClick={() => {
                      const member = allUsers.find((u) => u.role === 'member');
                      if (member) switchUser(member.id);
                      setShowRoleMenu(false);
                      setActiveTab('dashboard');
                    }}
                    className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>David Miller (Member)</span>
                    </div>
                    {currentUser?.role === 'member' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                </div>

                <div className="py-1 px-2">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      openAuthModal();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>Register New Member</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="md:hidden border-t border-slate-800/60 bg-slate-950/95 px-3 py-2 flex items-center justify-between gap-1 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
            activeTab === 'dashboard' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          Dashboard
        </button>
        {currentUser?.role === 'owner' && (
          <button
            onClick={() => setActiveTab('directory')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'directory' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            Members
          </button>
        )}
        {currentUser?.role === 'trainer' && (
          <button
            onClick={() => setActiveTab('trainer_members')}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
              activeTab === 'trainer_members' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
            }`}
          >
            Trainees
          </button>
        )}
        <button
          onClick={() => setActiveTab('workouts')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
            activeTab === 'workouts' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          Plans
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
            activeTab === 'products' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
            activeTab === 'community' ? 'text-emerald-400 bg-slate-900' : 'text-slate-400'
          }`}
        >
          Community
        </button>
      </div>
    </header>
  );
};
