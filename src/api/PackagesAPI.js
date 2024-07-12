import axiosJWT from "./ConfigAxiosInterceptor";

const URL_PACKAGE = `https://swp-be.onrender.com/mamababy/package`;

export const allPackageApi = (params) => {
    return axiosJWT.get(URL_PACKAGE, {
      params: params,
    });
  };

  