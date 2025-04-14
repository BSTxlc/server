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