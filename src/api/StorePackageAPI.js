import axiosJWT from "./ConfigAxiosInterceptor";
const URL_STOREPACKAGE = `https://swp-be.onrender.com/mamababy/store_package`;

export const allStorePackageApi = (params) => {
  return axiosJWT.get(URL_STOREPACKAGE, {
    params: params,
  });
};

export const createStorePackageApi = (packageId, storeId, price) => {
  return axiosJWT.post(URL_STOREPACKAGE, {
    package_id: packageId,
    store_id: storeId,
    price: price,
  });
};
