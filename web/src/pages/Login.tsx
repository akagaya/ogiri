import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { authApi } from '../api/auth';
import styles from './Login.module.scss';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function Login() {
  useDocumentTitle('ログイン');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { checkAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await authApi.login({ username, password });
      await checkAuth(); // ログイン後にユーザー情報を再取得
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'ログインに失敗しました');
    }
  };

  return (
    <div className={styles.container}>
      <div className="card">
        <h2 className={styles.title}>ログイン</h2>
        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>ユーザー名</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label>パスワード</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            ログイン
          </button>
        </form>
        <p className={styles.footer}>
          アカウントをお持ちでない場合は <Link to="/register">新規登録</Link>
        </p>
      </div>
    </div>
  );
}
