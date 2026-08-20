import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { commentsApi } from '../../api/comments';
import type { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { Pagination } from '../common/Pagination';
import styles from './CommentList.module.scss';

interface CommentListProps {
  answerId: string;
}

export function CommentList({ answerId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  const limit = 10;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await commentsApi.listByAnswer(answerId, { page, limit });
      setComments(res.data);
      setTotalPages(Math.ceil(res.meta.total / limit));
    } catch (err: any) {
      setError(err.message || 'コメントの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [answerId, page]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;
    
    try {
      setSubmitLoading(true);
      await commentsApi.create(answerId, { body: newComment });
      setNewComment('');
      setPage(1);
      await fetchComments();
    } catch (err: any) {
      alert(err.message || 'コメントの投稿に失敗しました');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('コメントを削除しますか？')) return;
    try {
      await commentsApi.delete(answerId, commentId);
      await fetchComments();
    } catch (err: any) {
      alert(err.message || 'コメントの削除に失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        コメント ({comments.length > 0 ? comments.length : 0}件)
      </h3>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>読み込み中...</div>
      ) : (
        <div className={styles.list}>
          {comments.length === 0 ? (
            <div className={styles.empty}>コメントはありません</div>
          ) : (
            comments.map(c => {
              const isAuthor = user?.id === c.user.id;
              const dateStr = new Date(c.created_at).toLocaleString('ja-JP', {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              });
              
              return (
                <div key={c.id} className={styles.commentItem}>
                  <div className={styles.header}>
                    <Link to={`/users/${c.user.id}`} className={styles.userLink}>
                      👤 {c.user.display_name}
                    </Link>
                    <span className={styles.date}>{dateStr}</span>
                  </div>
                  <p className={styles.body}>{c.body}</p>
                  {isAuthor && (
                    <div className={styles.actions}>
                      <button 
                        onClick={() => handleDelete(c.id)}
                        className={styles.deleteBtn}
                      >
                        削除
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      <div className={`card ${styles.formContainer}`}>
        <h4>コメントを投稿する</h4>
        {user ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="コメントを入力..."
              rows={3}
              required
            />
            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={submitLoading || !newComment.trim()}>
              {submitLoading ? '送信中...' : '投稿'}
            </button>
          </form>
        ) : (
          <div className={styles.loginPrompt}>
            コメントを投稿するにはログインが必要です。
          </div>
        )}
      </div>
    </div>
  );
}
