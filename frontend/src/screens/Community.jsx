import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ThumbsUp, MessageSquare, Plus, Send, X, MessageCircle, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/Layout.jsx';
import { useAuth } from '../lib/auth.jsx';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export function Community() {
  const { user, profile } = useAuth();
  const [postList, setPostList] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('question');
  const [showAdd, setShowAdd] = useState(false);
  const [commentInputs, setCommentInputs] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  // 1-like-per-user tracking
  const [likedPostIds, setLikedPostIds] = useState(() => {
    try {
      const saved = localStorage.getItem('urvixa_liked_posts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const saveLikedPosts = (ids) => {
    setLikedPostIds(ids);
    try {
      localStorage.setItem('urvixa_liked_posts', JSON.stringify(ids));
    } catch {}
  };

  // Fetch Community Posts from API
  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/community-posts/`);
      if (res.ok) {
        const data = await res.json();
        // Ensure posts structure
        const formatted = data.map((p) => ({
          id: p.id,
          author: p.author || 'Verified Grower',
          type: p.type || 'question',
          title: p.title,
          content: p.content,
          likes: p.likes || 0,
          comments: p.comments || []
        }));
        setPostList(formatted);
      }
    } catch {
      // Local fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Publish New Question / Tip
  const addPost = async () => {
    if (!newTitle.trim()) return;

    const authorName = profile?.full_name || user?.username || 'Verified Grower';
    const tempId = `post-${Date.now()}`;
    const newPostItem = {
      id: tempId,
      author: authorName,
      type: newType,
      title: newTitle,
      content: newContent,
      likes: 0,
      comments: []
    };

    // Optimistic UI update
    setPostList([newPostItem, ...postList]);
    setNewTitle('');
    setNewContent('');
    setShowAdd(false);

    // API Call
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      try {
        const res = await fetch(`${API_BASE_URL}/community-posts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: newTitle,
            content: newContent,
            type: newType
          })
        });
        if (res.ok) {
          fetchPosts();
        }
      } catch {}
    }
  };

  // 1-Like-per-user Toggle Function
  const toggleLike = async (postId) => {
    const isLiked = likedPostIds.includes(postId);
    const updatedLikes = isLiked
      ? likedPostIds.filter((id) => id !== postId)
      : [...likedPostIds, postId];

    saveLikedPosts(updatedLikes);

    // Update local post state (+1 or -1)
    setPostList(
      postList.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            likes: isLiked ? Math.max(0, p.likes - 1) : p.likes + 1
          };
        }
        return p;
      })
    );

    // API Call to Django Backend
    try {
      await fetch(`${API_BASE_URL}/community-posts/${postId}/like/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: isLiked ? 'unlike' : 'like' })
      });
    } catch {}
  };

  // Comment Submission Handler
  const handleCommentSubmit = async (postId) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    setSubmittingComment({ ...submittingComment, [postId]: true });

    const authorName = profile?.full_name || user?.username || 'Verified Grower';
    const newComment = {
      id: `comment-${Date.now()}`,
      author: authorName,
      content: text.trim()
    };

    // Optimistic UI Update
    setPostList(
      postList.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), newComment]
          };
        }
        return p;
      })
    );

    setCommentInputs({ ...commentInputs, [postId]: '' });

    // Sync with Django Backend API
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/community-comments/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            post: postId,
            content: text.trim()
          })
        });
      } catch {}
    }

    setSubmittingComment({ ...submittingComment, [postId]: false });
  };

  const filteredPosts = postList.filter((p) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Questions') return p.type === 'question';
    if (activeTab === 'Tips') return p.type === 'tip';
    return true;
  });

  return (
    <div className="space-y-8 font-sans antialiased">
      <PageHeader
        title="Urvixa Farmer Community Feed"
        subtitle="Share experience, ask questions, and learn from fellow growers across the region."
        action={
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAdd((s) => !s)}
            className="px-4 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" /> Ask Question
          </motion.button>
        }
      />

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['All', 'Questions', 'Tips'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab
                ? 'bg-[#15803D] text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            {tab === 'Questions' ? '❓ Questions' : tab === 'Tips' ? '💡 Tips & Guides' : '🌐 All Posts'}
          </button>
        ))}
      </div>

      {/* Create New Post Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Community Post</h3>
              <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-slate-700 p-1">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 select-none">
                <input
                  type="radio"
                  name="type"
                  value="question"
                  checked={newType === 'question'}
                  onChange={() => setNewType('question')}
                  className="accent-[#15803D]"
                />
                Question
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-200 select-none">
                <input
                  type="radio"
                  name="type"
                  value="tip"
                  checked={newType === 'tip'}
                  onChange={() => setNewType('tip')}
                  className="accent-[#15803D]"
                />
                Farming Tip / Guide
              </label>
            </div>

            <input
              placeholder="Post title or question headline..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
            <textarea
              placeholder="Describe details, crop type, symptoms or technique..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              rows={3}
              className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
            />
            <div className="flex gap-3 pt-1">
              <button
                onClick={addPost}
                className="px-5 py-2.5 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs sm:text-sm font-semibold cursor-pointer shadow-xs"
              >
                Publish Post
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">Loading community feed...</div>
      ) : filteredPosts.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No community posts yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">Be the first grower to post a question or share valuable farming insights with the community!</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 rounded-xl bg-[#15803D] text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-xs mt-2"
          >
            <Plus className="w-4 h-4" /> Ask First Question
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((p) => {
            const hasLiked = likedPostIds.includes(p.id);
            return (
              <div
                key={p.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 shadow-xs space-y-4"
              >
                {/* Author & Badge Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#15803D] font-bold text-sm flex items-center justify-center border border-emerald-500/20">
                      {p.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{p.author}</h4>
                      <p className="text-xs text-slate-500">Verified Urvixa Grower</p>
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-0.5 text-[11px] font-semibold uppercase ${
                      p.type === 'question'
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                        : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    {p.type}
                  </span>
                </div>

                {/* Content Title & Body */}
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{p.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 mt-1.5 leading-relaxed">{p.content}</p>
                </div>

                {/* Action Counts (1-Like-Per-User Enforced) */}
                <div className="flex items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                  <button
                    type="button"
                    onClick={() => toggleLike(p.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                      hasLiked
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-[#15803D] font-bold border border-emerald-200 dark:border-emerald-800'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                    title={hasLiked ? 'Click to unlike' : 'Click to like'}
                  >
                    <ThumbsUp className={`h-4 w-4 ${hasLiked ? 'fill-[#15803D] text-[#15803D]' : 'text-slate-400'}`} />
                    <span>{p.likes} {p.likes === 1 ? 'Like' : 'Likes'}</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span>{p.comments ? p.comments.length : 0} Comments</span>
                  </div>
                </div>

                {/* Comment Thread */}
                <div className="space-y-2 pt-1">
                  {p.comments && p.comments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {p.comments.map((c, idx) => (
                        <div
                          key={c.id || idx}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-xs"
                        >
                          <span className="font-bold text-slate-900 dark:text-white mr-1.5">
                            {c.author || 'Verified Grower'}:
                          </span>
                          <span className="text-slate-700 dark:text-slate-300 font-normal">{c.content}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Fully Functional Comment Input Box */}
                  <div className="flex gap-2">
                    <input
                      placeholder="Write a comment..."
                      value={commentInputs[p.id] || ''}
                      onChange={(e) => setCommentInputs({ ...commentInputs, [p.id]: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCommentSubmit(p.id);
                      }}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#15803D]/20 focus:border-[#15803D]"
                    />
                    <button
                      type="button"
                      disabled={submittingComment[p.id]}
                      onClick={() => handleCommentSubmit(p.id)}
                      className="px-4 h-10 rounded-xl bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Comment</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
