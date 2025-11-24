import ClientInterceptor from "../Interceptor/ClientInterceptor";

export const getAllProjects = async () => {
  return (await ClientInterceptor.get("/projects")).data;
};

export const AddProject = async (payload) => {
  return (await ClientInterceptor.post("/projects", payload)).data;
};

export const getProjectById = async (projectId) => {
  return (await ClientInterceptor.get(`/projects/${projectId}`)).data;
};

export const getAssignedProjects = async () => {
  return (await ClientInterceptor.get("/projects/assigned")).data;
};

export const getMatchesById = async (projectId) => {
  return (await ClientInterceptor.get(`/projects/${projectId}/matches`)).data;
};

export const getClientBids = async (projectId) => {
  return (await ClientInterceptor.get(`/projects/${projectId}/bids`)).data;
};

export const setBidStatus = async (projectId, freelancerId, status) => {
  return await ClientInterceptor.post(
    `/projects/${projectId}/bids/${freelancerId}/status?status=${status}`
  );
};

export const getMyProjects = async () => {
  return (await ClientInterceptor.get("/projects/my")).data;
};

