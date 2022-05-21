import axios from "axios";
import { get, save } from "../storage/local.storage";
import notification from "../ui/notification";
import { BASE_URL } from "../../constants";

const HTTP_ERROR = {
  HTTP_401_CREDENTIAL_NOT_FOUND: 401,
  HTTP_400_BAD_REQUEST: 400,
  HTTP_404_NOT_FOUND: 404,
};

const END_POINT = {
  login: "login",
  refresh: "token-refresh",
};

const axiosInstance = axios.create();

// Add a request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    if (!config.url.match("auth")) {
      config.headers = {
        Authorization: "Bearer " + get("auth"),
      };
    }
    config.baseURL = BASE_URL;
    console.log("call http with token:", get("auth"));

    return config;
  },
  function (error) {
    handleError(error.response?.status);
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    const originalRequest = error.config;

    //  there is any previous get token request
    if (error.response?.status === 400 || error.response?.status === 404) {
      handleError(error.response?.status, error.message);

      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = get();
      // make new axios call to get new auth token
      return axiosInstance.post(END_POINT.refresh, refreshToken).then((res) => {
        if (res.status === 201) {
          save(res.data);

          axiosInstance.config.header = {
            Authorization: "Bearer " + get("auth"),
          };
          return axiosInstance(originalRequest);
        }
      });
    }

    handleError(error.response?.status, error.message);
    return Promise.reject(error);
  }
);

function handleError(code = 0, message) {
  switch (code) {
    case HTTP_ERROR.HTTP_401_CREDENTIAL_NOT_FOUND:
      message = "Unauthenticated, try login again";
      //navigate to login
      break;
    case HTTP_ERROR.HTTP_404_NOT_FOUND:
      message = "Not found";
      break;
    case HTTP_ERROR.HTTP_400_BAD_REQUEST:
      message = "Bad request, recheck information ";
      break;
    default:
      // if you want to use a default message instead of browser error message for unhandled error
      // message = "Unexpected error";
      break;
  }
  notification(message);
}

export { axiosInstance as axios };
