import { useEffect, useState } from 'react';
import { topicsApi } from '../api/topics';
import type { Topic } from '../types';
import { TopicCard } from '../components/topic/TopicCard';
import { SortSelector } from '../components/common/SortSelector';
import { Pagination } from '../components/common/Pagination';
import styles from './TopPage.module.scss';

export function TopPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [sort, setSort] = useState<'latest' | 'popular'>('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const limit = 10;

  const fetchTopics = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await topicsApi.list({ sort, page, limit });
      setTopics(res.data);
      setTotalPages(Math.ceil(res.meta.total / limit));
    } catch (err: any) {
      setError(err.message || 'お題の取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [sort, page]);

  const handleSortChange = (newSort: 'latest' | 'popular') => {
    setSort(newSort);
    setPage(1); // ソート変更時は1ページ目に戻す
  };

  return (
    <div>
      <div className={styles.header}>
        <h2>お題一覧</h2>
        <SortSelector currentSort={sort} onChange={handleSortChange} />
      </div>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>
          読み込み中...
        </div>
      ) : topics.length === 0 ? (
        <div className={styles.empty}>
          お題がありません
        </div>
      ) : (
        <div className={styles.list}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} />
          ))}
        </div>
      )}

      <Pagination 
        currentPage={page} 
        totalPages={totalPages} 
        onPageChange={setPage} 
      />
    </div>
  );
}
