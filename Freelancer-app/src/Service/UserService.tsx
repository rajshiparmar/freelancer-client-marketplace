import UserInterceptor from "../Interceptor/UserInterceptor";

const registerUser = async (user) => {
  try {
    const response = await UserInterceptor.post("/auth/register", user);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (user) => {
  try {
    const response = await UserInterceptor.post("/auth/login", user);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export {registerUser,loginUser};
