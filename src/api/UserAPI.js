import axiosJWT from "./ConfigAxiosInterceptor";

const URL_USER_FOR_AD = `https://swp-be.onrender.com/mamababy/users/admin/all`;
const URL_USER = `https://swp-be.onrender.com/mamababy/users/all`;
const URL_LOGIN = `https://swp-be.onrender.com/mamababy/users/login`;
const URL_SIGNUP = `https://swp-be.onrender.com/mamababy/users/register`;
const URL_USERDETAIL = `https://swp-be.onrender.com/mamababy/users/details`;
const URL_ACTIVE = `https://swp-be.onrender.com/mamababy/users/admin`;
const URL_ACTIVESTORE = `https://swp-be.onrender.com/mamababy/users/admin`;
// const URL_LOGOUT = `https://swp-be.onrender.com/mamababy/users/logout`;
const URL_ACCOUNT = `https://swp-be.onrender.com/mamababy/users`;
const URL_UPDATE = `https://swp-be.onrender.com/mamababy/users`;

export const allUserForAdApi = (params) => {
  return axiosJWT.get(URL_USER_FOR_AD, {
    params: params,
  });
};

export const allUserApi = (params) => {
  return axiosJWT.get(URL_USER, {
    params: params,
  });
};

export const getUserByIdApi = (userId) => {
  return axiosJWT.get(`${URL_ACCOUNT}/${userId}`);
};

export const loginApi = (username, password) => {
  return axiosJWT.post(URL_LOGIN, {
    username: username,
    password: password,
  });
};

export const signupApi = (
  username,
  password,
  retype,
  fullname,
  address,
  phone
) => {
  return axiosJWT.post(URL_SIGNUP, {
    username: username,
    password: password,
    retype_password: retype,
    fullName: fullname,
    address: address,
    phoneNumber: phone,
  });
};

export const profileUserApi = () => {
  return axiosJWT.get(URL_USERDETAIL);
};
export const updateAccountApi = (
  username,
  fullName,
  address,
  phoneNumber,
  status,
  roleId
) => {
  return axiosJWT.put(URL_ACTIVE, {
    username: username,
    fullName: fullName,
    address: address,
    phoneNumber: phoneNumber,
    status: status,
    roleId: roleId,
  });
};
export const updateRollUserApi = (
  username,
  fullName,
  address,
  phoneNumber,
  status,
  newRoleId
) => {
  return axiosJWT.put(URL_ACTIVESTORE, {
    username: username,
    fullName: fullName,
    address: address,
    phoneNumber: phoneNumber,
    status: status,
    roleId: newRoleId,
  });
};

// export const logoutApi = (token) => {
//   return axiosJWT.post(URL_LOGOUT, null, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };

export const userByYearApi = async (selectedAccountYear) => {
  try {
    const response = await axiosJWT.get(
      `${URL_ACCOUNT}/findByYear?year=${selectedAccountYear}`
    );
    return response;
  } catch (error) {
    throw new Error(`Error fetching orders: ${error.message}`);
  }
};

export const updateAccount = (
  username,
  fullName,
  password,
  address,
  phoneNumber
) => {
  return axiosJWT.put(URL_UPDATE, {
    username: username,
    fullName: fullName,
    password: password,
    address: address,
    phoneNumber: phoneNumber,
    status: "",
    roleId: 0,
  });
};
