import { useNavigate } from 'react-router';
import type { Answer } from '../../types';
import styles from './AnswerCard.module.scss';

interface AnswerCardProps {
  answer: Answer;
}

export function AnswerCard({ answer }: AnswerCardProps) {
  const navigate = useNavigate();
  const dateStr = new Date(answer.created_at).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div 
      className={`card interactive-card ${styles.card}`}
      onClick={() => navigate(`/answers/${answer.id}`)}
    >
      <p className={styles.body}>
        {answer.body}
      </p>
      
      <div className={styles.meta}>
        <div className={styles.leftGroup}>
          <span 
            onClick={(e) => { e.stopPropagation(); navigate(`/users/${answer.user.id}`); }}
            className={styles.userLink}
          >
            👤 {answer.user.display_name}
          </span>
          <span>🕒 {dateStr}</span>
        </div>
        
        <div className={styles.rightGroup}>
          <span>💬 コメント {answer.comment_count}</span>
          {answer.avg_score !== null ? (
            <span className={styles.score}>★ {Number(answer.avg_score).toFixed(1)}</span>
          ) : (
            <span>★ --</span>
          )}
        </div>
      </div>
    </div>
  );
}
