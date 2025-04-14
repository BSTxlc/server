import { Admin, DataSource } from "typeorm";

// 导入数据库实体：用户
import User from "../entities/user";

/* const AppDataSource = new DataSource({
  type: "mysql",// 数据库类型
  //host: "10.135.227.73",// 数据库ip
  host: "localhost",// 数据库ip
  port: 3306,
  username: "root",// 这块配置你整一手吧
  password: "1234",
  database: "blacklist",
  entities: [User] ,// 需要使用的数据库实体
  driver: require('mysql2'),
}); */

const AppDataSource = new DataSource({
  type: "sqlite",// 数据库类型
  //host: "10.135.227.73",// 数据库ip
  database: "blacklist",
  entities: [User]// 需要使用的数据库实体
});

export const connectDB = async () => {
  await AppDataSource.initialize();
};

// https://typeorm.io/repository-api
type TypeMap = {
  User: User;
};

const getDBRepository = async<K extends keyof TypeMap>(whichDB: K) => {
  // const dbName = whichDB.toLowerCase();
  // const a = await import('../entities/' + dbName);
  // const userRepository = AppDataSource.getRepository(a.default);
  // return userRepository;

  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  return queryRunner;
};


const getDBEntities = async<K extends keyof TypeMap>(whichDB: K) => {
  const dbName = whichDB.toLowerCase();
  const a = await import('../entities/' + dbName);
  return a.default;
};

/**
 * 保存/更新数据
 * @param whichDB 哪个数据库
 * @param data 保存的数据
 * @returns 结果？
 */
export const saveData = async <K extends keyof TypeMap>(whichDB: K, data: TypeMap[K]) => {
  //   const repository = await getDBRepository(whichDB);
  //   return await repository.manager.save(data); // 保存数据到相应的数据库
  const queryRunner = await getDBRepository(whichDB);
  try {
    const entity = await getDBEntities(whichDB);
    const result = await queryRunner.manager.save(entity, data);
    await queryRunner.commitTransaction();
    return result;
  } catch (err) {
    await queryRunner.rollbackTransaction();
    throw err; // 抛出错误便于外部捕获和调试
  } finally {
    await queryRunner.release();
  }
};

/**
 * 
 * 获取数据库中的一个值
 * @param whichDB 哪个库
 * @param query 查询语句
 * @param take 查询数量
 * @param skip 跳过数量
 * @returns array结果
 */
export const getData = async<K extends keyof TypeMap>(whichDB: K, query: Record<string, any>, take?: number, skip?: number) => {
  const repository = await getDBRepository(whichDB);
  try {
    const result = await repository.manager.find(await getDBEntities(whichDB), {
      where: query,
      lock: { mode: 'pessimistic_write' }
    });

    if (result.length === 0) {
      return null;
    }

    const startIndex = skip || 0; // 分页起始位置
    const endIndex = take ? startIndex + take : result.length; // 分页结束位置
    const paginatedData = result.slice(startIndex, endIndex);

    await repository.commitTransaction();
    return paginatedData;
  } catch (err) {
    // console.log(err);
    await repository.rollbackTransaction();
    return null;
  } finally {
    await repository.release();
  }
};

/**
 * 删除一个库内的某行数据
 * @param whichDB 选择哪个库
 * @returns Promise<查询条件>
 */
// export const removeData = async<K extends keyof TypeMap>(whichDB: K) =>
export const removeData = async<K extends keyof TypeMap>(whichDB: K, query: Record<string, any>) => {
  const repository = await getDBRepository(whichDB);

  try {
    const result = await repository.manager.delete(await getDBEntities(whichDB), query);
    await repository.commitTransaction();
    return result;
  } catch (err) {
    await repository.rollbackTransaction();
    return null;
  } finally {
    await repository.release();
  }

  // return repository.delete;
};

export const getCount = async<K extends keyof TypeMap>(whichDB: K, query: Record<string, any>) => {
  const repository = await getDBRepository(whichDB);

  // const count = await repository.countBy(query);

  // return count;

  try {
    const result = await repository.manager.countBy(await getDBEntities(whichDB), query);
    await repository.commitTransaction();
    return result;
  } catch (err) {
    await repository.rollbackTransaction();
    return null;
  } finally {
    await repository.release();
  }
};

// export const upsert = async<K extends keyof TypeMap>(whichDB: K) =>
// {
//   const repository = await getDBRepository(whichDB);
// };
export const query = async<K extends keyof TypeMap>(query: string): Promise<any | null> =>
  {
    try
    {
      const result = await AppDataSource.query(query);
      return result;
    } catch (err)
    {
      console.log(err);
      return null;
    }
  };
