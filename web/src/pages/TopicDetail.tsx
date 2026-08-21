import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { topicsApi } from '../api/topics';
import { answersApi } from '../api/answers';
import { useAuth } from '../hooks/useAuth';
import type { Topic, Answer } from '../types';
import { AnswerCard } from '../components/answer/AnswerCard';
import { SortSelector } from '../components/common/SortSelector';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './TopicDetail.module.scss';

export function TopicDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sort, setSort] = useState<'latest' | 'top_rated'>('latest');
  const [newAnswer, setNewAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useDocumentTitle(topic?.body ?? 'お題詳細');

  const fetchTopicAndAnswers = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [topicData, answersRes] = await Promise.all([
        topicsApi.get(id),
        answersApi.listByTopic(id, { sort })
      ]);
      setTopic(topicData);
      setAnswers(answersRes.data);
    } catch (err: any) {
      setError(err.message || 'データ取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopicAndAnswers();
  }, [id, sort]);

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newAnswer.trim()) return;
    try {
      setSubmitLoading(true);
      await answersApi.create(id, { body: newAnswer });
      setNewAnswer('');
      await fetchTopicAndAnswers();
    } catch (err: any) {
      alert(err.message || '回答の投稿に失敗しました');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteTopic = async () => {
    if (!id) return;
    try {
      await topicsApi.delete(id);
      navigate('/');
    } catch (err: any) {
      alert(err.message || 'お題の削除に失敗しました');
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) return <div className={styles.loading}>読み込み中...</div>;
  if (error || !topic) return <div className={styles.error}>{error || 'お題が見つかりません'}</div>;

  const isAuthor = user?.id === topic.user.id;
  const dateStr = new Date(topic.created_at).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div>
      <div className={`card ${styles.topicHeaderCard}`}>
        <h2 className={styles.title}>{topic.body}</h2>
        <div className={styles.meta}>
          <div className={styles.info}>
            <Link to={`/users/${topic.user.id}`} className={styles.userLink}>
              👤 {topic.user.display_name}
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

      <div className={styles.answersHeader}>
        <h3>回答一覧 ({answers.length})</h3>
        <SortSelector 
          currentSort={sort} 
          onChange={(s) => setSort(s)} 
          options={[
            { value: 'latest', label: '新着順' },
            { value: 'top_rated', label: '高評価順' }
          ]} 
        />
      </div>

      <div className={styles.answersList}>
        {answers.length === 0 ? (
          <div className={styles.empty}>まだ回答がありません</div>
        ) : (
          answers.map(ans => <AnswerCard key={ans.id} answer={ans} />)
        )}
      </div>

      {user ? (
        <div className={`card ${styles.formCard}`}>
          <h3>回答を投稿する</h3>
          <form onSubmit={handleAnswerSubmit} className={styles.form}>
            <textarea 
              value={newAnswer} 
              onChange={e => setNewAnswer(e.target.value)} 
              rows={3} 
              placeholder="面白い回答を入力..." 
              required 
            />
            <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={submitLoading}>
              {submitLoading ? '送信中...' : '投稿する'}
            </button>
          </form>
        </div>
      ) : (
        <div className={styles.loginPrompt}>
          回答を投稿するにはログインが必要です。
        </div>
      )}

      <ConfirmDialog 
        isOpen={isDeleteDialogOpen}
        title="お題の削除"
        message="このお題を削除してもよろしいですか？（回答やコメントも閲覧できなくなります）"
        onConfirm={handleDeleteTopic}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
}
