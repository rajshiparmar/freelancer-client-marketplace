import FreelancerInterceptor from "../Interceptor/FreelancerInterceptor";

export const submitBid = async (payload) => {
  return (await FreelancerInterceptor.post("/freelancer/bids", payload)).data;
};

export const getFreelancerBids = async (projectId) => {
  return (await FreelancerInterceptor.get(`/freelancer/bids/${projectId}`)).data;
};

export const updateFreelancerSkill = async (payload) => {
  return await FreelancerInterceptor.post("/freelancer/skills", payload);
};

export const getFreelancerProfile = async () => {
  return (await FreelancerInterceptor.get("/freelancer/getFreelancer")).data;
};

export const getMyBids = async () => {
  return (await FreelancerInterceptor.get("/freelancer/my-bids")).data;
};

export const cancelBidById = async (bidId) => {
  return await FreelancerInterceptor.delete(`/freelancer/bids/${bidId}`);
};

export const updateBidById = async (payload) => {
  return await FreelancerInterceptor.put("/freelancer/bids/update", payload);
};

