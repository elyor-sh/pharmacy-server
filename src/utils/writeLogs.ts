import {lookup} from "geoip-lite";
import * as fs from "fs";
import {Request} from "express";

export const writeLogs = (req: Request, success = true) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    const obj = {
        time: new Date(),
        method: req.method,
        url: req.url,
        query: req.query,
        params: req.params,
        body: req.body,
        auth: JSON.stringify(req.header('Authorization')) || '-',
        ip: ip,
        location: lookup(JSON.stringify(ip)),
        success
    }


        fs.appendFile("logs.txt", `${JSON.stringify(obj, null, 2)},`, function(error){
            if(error) return  error; // если возникла ошибка
        });
}