import axiosJWT from "./ConfigAxiosInterceptor";

const URL_COMMENT = `https://swp-be.onrender.com/mamababy/comments`;

export const allCommentApi = (params) => {
  return axiosJWT.get(URL_COMMENT, {
    params: params,
  });
};

export const commentByProductIdApi = (productId) => {
  return axiosJWT.get(
    `https://swp-be.onrender.com/mamababy/comments/product/${productId}`
  );
};

export const commentByProductIdWithStoreApi = (productId) => {
  return axiosJWT.get(
    `https://swp-be.onrender.com/mamababy/comments/store/product/${productId}`
  );
};

export const commentByUserIdApi = (userId) => {
  return axiosJWT.get(`https://swp-be.onrender.com/mamababy/comments/user/${userId}`);
};

export const createCommentApi = (product_id, rating, comment, user_id) => {
  return axiosJWT.post(URL_COMMENT, {
    product_id: product_id,
    rating: rating,
    comment: comment,
    user_id: user_id,
  });
};

export const updateCommentApi = (id, rating, comment, user_id) => {
  return axiosJWT.put(`${URL_COMMENT}/${id}`, {
    rating: rating,
    comment: comment,
    user_id: user_id,
  });
};

export const updateCommentStatusApi = (id, status) => {
  return axiosJWT.put(`${URL_COMMENT}/status/${id}`, {
    status: status,
  });
};
