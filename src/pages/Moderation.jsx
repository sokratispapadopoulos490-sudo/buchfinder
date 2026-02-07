import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

export default function Moderation() {
  const [user, setUser] = useState(null);
  const [reports, setReports] = useState([]);
  const [posts, setPosts] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const currentUser = await base44.auth.me();
      if (currentUser.role !== 'admin') {
        navigate('/');
        return;
      }
      setUser(currentUser);
      loadReports();
    } catch (error) {
      console.error('Auth error:', error);
      navigate('/');
    }
  };

  const loadReports = async () => {
    try {
      const allReports = await base44.entities.Report.list('-created_date');
      setReports(allReports);

      const postIds = [...new Set(allReports.map(r => r.post_id))];
      const postsData = {};
      
      await Promise.all(
        postIds.map(async (postId) => {
          try {
            const post = await base44.entities.CommunityPost.filter({ id: postId });
            if (post.length > 0) {
              postsData[postId] = post[0];
            }
          } catch (error) {
            console.error('Error loading post:', error);
          }
        })
      );
      
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId, reportId) => {
    if (!confirm('Post wirklich löschen?')) return;

    try {
      await base44.entities.CommunityPost.delete(postId);
      await base44.entities.Report.update(reportId, {
        status: 'resolved',
        resolved_by: user.email
      });
      await loadReports();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const handleResolve = async (reportId) => {
    try {
      await base44.entities.Report.update(reportId, {
        status: 'resolved',
        resolved_by: user.email
      });
      await loadReports();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const reasonLabels = {
    spam: 'Spam oder Werbung',
    inappropriate: 'Unangemessener Inhalt',
    harassment: 'Belästigung',
    misinformation: 'Falschinformationen',
    other: 'Anderer Grund'
  };

  const filteredReports = reports.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 flex items-center justify-center">
        <div className="text-stone-500">Lädt...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-50 px-4 py-6 md:px-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/Community')}
            className="text-stone-500 hover:text-stone-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-light text-stone-800 flex items-center gap-2">
            <Shield className="w-6 h-6 text-amber-600" />
            Moderation
          </h1>
          <div className="w-5" />
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl border border-stone-200 p-1.5 mb-6 flex gap-1.5">
          <button
            onClick={() => setFilter('pending')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending'
                ? 'bg-red-600 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Offen ({reports.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'resolved'
                ? 'bg-green-600 text-white'
                : 'text-stone-600 hover:bg-stone-50'
            }`}
          >
            Bearbeitet ({reports.filter(r => r.status === 'resolved').length})
          </button>
        </div>

        {/* Reports */}
        {filteredReports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <AlertTriangle className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <p className="text-stone-500">Keine Meldungen</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => {
              const post = posts[report.post_id];
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-stone-800">{reasonLabels[report.reason]}</p>
                          <p className="text-xs text-stone-500">
                            Gemeldet von {report.created_by} • {formatDistanceToNow(new Date(report.created_date), { addSuffix: true, locale: de })}
                          </p>
                        </div>
                      </div>
                      {report.status === 'resolved' && (
                        <span className="flex items-center gap-1 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Bearbeitet
                        </span>
                      )}
                    </div>

                    {report.description && (
                      <div className="mb-4 p-3 bg-stone-50 rounded-lg">
                        <p className="text-sm text-stone-600">{report.description}</p>
                      </div>
                    )}

                    {/* Post Preview */}
                    {post ? (
                      <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-white text-sm">
                            {post.created_by?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium text-stone-800">
                            {post.created_by?.split('@')[0]}
                          </span>
                        </div>
                        <h4 className="font-medium text-stone-800 mb-1">{post.title}</h4>
                        <p className="text-sm text-stone-600 line-clamp-2">{post.content}</p>
                      </div>
                    ) : (
                      <div className="border border-stone-200 rounded-lg p-4 bg-stone-50">
                        <p className="text-sm text-stone-500">Post wurde bereits gelöscht</p>
                      </div>
                    )}

                    {report.status === 'pending' && post && (
                      <div className="flex gap-3 mt-4">
                        <Button
                          onClick={() => handleResolve(report.id)}
                          variant="outline"
                          className="flex-1"
                        >
                          Als bearbeitet markieren
                        </Button>
                        <Button
                          onClick={() => handleDeletePost(post.id, report.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Post löschen
                        </Button>
                      </div>
                    )}

                    {report.resolved_by && (
                      <p className="text-xs text-stone-500 mt-3">
                        Bearbeitet von {report.resolved_by}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}