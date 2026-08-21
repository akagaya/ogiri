import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { usersApi } from '../api/users';
import type { User, Topic, Answer, Comment } from '../types';
import { TopicCard } from '../components/topic/TopicCard';
import { AnswerCard } from '../components/answer/AnswerCard';
import { UserCommentCard } from '../components/comment/UserCommentCard';
import { Pagination } from '../components/common/Pagination';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './UserProfile.module.scss';

export function UserProfile() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  
  const [activeTab, setActiveTab] = useState<'topics' | 'answers' | 'comments'>('topics');
  
  // Topics state
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicPage, setTopicPage] = useState(1);
  const [topicTotalPages, setTopicTotalPages] = useState(1);
  
  // Answers state
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answerPage, setAnswerPage] = useState(1);
  const [answerTotalPages, setAnswerTotalPages] = useState(1);

  // Comments state
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const limit = 10;

  useDocumentTitle(user?.display_name ? `${user.display_name}のプロフィール` : 'プロフィール');

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const userData = await usersApi.get(id);
        setUser(userData);
      } catch (err: any) {
        setError(err.message || 'ユーザー情報の取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    const fetchTabContent = async () => {
      if (!id) return;
      try {
        if (activeTab === 'topics') {
          const res = await usersApi.getTopics(id, { page: topicPage, limit });
          setTopics(res.data);
          setTopicTotalPages(Math.ceil(res.meta.total / limit));
        } else if (activeTab === 'answers') {
          const res = await usersApi.getAnswers(id, { page: answerPage, limit });
          setAnswers(res.data);
          setAnswerTotalPages(Math.ceil(res.meta.total / limit));
        } else if (activeTab === 'comments') {
          const res = await usersApi.getComments(id, { page: commentPage, limit });
          setComments(res.data);
          setCommentTotalPages(Math.ceil(res.meta.total / limit));
        }
      } catch (err: any) {
        console.error(err);
      }
    };
    fetchTabContent();
  }, [id, activeTab, topicPage, answerPage, commentPage]);

  if (loading && !user) return <div className={styles.loading}>読み込み中...</div>;
  if (error || !user) return <div className={styles.error}>{error || 'ユーザーが見つかりません'}</div>;

  const joinDate = new Date(user.created_at).toLocaleDateString('ja-JP');

  return (
    <div className={styles.container}>
      <div className={`card ${styles.profileCard}`}>
        <div className={styles.avatar}>
          {user.display_name.charAt(0).toUpperCase()}
        </div>
        <h2 className={styles.name}>{user.display_name}</h2>
        <div className={styles.username}>@{user.username}</div>
        <div className={styles.joinDate}>
          📅 {joinDate} から大喜利ひろばを利用しています
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('topics')}
          className={`${styles.tab} ${activeTab === 'topics' ? styles.active : ''}`}
        >
          お題
        </button>
        <button
          onClick={() => setActiveTab('answers')}
          className={`${styles.tab} ${activeTab === 'answers' ? styles.active : ''}`}
        >
          回答
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          className={`${styles.tab} ${activeTab === 'comments' ? styles.active : ''}`}
        >
          コメント
        </button>
      </div>

      <div className={styles.listContainer}>
        {activeTab === 'topics' && (
          <div>
            {topics.length === 0 ? (
              <div className={styles.empty}>お題はまだありません</div>
            ) : (
              <div className={styles.list}>
                {topics.map(t => <TopicCard key={t.id} topic={t} />)}
              </div>
            )}
            <Pagination currentPage={topicPage} totalPages={topicTotalPages} onPageChange={setTopicPage} />
          </div>
        )}
        
        {activeTab === 'answers' && (
          <div>
            {answers.length === 0 ? (
              <div className={styles.empty}>回答はまだありません</div>
            ) : (
              <div className={styles.list}>
                {answers.map(a => <AnswerCard key={a.id} answer={a} />)}
              </div>
            )}
            <Pagination currentPage={answerPage} totalPages={answerTotalPages} onPageChange={setAnswerPage} />
          </div>
        )}

        {activeTab === 'comments' && (
          <div>
            {comments.length === 0 ? (
              <div className={styles.empty}>コメントはまだありません</div>
            ) : (
              <div className={styles.list}>
                {comments.map(c => <UserCommentCard key={c.id} comment={c} />)}
              </div>
            )}
            <Pagination currentPage={commentPage} totalPages={commentTotalPages} onPageChange={setCommentPage} />
          </div>
        )}
      </div>
    </div>
  );
}
