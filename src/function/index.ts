import db from '../lib/db';
import express from 'express';
import cors from 'cors';
import winston from "winston";
import fs from 'fs';
import path from 'path';
import { log } from 'console';
import User from '../lib/db/entities/user';
import { get } from 'http';
// import formidable from 'formidable';这个库是处理表单提交的
// typeorm ts logger
// 需要修改的内容
import { getUserById, getUserByName, getBlackDetailById, delBlackById,getCheckDetailById} from './mapper';

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

app.get('/select', async (req, res) => {

  const a = await db.select("User", { id: 1 }); //这个东西返回是一个数组
  res.send(a);
});


app.get('/update', async (req, res) => {

  const a = await db.update("User", 1, { role: 999 }); //这个东西返回是一个数组
  res.send(a);
});

app.get('/remove', async (req, res) => {

  const a = await db.remove("User", { id: 2 }); //这个东西返回是一个数组
  res.send(a);
});


app.get('/insert', async (req, res) => {

  const b = await function (


  ) {

  }

  const a = await db.insert("User", {
    id: 2,
    uid: 'U1002',
    avatar: 'https://example.com/avatar2.jpg',
    nickname: 'Bob',
    role: 2,
    username: 'bob_member',
    password: 'hashed_password_2',
    create_by: 'alice_admin',
    creation_date: new Date(),
    last_update_by: 'alice_admin',
    last_update_date: new Date()
  });
  res.send(a);
})



app.get('/query', async (req, res) => {

  const a = await db.query('select  t.id  from admin t ,user l  where t.user_id = l.id and l.id = 1 '); //这个东西返回是一个数组
  res.send(a);
});

//查询黑名单
app.get('/api/blacklist/get', async (req, res) => {
  // For route parameters like '/insert/:id'
  //const routeParams = req.params;

  const { id, name } = req.query;
  let result: string = 'No Params';

  //id不为空
  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getUserById(Number(id));
    res.send(result);
    return;
  }

  //name不为空
  if (name != null && name != '' && name != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getUserByName(name.toString());
    res.send(result);
    return;
  }
  // 1. 先定义函数
  // 2. 再调用函数

  res.send('id is null && name is null');
  return false;
});

//查询黑名单详情
app.get('/api/blacklist/getDetail', async (req, res) => {

  const { id } = req.query;
  let result: string = 'No Params';

  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getBlackDetailById(Number(id));
    res.send(result);
    return;
  }

});


app.get('/api/blacklist/del', async (req, res) => {

  const { id } = req.query;
  if (Number(id) == 0) {

  } else {
    return Error(500);
  }


  const a = await delBlackById(Number(id)) //这个东西返回是一个数组
  res.send(a);
});


//查询审核表详情
app.get('/api/check/getDetail', async (req, res) => {

  const { id } = req.query;
  let result: string = 'No Params';

  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getBlackDetailById(Number(id));
    res.send(result);
    return;
  }

});

//获取状态码
async function Error(error) {
  switch (error) {
    case 500: //500 內部異常
      return '500';
  }

  return error;
}

//获取状态码正确
async function success() {
  return 200;
}


