
import { useState, useEffect } from 'react';

export const useBeetoolToken = () => {
  const [beetoolToken, setBeetoolToken] = useState<string>('');
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  useEffect(() => {
    // Récupérer le token depuis le localStorage
    const storedToken = localStorage.getItem('beetool_token');
    if (storedToken) {
      setBeetoolToken(storedToken);
      setIsTokenValid(true);
    }
  }, []);

  const saveToken = (token: string) => {
    setBeetoolToken(token);
    setIsTokenValid(!!token);
    if (token) {
      localStorage.setItem('beetool_token', token);
    } else {
      localStorage.removeItem('beetool_token');
    }
  };

  const clearToken = () => {
    setBeetoolToken('');
    setIsTokenValid(false);
    localStorage.removeItem('beetool_token');
  };

  return {
    beetoolToken,
    isTokenValid,
    saveToken,
    clearToken
  };
};
