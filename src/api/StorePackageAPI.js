import axiosJWT from "./ConfigAxiosInterceptor";
const URL_STOREPACKAGE = `https://swp-be.onrender.com/mamababy/store_package`;

export const allStorePackageApi = (params) => {
    return axiosJWT.get(URL_STOREPACKAGE, {
        params: params,
    });
};