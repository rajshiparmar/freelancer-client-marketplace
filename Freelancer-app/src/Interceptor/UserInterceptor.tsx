import axios from "axios";

const UserInterceptor = axios.create({
  baseURL: "http://localhost:8080",
});

// UserInterceptor.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     const publicUrls = ["/auth/login", "/auth/register"];

//     if (!publicUrls.includes(config.url) && token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

UserInterceptor.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const publicUrls = ["/auth/login", "/auth/register"];

    if (!publicUrls.some(url => config.url.includes(url)) && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


UserInterceptor.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);

export default UserInterceptor;
