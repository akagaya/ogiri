import { useState } from 'react';
import { useNavigate } from 'react-router';
import { topicsApi } from '../api/topics';
import { useAuth } from '../hooks/useAuth';
import styles from './NewTopic.module.scss';

export function NewTopic() {
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const maxLength = 500;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;
    
    try {
      setLoading(true);
      setError('');
      const newTopic = await topicsApi.create({ body });
      navigate(`/topics/${newTopic.id}`);
    } catch (err: any) {
      setError(err.message || 'お題の投稿に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loginPrompt}>
        <p>お題を投稿するにはログインが必要です。</p>
        <button onClick={() => navigate('/login')} className={`btn-primary ${styles.loginBtn}`}>
          ログイン画面へ
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="card">
        <h2 className={styles.title}>お題を出す</h2>
        
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputWrapper}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="面白いお題を考えてみましょう..."
              rows={5}
              maxLength={maxLength}
              required
              className={styles.textarea}
            />
            <div className={`${styles.charCount} ${body.length >= maxLength ? styles.limitExceeded : ''}`}>
              {body.length} / {maxLength}
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`btn-primary ${styles.submitBtn}`} 
            disabled={loading || !body.trim()} 
          >
            {loading ? '送信中...' : 'お題を投稿する'}
          </button>
        </form>
      </div>
    </div>
  );
}
