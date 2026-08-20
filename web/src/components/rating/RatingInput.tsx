import { useState, useEffect } from 'react';
import { ratingsApi } from '../../api/ratings';
import { useAuth } from '../../hooks/useAuth';
import styles from './RatingInput.module.scss';

interface RatingInputProps {
  answerId: string;
  initialScore?: number;
  savedScore?: number | null;
  onRatingSubmit: () => void;
}

export function RatingInput({ answerId, initialScore = 5, savedScore, onRatingSubmit }: RatingInputProps) {
  const [score, setScore] = useState<number>(initialScore);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    setScore(initialScore);
  }, [initialScore]);

  const handleSubmit = async () => {
    if (!user) {
      setError('評価するにはログインが必要です');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      await ratingsApi.upsert(answerId, { score });
      setSuccess('評価を保存しました！');
      onRatingSubmit();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || '評価の送信に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`card ${styles.container}`}>
      <div className={styles.header}>
        <h4>この回答を評価する</h4>
        {savedScore != null && (
          <span className={styles.savedScore}>
            登録済みの評価: {savedScore}
          </span>
        )}
      </div>
      
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}
      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      <div className={styles.inputGroup}>
        <span className={styles.scoreDisplay}>
          {score}
        </span>
        <input 
          type="range" 
          min="0" 
          max="10" 
          value={score} 
          onChange={(e) => setScore(Number(e.target.value))} 
          className={styles.rangeInput}
          disabled={loading || !user}
        />
        <button 
          onClick={handleSubmit} 
          className={`btn-primary ${styles.submitBtn}`} 
          disabled={loading || !user}
        >
          {loading ? '送信中...' : '評価'}
        </button>
      </div>
    </div>
  );
}
