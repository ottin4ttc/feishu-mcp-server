import axios, { type AxiosInstance } from 'axios';

const defaultHttpInstance: AxiosInstance = axios.create();

defaultHttpInstance.interceptors.request.use(
  (req) => {
    if (req.headers) {
      req.headers['User-Agent'] = 'feishu-mcp-server/0.0.1';
    }
    return req;
  },
  undefined,
  { synchronous: true },
);

defaultHttpInstance.interceptors.response.use((resp) => resp.data);

export { type AxiosRequestConfig, AxiosError } from 'axios';

export default defaultHttpInstance;
