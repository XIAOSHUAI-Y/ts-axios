// server/server.ts
import express from 'express';
import cors from 'cors'; // 解决跨域问题（需额外安装：pnpm add cors @types/cors）

const app = express();
const PORT = 3001;

// 中间件：解析 JSON 请求体
app.use(express.json());
// 中间件：允许跨域（前端通常运行在 5173 端口，后端在 3001 端口）
app.use(cors({
  origin: (origin, callback) => {
    // 允许本地开发的任何端口（生产环境需限制）
    if (!origin || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(new Error('不允许的跨域请求'));
    }
  }
}));

// 测试 GET 接口
app.get('/api/test-get', (req, res) => {
  res.json({
    message: 'GET 请求成功',
    data: { id: 1, name: '测试数据' },
    timestamp: new Date().toISOString()
  });
});

// 测试 POST 接口
app.post('/api/test-post', (req, res) => {
  const requestData = req.body; // 获取前端发送的 JSON 数据
  res.json({
    message: 'POST 请求成功',
    receivedData: requestData,
    timestamp: new Date().toISOString()
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Express 服务器运行在 http://localhost:${PORT}`);
});