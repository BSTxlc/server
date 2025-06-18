import db from '../lib/db';
import express from 'express';
import cors from 'cors';
import winston from "winston";
import fs from 'fs';
import path from 'path';
import { log } from 'console';
import User from '../lib/db/entities/user';
import { get } from 'http';
import exp from 'constants';


export async function getUserById(id: number) {

    const res = await db.query(`SELECT u.avatar avatar,u.username name,u.id id ,b.reason reason,b.level level FROM blacklist b ,user u  where 1=1 and b.user_id = u.id and b.id =${id}`); //这个东西返回是一个数组

    return res;
}

export async function getUserByName(name: string) {
    name = "'" + name + "'";
    //模糊  const res = db.select("User", { name: name });

    const res = await db.query(`SELECT u.avatar avatar,u.username name,u.id id ,b.reason reason,b.level level FROM blacklist b ,
        user u  where 1=1 and b.user_id = u.id and u.nickname like '%' ${name} '%'`); //这个东西返回是一个数组

    return res;
}


export async function getBlackDetailById(id: number) {
    const res = await db.query(`SELECT u.avatar avatar,u.username name,u.id id ,b.reason reason,b.level level,b.content content,
        b.img img FROM blacklist b ,user u  
        where 1=1 and b.user_id = u.id and b.id =${id}`);
    return res;

}

export async function delBlackById(id: number) {
    const res = await db.query(`delete from blacklist where id = ?`, [id]);

    return res;

}

//3
export async function getCheckDetailById(id: number) {
    const res = await db.query(`SELECT u.avatar avatar,u.username name,u.id id,c.reason reason 
        ,c.level level FROM check c,user u  where c.user_id = u.id and u.id = ${id}`);
    return res;

}


export async function updateBlackListById(id: number) {
    const res = await db.query(`SELECT u.avatar avatar,u.username name,u.id id,c.reason reason 
        ,c.level level FROM check c,user u  where c.user_id = u.id and u.id = ${id}`);
    return res;

}
export async function getBlackListLevel(id: number) {
    if(id != null){
        const res = await db.query(`SELECT * from blacklist where user_id = ${id}`);
        return res;
    }
}

export async function upperBlackListLevelById(id: number,level: string) {
    if(level == 'false'){
        const res = await db.query(`UPDATE blacklist SET level = level + 1 where user_id = ${id}`);
        return 'OK';
    }else if(Number(level)){
        const res = await db.query(`UPDATE blacklist SET level = level + ${Number(level)} where user_id = ${id}`);
    }
}

export async function lowerBlackListLevelById(id: number,level: string) {
    if(level == 'false'){
        const res = await db.query(`UPDATE blacklist SET level = level - 1 where user_id = ${id}`);
        return 'OK';
    }else if(Number(level)){
        const res = await db.query(`UPDATE blacklist SET level = level ${Number(level)} where user_id = ${id}`);
        return 'OK';
    }
}

export async function selectAllUserNames() {
    
        const res = await db.query(`SELECT u.username name FROM user u`);
        return res;

}

export const userRegistry = async (username: string, password: string) => {
    var uid = await selectUserFields(['uid'])
    console.log(uid)
    let uidValue = uid[0].uid as string; 
    console.log(uidValue)
    const firstChar = uidValue.charAt(0);

    const restChars = uidValue.slice(1);

    const newUid = firstChar + (Number(restChars) + 1);


    const user = new User();
    user.username = username;
    user.uid = newUid;
    user.avatar = "";
    user.nickname = "";
    user.role = "user";
    user.password = password;
  
    const result = await db.insert("User", user);
    return result;
  };

  export async function userLogin(username: string, password: string) {
    const user = await selectUserFields(['password'],`username = '${username}'`);
    console.log(user)
    let userPassword = user[0].password as string; 
    console.log(userPassword);
    if (userPassword === password) {
        return true;
    }
    return false;
  }




export async function selectUserFields(fields: (keyof User)[], where?: string) {
    if (fields.length === 0) {
        throw new Error('No fields specified');
    }

    // 把欄位名組成 SQL 字串
    const columns = fields.join(', ');

    let sql = `SELECT ${columns} FROM user`;

    if (where) {
        sql += ` WHERE ${where}`; // 如果有 where 條件，就拼上
    }

    sql += ` ORDER BY id DESC`;

    const res = await db.query(sql);
    return res;
}
  