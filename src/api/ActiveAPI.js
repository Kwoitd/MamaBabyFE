import axiosJWT from "./ConfigAxiosInterceptor";

const URL_ACTIVE = `https://swp-be.onrender.com/mamababy/active`;

export const allActiveByUserApi = (userId) => {
  return axiosJWT.get(`${URL_ACTIVE}/${userId}`);
};
