import { useState } from 'react';
import axios from './index'; // 引入你手写的 axios

function App() {
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // // 测试 GET 请求（调用本地 Express 接口）
  // const handleGet = async () => {
  //   try {
  //     const res = await axios({
  //       url: 'http://localhost:3001/api/test-get',
  //       method: 'get'
  //     });
  //     setResponse(res);
  //     setError(null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'GET 请求失败');
  //     setResponse(null);
  //   }
  // };

  // // 测试 POST 请求
  // const handlePost = async () => {
  //   try {
  //     const res = await axios({
  //       url: 'http://localhost:3001/api/test-post',
  //       method: 'post',
  //       data: { username: 'test', password: '123' }
  //     });
  //     setResponse(res);
  //     setError(null);
  //   } catch (err) {
  //     setError(err instanceof Error ? err.message : 'POST 请求失败');
  //     setResponse(null);
  //   }
  // };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Axios 测试（Express 后端）</h1>
      {/* <button onClick={handleGet} style={{ marginRight: '10px' }}>测试 GET</button>
      <button onClick={handlePost}>测试 POST</button> */}

      {response && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>响应结果：</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          <h3>错误：</h3>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default App;