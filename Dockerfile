# 使用 Node.js 14 镜像
FROM node:14

# 设置工作目录
WORKDIR /app

# 将本地文件复制到容器中
COPY . .

# 安装依赖
RUN npm install

# 暴露端口（Node.js 应用程序）
EXPOSE 3000

# 启动应用
CMD ["node", "index.js"]