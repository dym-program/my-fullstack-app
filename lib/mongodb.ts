import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

// 全局变量声明，使用 let 或 const，并将变量手动附加到 globalThis
declare global {
  var _mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
  var _mongoClientPromise: Promise<MongoClient>;
}

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URI!;
const options = {};

// 手动将变量挂载到 globalThis
if (!globalThis._mongoose) {
  globalThis._mongoose = { conn: null, promise: null };
}

let cachedMongoose = globalThis._mongoose;

// 缓存 MongoClient 连接
let client: MongoClient;
let cachedMongoClient = globalThis._mongoClientPromise;

if (!cachedMongoClient) {
  client = new MongoClient(MONGODB_URI, options);
  globalThis._mongoClientPromise = client.connect(); // 初始化连接
  cachedMongoClient = globalThis._mongoClientPromise;
}

// Mongoose 连接函数
export async function mongooseConnect() {
  if (cachedMongoose.conn) {
    console.log("????")
    return cachedMongoose.conn;
  }
  console.log('start MongoDB URI:', process.env.MONGODB_URI);
  if (!cachedMongoose.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true, // 添加这两个选项
      serverSelectionTimeoutMS: 15000, // 增加超时时间
    };

    cachedMongoose.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log('Mongoose connected successfully!');
        return mongooseInstance.connection;
      })
      .catch((err) => {
        console.error('Mongoose connection error:', err.message);
        throw new Error('Mongoose connection failed');
      });
  }

  cachedMongoose.conn = await cachedMongoose.promise;
  return cachedMongoose.conn;
}

// 导出 MongoClientPromise 函数
export default function mongoClientPromise() {
  if (!globalThis._mongoClientPromise) {
    const client = new MongoClient(MONGODB_URI, options);
    globalThis._mongoClientPromise = client.connect(); // 初始化连接
  }
  return globalThis._mongoClientPromise; // 确保返回的是 Promise<MongoClient>
}
