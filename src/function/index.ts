import db from '../lib/db';
import express from 'express';
import cors from 'cors';
import winston from "winston";
import fs from 'fs';
import path from 'path';
import { log } from 'console';
import crypto from 'crypto';
import User from '../lib/db/entities/user';
import { get } from 'http';
import formidable from 'formidable';


// typeorm ts logger

// 需要修改的内容
import {
  getUserById, userLogin, getUserByName, getBlackDetailById, delBlackById, getCheckDetailById, insertCheckObjects, getBlackListLevel, userRegistry,
  upperBlackListLevelById, lowerBlackListLevelById, selectAllUserNames
} from './mapper';

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


//1：查询界面
app.get('/api/blacklist/query', async (req, res) => {

  const a = await db.query('select  t.id  from admin t ,user l  where t.user_id = l.id and l.id = 1 '); //这个东西返回是一个数组
  success(res, a);
});

//1：查询界面
app.get('/api/blacklist/get', async (req, res) => {
  // For route parameters like '/insert/:id'
  //const routeParams = req.params;

  const { id, name } = req.query;
  let result: string = 'No Params';

  //id不为空
  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getUserById(Number(id));
    success(res, result);
    return;
  }

  //name不为空
  if (name != null && name != '' && name != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getUserByName(name.toString());
    success(res, result);
    return;
  }
  // 1. 先定义函数
  // 2. 再调用函数
  InputError(res, 'id is null && name is null');
  return false;
});

//2.详情界面
app.get('/api/blacklist/getDetail', async (req, res) => {

  const { id } = req.query;
  let result: string = 'No Params';

  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getBlackDetailById(Number(id));
    success(res, result);
    return;
  } else {
    InputError(res, 'id is null');
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


//3查询审核表详情
app.get('/api/check/getDetail', async (req, res) => {

  const { id } = req.query;
  let result: string = 'No Params';

  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getBlackDetailById(Number(id));
    res.send(result);
    return;
  }

});

//3.管理员登陆界面
app.post('/common/register', async (req, res) => {
  var { username, password, role } = req.query;
  var adminFlag = false;
  if (role == '' || role == null || role == undefined) {
    role = '1';
  }
  var users = [];
  users = await selectAllUserNames();
  console.log(users)

  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    console.log(element)
    if (element.name == username) {
      adminFlag = true;
    }
  }

  if (adminFlag) {
    error(res, 'username already exists');
    return '';
  } else {
    const encrypted = encryptPassword(password.toString());

    const result = await userRegistry(username.toString(), encrypted.toString(), Number(role));
    res.json({ message: 'Registered successfully', content: users + result });
  }

});

//用户登录界面
app.post('/login', async (req, res) => {
  const { username, password } = req.query;
  var bUserFlag = false;
  const encrypted = encryptPassword(password.toString());
  var users = [];
  users = await selectAllUserNames();
  console.log(users)
  for (let index = 0; index < users.length; index++) {
    const element = users[index];
    console.log(element)
    if (element.name == username) {
      bUserFlag = true;
    }
  }


  if (bUserFlag == false) {
    res.send({ code: Error(400), message: 'username not exists' });
    return '';
  }

  if (!await userLogin(username.toString(), encrypted)) {
    res.send({ code: Error(400), message: 'password error' });
    return '';
  }

  res.json({ message: 'Login successful', content: `200` });
  return '';
  /*   if (stored === encrypted) {
      return res.json({ message: 'Login successful', token: 'example-token' });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    } */
});

// 上传图片
app.post('/static/img/upload', async (req, res) => {
  logger.info('/static/img/upload');
  const form = formidable({});

  form.parse(req, function (error, fields, files) {
    const userId = fields.userId;

    if (!userId || !files.file[0]) {
      res.send({
        success: false
      });

      return;
    }
    const fileName = files.file[0].originalFilename + userId;
    const tempFilePath = files.file[0].filepath;

    const filePath = `${staticPath}/temp/${fileName}.png`;

    fs.writeFileSync(filePath, fs.readFileSync(tempFilePath));

    fs.unlinkSync(tempFilePath);
    const host = "http://blacklist.reifuu.icu";
    res.send({
      success: true,
      path: `${host}/temp/${fileName}.png`
    });
  });
});


//提交一个举报
app.post('/api/check/sendCheck', async (req, res) => {

  const { checkObjects } = req.body;

  if (!Array.isArray(checkObjects)) {
    return res.status(400).json({ error: 'checkObjects must be an array' });
  }

  const requiredKeys = ['avatar', 'name', 'user_id', 'reason', 'level', 'content', 'img'];
  const invalidIndexes: number[] = [];

  checkObjects.forEach((obj: any, index: number) => {
    const hasAllKeys = requiredKeys.every(
      (key) => obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== '' && obj[key] !== undefined
    );

    if (!hasAllKeys) {
      invalidIndexes.push(index);
    }
  });


  if (invalidIndexes.length > 0) {
    logger.warn("checkObjects has invalid entries at indexes", invalidIndexes);
    return res.status(400).json({
      error: 'Some check objects are missing required fields or have empty values.',
      invalidIndexes
    });
  }

  logger.info("All checkObjects are valid", checkObjects);
  try {
    insertCheckObjects(checkObjects);
  } catch (e) {
    res.send(Error(500));
  }  // 你可以在此处添加数据库存储、业务逻辑等
  res.send({ message: 'Check submitted successfully', data: checkObjects });

  /*   if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
      result = await getBlackDetailById(Number(id));
      res.send(result);
      return;
    } */

});

//获取状态码

app.get('/api/blacklist/del', async (req, res) => {

  const { id } = req.query;
  if (Number(id) == 0) {

  } else {
    return Error(500);
  }


  const a = await delBlackById(Number(id)) //这个东西返回是一个数组
  res.send(a);
});

app.get('/api/blacklist/upper', async (req, res) => {

  const { level, id } = req.query;
  if (id != '' && id != null && id != undefined) {
    if (level == '' || level == null || level == undefined) {
      const levelNumber = await getBlackListLevel(Number(id))
      if (Number(levelNumber) < 3) {
        const a = await upperBlackListLevelById(Number(id), 'false') //这个东西返回是一个数组
        if (a == 'OK') {
          success(res);
        }
      } else {
        res.send(Error(res, 500, 'level is max'));
      }
    } else {
      const levelNumber = await getBlackListLevel(Number(id))
      if (Number(levelNumber) + Number(level) > 3) {
        const a = await upperBlackListLevelById(Number(id), level.toString()) //这个东西返回是一个数组
        if (a == 'OK') {
          success(res);
        }
      } else {
        res.send(Error(res, 500, 'level is max'));
      }
    }
  } else {
    res.send(Error(res, 500, 'id is null'));
  }


  //const a = await delBlackById(Number(id)) //这个东西返回是一个数组
  success(res);
});


app.get('/api/blacklist/lower', async (req, res) => {

  const { level, id } = req.query;
  if (id != '' && id != null && id != undefined) {
    if (level == '' || level == null || level == undefined) {
      const levelNumber = await getBlackListLevel(Number(id))
      if (Number(levelNumber) > 1) {
        const a = await upperBlackListLevelById(Number(id), 'false') //这个东西返回是一个数组
        if (a == 'OK') {
          success(res);
        }
      } else {
        res.send(Error(res, 500, 'level is max'));
      }
    } else {
      const levelNumber = await getBlackListLevel(Number(id))
      if (Number(levelNumber) - Number(level) > 1) {
        const a = await upperBlackListLevelById(Number(id), level.toString()) //这个东西返回是一个数组
        if (a == 'OK') {
          success(res);
        }
      } else {
        res.send(Error(res, 500, 'level is max'));
      }
    }
  } else {
    res.send(Error(res, 500, 'id is null'));
  }


  //const a = await delBlackById(Number(id)) //这个东西返回是一个数组
  success(res);
});


//查询审核表详情
app.get('/api/check/getDetail', async (req, res) => {

  const { id } = req.query;
  let result: string = 'No Params';

  if (id != null && id != '' && id != undefined) {  // 如果 id 是 undefined、null 或空字符串 ''
    result = await getBlackDetailById(Number(id));
    res.send(result);
    return;
  } else {
    Error(res, 500, 'id is null');
  }
});

//查询审核表详情
app.post('/api/check/postCheck', async (req, res) => {

  const { checks } = req.body;
  if (checks.length == 1) {

  }
  console.log(checks)
  res.send(checks);

});



function encryptPassword(password: string): string {
  const md5Part = crypto.createHash('md5').update(password).digest('hex').substring(0, 10);
  const base64Part = Buffer.from(password).toString('base64').substring(0, 10);
  return md5Part + base64Part;
}


function Error(res, errorCode = 500, msg = 'Server Error') {
  res.status(errorCode).send({ code: errorCode, message: msg });
}

/* //获取状态码正确
async function success() {
  return 200;
}
 */

// 成功响应封装
function success(res, data = null, msg = 'Success') {
  res.status(200).json({
    code: 200,
    error_message: msg,
    data
  });
}

// 错误响应封装
function error(res, msg = 'Internal Server Error') {
  res.status(500).json({
    code: 500,
    error_message: msg,
    data: null
  });
}

function InputError(res, msg = 'Input Error') {
  res.status(400).json({
    code: 400,
    error_message: msg,
    data: null
  });
}