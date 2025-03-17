import axios from 'axios';

const API_URL = "http://localhost:8080/api"



const api = axios.create({
    baseURL: API_URL,
    withCredentials: true // Обязательно указываем с учетом кросс-доменных запросов
});

// Перехватчик для обработки ошибок
api.interceptors.response.use(
    response => response,
    async error => {
      // Если ошибка 401 (неавторизован), то пытаемся обновить токен
      if (error.response && error.response.status === 401) {
        try {
          // Получаем refreshToken из куков
          const refreshToken = getCookie('refreshToken');
          
          if (refreshToken) {
            const response = await api.post('/auth/refresh', {}, { withCredentials: true });

            // Обновляем токены в куках
            const { accessToken, refreshToken: newRefreshToken } = response.data;
            setCookie('accessToken', accessToken);
            setCookie('refreshToken', newRefreshToken);

            // Повторяем исходный запрос с новыми токенами (которые будут извлечены из куков)
            return api(error.config); // Перезапуск запроса
          }
        } catch (e) {
          // Если не удается обновить токены, выводим ошибку
          console.error('Ошибка обновления токена', e);
        }
      }
      // В случае других ошибок — просто передаем их дальше
      return Promise.reject(error);
    }
);

// Функция для получения cookie по имени
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Функция для установки cookie
function setCookie(name, value) {
  document.cookie = `${name}=${value}; path=/; SameSite=None; Secure=false`;
}

export default api;
