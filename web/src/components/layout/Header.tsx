import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../hooks/useAuth';
import styles from './Header.module.scss';

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`glass-panel ${styles.header}`}>
      <h1 className={styles.logo}>
        <Link to="/">大喜利ひろば</Link>
      </h1>

      <nav className={styles.nav}>
        {user ? (
          <>
            <Link to={`/users/${user.id}`} className={styles.userLink}>
              👤 {user.display_name}
            </Link>
            <Link to="/topics/new" className={`btn-primary ${styles.btnAction}`}>
              ＋ お題を出す
            </Link>
            <button onClick={handleLogout} className={styles.btnLogout}>
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={styles.loginLink}>ログイン</Link>
            <Link to="/register" className={`btn-primary ${styles.btnAction}`}>新規登録</Link>
          </>
        )}
      </nav>
    </header>
  );
}
