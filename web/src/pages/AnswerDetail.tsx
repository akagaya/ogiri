import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { answersApi } from '../api/answers';
import { topicsApi } from '../api/topics';
import { useAuth } from '../hooks/useAuth';
import type { Answer, Topic } from '../types';
import { RatingInput } from '../components/rating/RatingInput';
import { CommentList } from '../components/comment/CommentList';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import styles from './AnswerDetail.module.scss';

export function AnswerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const ansData = await answersApi.get(id);
      setAnswer(ansData);
      
      // 元のお題情報も取得
      if (ansData.topic_id) {
        const topData = await topicsApi.get(ansData.topic_id);
        setTopic(topData);
      }
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleDeleteAnswer = async () => {
    if (!id || !answer) return;
    try {
      await answersApi.delete(id);
      // 削除後は元のお題詳細へ戻る
      navigate(`/topics/${answer.topic_id}`);
    } catch (err: any) {
      alert(err.message || '回答の削除に失敗しました');
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading && !answer) return <div className={styles.loading}>読み込み中...</div>;
  if (error || !answer) return <div className={styles.error}>{error || '回答が見つかりません'}</div>;

  const isAuthor = user?.id === answer.user.id;
  const dateStr = new Date(answer.created_at).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/" className={styles.link}>お題一覧</Link>
        {' > '}
        {topic && (
          <>
            <Link to={`/topics/${topic.id}`} className={styles.link}>
              {topic.body.length > 20 ? topic.body.substring(0, 20) + '...' : topic.body}
            </Link>
            {' > '}
          </>
        )}
        <span className={styles.current}>回答詳細</span>
      </div>

      {topic && (
        <div className={`card ${styles.topicCard}`}>
          <div className={styles.label}>元のお題</div>
          <h3 className={styles.title}>
            <Link to={`/topics/${topic.id}`}>{topic.body}</Link>
          </h3>
        </div>
      )}

      <div className={`card ${styles.answerCard}`}>
        <p className={styles.body}>{answer.body}</p>
        
        <div className={styles.meta}>
          <div className={styles.info}>
            <Link to={`/users/${answer.user.id}`} className={styles.userLink}>
              👤 {answer.user.display_name}
            </Link>
            <span className={styles.date}>🕒 {dateStr}</span>
          </div>
          {isAuthor && (
            <button 
              onClick={() => setIsDeleteDialogOpen(true)}
              className={styles.deleteBtn}
            >
              削除
            </button>
          )}
        </div>
      </div>

      <RatingInput 
        answerId={answer.id} 
        onRatingSubmit={fetchData} 
        initialScore={answer.my_rating ?? 5} 
        savedScore={answer.my_rating}
      />

      {/* コメント一覧と投稿フォーム */}
      <CommentList answerId={answer.id} />

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        title="回答の削除"
        message="この回答を削除してもよろしいですか？"
        onConfirm={handleDeleteAnswer}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
