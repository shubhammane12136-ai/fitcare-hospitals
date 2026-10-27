import React, { useState } from 'react';
import {
  Users,
  Trophy,
  Flame,
  MessageSquare,
  Heart,
  Share2,
  Calendar,
  Lock,
  Plus,
  Send,
  CheckCircle,
  Eye,
  Shield,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../db/storage';
import { CommunityPost, CommunityChallenge, LeaderboardEntry } from '../../types';

export const GymCommunity: React.FC = () => {
  const { currentUser, updateProfile, refreshState } = useAuth();
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');
  const [postCategory, setPostCategory] = useState<'achievement' | 'discussion'>('achievement');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const posts = storage.getCommunityPosts();
  const challenges = storage.getChallenges();
  const leaderboard = storage.getLeaderboard();
  const users = storage.getUsers();

  // Public members directory (confidential metrics are never revealed)
  const publicMembers = users.filter((u) => u.role === 'member' && u.isProfilePublic);

  const handleToggleLike = (postId: string) => {
    storage.toggleLikePost(postId);
    refreshState();
  };

  const handleToggleJoinChallenge = (challengeId: string) => {
    storage.toggleJoinChallenge(challengeId);
    refreshState();
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !postTitle.trim() || !postContent.trim()) return;

    storage.addCommunityPost({
      authorId: currentUser.id,
      authorName: currentUser.fullName,
      authorRole: currentUser.role,
      authorAvatar: currentUser.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      title: postTitle,
      content: postContent,
      category: postCategory,
    });

    setPostTitle('');
    setPostContent('');
    setIsPosting(false);
    refreshState();
  };

  const handleTogglePrivacy = (field: 'isProfilePublic' | 'allowLeaderboard') => {
    if (!currentUser) return;
    updateProfile({ [field]: !currentUser[field] });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white font-['Outfit']">
              Apex Athletic Community
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              Voluntary & Safe
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Celebrate member consistency milestones, join group challenges, and motivate each other.
          </p>
        </div>

        {/* Member Privacy Toggle Quick Controls */}
        {currentUser?.role === 'member' && (
          <div className="flex flex-wrap items-center gap-2 text-xs bg-slate-950 p-2 rounded-xl border border-slate-800">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <button
              onClick={() => handleTogglePrivacy('isProfilePublic')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                currentUser.isProfilePublic
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              Public in Directory: {currentUser.isProfilePublic ? 'On' : 'Private'}
            </button>
            <button
              onClick={() => handleTogglePrivacy('allowLeaderboard')}
              className={`px-2.5 py-1 rounded text-[11px] transition-colors whitespace-nowrap ${
                currentUser.allowLeaderboard
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              Leaderboard: {currentUser.allowLeaderboard ? 'Opted In' : 'Hidden'}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('feed')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
            activeTab === 'feed'
              ? 'bg-slate-800 border-emerald-500/80 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Announcements & Achievements
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
            activeTab === 'challenges'
              ? 'bg-slate-800 border-emerald-500/80 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Group Challenges ({challenges.length})
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 border ${
            activeTab === 'leaderboard'
              ? 'bg-slate-800 border-emerald-500/80 text-white'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
          }`}
        >
          Consistency Leaderboard
        </button>
      </div>

      {/* Tab 1: Community Posts & Achievements */}
      {activeTab === 'feed' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Feed (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Create Post Prompt */}
            {!isPosting ? (
              <div
                onClick={() => setIsPosting(true)}
                className="p-4 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser?.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt="Current user"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-700"
                  />
                  <span className="text-xs text-slate-400">Share a fitness achievement or training question...</span>
                </div>
                <Plus className="w-4 h-4 text-emerald-400" />
              </div>
            ) : (
              <form onSubmit={handleCreatePost} className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Share with Gym Members</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPostCategory('achievement')}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        postCategory === 'achievement' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
                      }`}
                    >
                      Achievement
                    </button>
                    <button
                      type="button"
                      onClick={() => setPostCategory('discussion')}
                      className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                        postCategory === 'discussion' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
                      }`}
                    >
                      Discussion
                    </button>
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Post title or milestone (e.g. Hit a new 100kg deadlift milestone!)..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <textarea
                  rows={3}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Details, coach encouragement, or helpful tips..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsPosting(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            )}

            {/* Posts List */}
            {posts.map((post) => (
              <div
                key={post.id}
                className={`p-5 bg-slate-900 border rounded-2xl space-y-3 transition-colors ${
                  post.pinned ? 'border-amber-500/40 bg-slate-900/90' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={post.authorName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{post.authorName}</span>
                        <span className="text-[10px] text-slate-400 capitalize">({post.authorRole})</span>
                        {post.pinned && (
                          <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            Gym Announcement
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{post.createdAt}</span>
                    </div>
                  </div>

                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                    {post.category}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>

                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-4 text-xs">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 transition-colors ${
                      post.likedByCurrentUser ? 'text-rose-400 font-semibold' : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${post.likedByCurrentUser ? 'fill-current' : ''}`} />
                    <span className="font-mono tabular-nums">{post.likes} Cheers</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Public Members Spotlight (4 cols) */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Community Members ({publicMembers.length})
                </h3>
                <p className="text-[11px] text-slate-400">Members with public profile setting enabled</p>
              </div>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="space-y-2">
              {publicMembers.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 bg-slate-950 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={member.profilePhoto || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                      alt={member.fullName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <p className="font-semibold text-slate-200">{member.fullName}</p>
                      <p className="text-[10px] text-slate-400 capitalize">
                        {member.fitnessGoal.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    {member.preferredWorkoutDays.length}d / wk
                  </span>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Privacy Safeguard:</strong> Health metrics, private measurements, and coach evaluation notes are never revealed to other community members.
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Group Fitness Challenges */}
      {activeTab === 'challenges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge.id}
              className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    {challenge.category} Challenge
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>{challenge.startDate} to {challenge.endDate}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white font-['Outfit'] mt-1">
                  {challenge.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{challenge.description}</p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-300">
                    Target: <strong className="text-emerald-400 font-mono">{challenge.targetMetric}</strong>
                  </span>
                  <span className="text-slate-400 font-mono tabular-nums">
                    {challenge.participantsCount} participants
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {challenge.joined ? 'You are enrolled' : 'Open for voluntary join'}
                </span>
                <button
                  onClick={() => handleToggleJoinChallenge(challenge.id)}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                    challenge.joined
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      : 'bg-emerald-400 hover:bg-emerald-300 text-slate-950 shadow-sm'
                  }`}
                >
                  {challenge.joined ? 'Leave Challenge' : 'Join Challenge'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Consistency Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white font-['Outfit']">
                Voluntary Workout Consistency Leaderboard
              </h3>
              <p className="text-xs text-slate-400">
                Rankings determined purely by voluntary participation, completed workout consistency, and active streaks.
              </p>
            </div>
            <Trophy className="w-5 h-5 text-amber-400" />
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Member</th>
                  <th className="px-4 py-3">Sessions Completed This Month</th>
                  <th className="px-4 py-3">Consistency Streak</th>
                  <th className="px-4 py-3 text-right">Badge Honor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900">
                {leaderboard.map((entry) => (
                  <tr key={entry.memberId} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-sm">
                      {entry.rank === 1 && <span className="text-amber-400">#1</span>}
                      {entry.rank === 2 && <span className="text-slate-300">#2</span>}
                      {entry.rank === 3 && <span className="text-amber-600">#3</span>}
                      {entry.rank > 3 && <span className="text-slate-500">#{entry.rank}</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar}
                          alt={entry.memberName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-semibold text-white">{entry.memberName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-emerald-400 font-bold tabular-nums">
                      {entry.workoutsCompletedThisMonth} sessions
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-300 tabular-nums">
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-400" />
                        <span>{entry.streakDays} days</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                        {entry.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
