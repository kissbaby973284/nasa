# ʹ�� Node.js 14 ����
FROM node:14

# ���ù���Ŀ¼
WORKDIR /app

# �������ļ����Ƶ�������
COPY . .

# ��װ����
RUN npm install

# ��¶�˿ڣ�Node.js Ӧ�ó���
EXPOSE 3000

# ����Ӧ��
CMD ["node", "index.js"]