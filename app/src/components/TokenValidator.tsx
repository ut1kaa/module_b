import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number;
}

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;

  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000); // Текущее время в секундах
    return decodedToken.exp > currentTime; // Проверяем, что токен еще не истек
  } catch (error) {
    console.error("Invalid token", error);
    return false;
  }
};
