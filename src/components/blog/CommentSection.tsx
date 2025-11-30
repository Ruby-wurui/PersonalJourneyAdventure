'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        role: string;
    };
}

interface CommentSectionProps {
    postId: number;
    onLoginClick: () => void;
}

export default function CommentSection({ postId, onLoginClick }: CommentSectionProps) {
    const { isAuthenticated, user, token } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (postId) {
            fetchComments();
        }
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/posts/${postId}/comments`);
            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setComments(result.data);
                }
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        setError('');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    setComments([result.data, ...comments]);
                    setNewComment('');
                } else {
                    setError(result.error || 'Failed to post comment');
                }
            } else {
                setError('Failed to post comment');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
            setError('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (commentId: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/blog/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setComments(comments.filter(c => c.id !== commentId));
            } else {
                alert('Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    if (isLoading) {
        return <div className="text-center py-4 text-gray-400">Loading comments...</div>;
    }

    return (
        <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Comments ({comments.length})</h3>

            {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <div className="mb-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none h-24"
                            required
                        />
                    </div>
                    {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className={`px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ${(isSubmitting || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-white/5 rounded-lg p-6 text-center mb-8 border border-white/10">
                    <p className="text-gray-300 mb-4">Please log in to join the discussion.</p>
                    <button
                        onClick={onLoginClick}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        Log In
                    </button>
                </div>
            )}

            <div className="space-y-6">
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className="bg-white/5 rounded-lg p-6 border border-white/10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        {comment.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-white flex items-center gap-2">
                                            {comment.user.name}
                                            {comment.user.role === 'admin' && (
                                                <span className="text-xs bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded">Admin</span>
                                            )}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                {(Number(user?.id) === comment.user.id || user?.role === 'admin') && (
                                    <button
                                        onClick={() => handleDelete(comment.id)}
                                        className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                )}
            </div>
        </div>
    );
}
