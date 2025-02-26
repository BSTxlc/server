import db from '../lib/db';
import express from 'express';
import cors from 'cors';
import winston from "winston";
import fs from 'fs';
import path from 'path';
import { log } from 'console';
// import formidable from 'formidable';这个库是处理表单提交的
// typeorm ts logger
// 需要修改的内容
const port = 17515;// http服务的端口

const app = express();

app.use(cors());
app.use(express.json());

const { format, transports } = winston;
const logFormat = format.printf(({ level, message, timestamp, ...meta }) => {
  const metaString = meta[Symbol.for('splat')] ? (',' + JSON.stringify(meta[Symbol.for('splat')][0])) : '';
  return `${timestamp} ${level}: ${message} \x1b[36m${metaString}\x1b[0m`;
});

// 创建一个日志记录器
const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // 添加时间戳
    logFormat // 使用自定义日志格式
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(), // 使日志级别具有颜色
        logFormat // 使用自定义日志格式
      ),
    }),
  ],
});



const staticPath = path.join(__dirname, '../../img');

app.use(express.static(staticPath, { index: false }));

app.listen(port, () => {
  logger.info(`Example app listening on port ${port}`);
});

app.get('/test', async (req, res) => { res.send('ok'); });

app.get('/test2', async (req, res) => {
  const data = await db.getData('User', { id: 1 });
  //res.sen('ok'); 
  res.send(data);
});

