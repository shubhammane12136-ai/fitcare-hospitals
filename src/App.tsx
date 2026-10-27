/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/home/LandingPage';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { TrainerDashboard } from './components/dashboard/TrainerDashboard';
import { MemberDashboard } from './components/dashboard/MemberDashboard';
import { MemberDirectoryView } from './components/dashboard/MemberDirectoryView';
import { MemberDetailsModal } from './components/dashboard/MemberDetailsModal';
import { WorkoutPlanView } from './components/workouts/WorkoutPlanView';
import { ProductCatalog } from './components/products/ProductCatalog';
import { GymCommunity } from './components/community/GymCommunity';
import { AuthModal } from './components/auth/AuthModal';
import { AssessmentModal } from './components/assessments/AssessmentModal';
import { DatabaseInspectorModal } from './components/database/DatabaseInspectorModal';
import { UserProfile } from './types';

const MainApp: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Modals state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [selectedAssessmentMember, setSelectedAssessmentMember] = useState<UserProfile | null>(null);
  const [selectedProfileMember, setSelectedProfileMember] = useState<UserProfile | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <span>Initializing FitCare Platform...</span>
        </div>
      </div>
    );
  }

  // If user is guest/logged out, show Landing Page with registration/login triggers
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <LandingPage
          onOpenAuthModal={(mode) => {
            setAuthModalMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
          onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          onEnterDashboard={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
        />
        <Footer openDatabaseModal={() => setIsDatabaseModalOpen(true)} />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authModalMode}
        />
        <DatabaseInspectorModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Sticky App Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={() => {
          setAuthModalMode('login');
          setIsAuthModalOpen(true);
        }}
        openDatabaseModal={() => setIsDatabaseModalOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <>
            {currentUser.role === 'owner' && (
              <OwnerDashboard
                onOpenDirectoryTab={() => setActiveTab('directory')}
                onOpenCatalogTab={() => setActiveTab('products')}
                onSelectMember={(member) => setSelectedProfileMember(member)}
              />
            )}
            {currentUser.role === 'trainer' && (
              <TrainerDashboard
                onOpenAssessment={(member) => {
                  setSelectedAssessmentMember(member);
                  setIsAssessmentModalOpen(true);
                }}
                onOpenWorkoutEditor={() => setActiveTab('workouts')}
              />
            )}
            {currentUser.role === 'member' && (
              <MemberDashboard
                onOpenWorkoutsTab={() => setActiveTab('workouts')}
                onOpenCatalogTab={() => setActiveTab('products')}
                onOpenCommunityTab={() => setActiveTab('community')}
              />
            )}
          </>
        )}

        {activeTab === 'directory' && (
          <MemberDirectoryView
            onSelectMember={(member) => setSelectedProfileMember(member)}
          />
        )}

        {activeTab === 'trainer_members' && (
          <TrainerDashboard
            onOpenAssessment={(member) => {
              setSelectedAssessmentMember(member);
              setIsAssessmentModalOpen(true);
            }}
            onOpenWorkoutEditor={() => setActiveTab('workouts')}
          />
        )}

        {activeTab === 'workouts' && <WorkoutPlanView />}

        {activeTab === 'products' && <ProductCatalog />}

        {activeTab === 'community' && <GymCommunity />}
      </main>

      {/* Footer */}
      <Footer openDatabaseModal={() => setIsDatabaseModalOpen(true)} />

      {/* Modals & Dialogs */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      <DatabaseInspectorModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
      />

      <AssessmentModal
        isOpen={isAssessmentModalOpen}
        onClose={() => {
          setIsAssessmentModalOpen(false);
          setSelectedAssessmentMember(null);
        }}
        member={selectedAssessmentMember}
      />

      <MemberDetailsModal
        member={selectedProfileMember}
        onClose={() => setSelectedProfileMember(null)}
        onOpenAssessmentModal={(member) => {
          setSelectedProfileMember(null);
          setSelectedAssessmentMember(member);
          setIsAssessmentModalOpen(true);
        }}
        onOpenWorkoutEditor={() => {
          setSelectedProfileMember(null);
          setActiveTab('workouts');
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
