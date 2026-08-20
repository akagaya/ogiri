import { useNavigate } from 'react-router';
import type { Comment } from '../../types';
import styles from './UserCommentCard.module.scss';

interface UserCommentCardProps {
  comment: Comment;
}

export function UserCommentCard({ comment }: UserCommentCardProps) {
  const navigate = useNavigate();
  const dateStr = new Date(comment.created_at).toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });

  return (
    <div 
      className={`card interactive-card ${styles.card}`}
      onClick={() => navigate(`/answers/${comment.answer_id}`)}
    >
      <div className={styles.contextBox}>
        <div className={styles.topicInfo}>
          お題: {comment.answer?.topic.body}
        </div>
        <div className={styles.answerInfo}>
          回答: {comment.answer?.body}
        </div>
      </div>
      
      <p className={styles.body}>
        {comment.body}
      </p>
      
      <div className={styles.meta}>
        <span>🕒 {dateStr}</span>
      </div>
    </div>
  );
}
