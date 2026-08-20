import { useNavigate } from 'react-router';
import type { Topic } from '../../types';
import styles from './TopicCard.module.scss';

interface TopicCardProps {
  topic: Topic;
}

export function TopicCard({ topic }: TopicCardProps) {
  const navigate = useNavigate();
  const dateStr = new Date(topic.created_at).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div 
      className={`card interactive-card ${styles.card}`}
      onClick={() => navigate(`/topics/${topic.id}`)}
    >
      <h3 className={styles.title}>
        {topic.body}
      </h3>
      
      <div className={styles.meta}>
        <div className={styles.leftGroup}>
          <span 
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${topic.user.id}`); }}
            className={styles.userLink}
          >
            👤 {topic.user.display_name}
          </span>
          <span>🕒 {dateStr}</span>
        </div>
        
        <div className={styles.rightGroup}>
          <span>💬 回答 {topic.answer_count}</span>
          {topic.avg_score !== null && (
            <span className={styles.score}>★ {Number(topic.avg_score).toFixed(1)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
