import { useEffect, useState } from 'react';
import LoginModal from './LoginModal';

export default function AdminGuard({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_logged_in');
    if (token === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleSuccess = () => {
    localStorage.setItem('admin_logged_in', 'true');
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return <LoginModal onSuccess={handleSuccess} />;
  }

  return children;
}
