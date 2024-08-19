import { Sequelize } from 'sequelize';
import * as pg from 'pg';
import { db_host, db_port, db_name, db_user, db_password } from './config';

const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  port: db_port,
  dialect: 'postgres',
  dialectModule: pg,
});

export default sequelize;