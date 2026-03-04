# 都柏林共享单车与天气服务

## 项目简介

这是一个基于Spring Boot + MyBatis的都柏林城市数据服务系统，提供：
- 共享单车站点信息查询
- 实时天气信息
- 未来3天天气预报

## 技术栈

- Java 8
- Spring Boot 2.7.18
- MyBatis 2.2.2
- MySQL 8.0
- Lombok

## 数据库初始化

### 方式一：使用SQL脚本

```bash
# 连接MySQL
mysql -u root -p

# 执行初始化脚本
source init-database.sql
```

### 方式二：分步执行

```bash
# 1. 创建表结构
mysql -u root -p < src/main/resources/schema.sql

# 2. 创建存储过程
mysql -u root -p < src/main/resources/init-data.sql
```

## 配置说明

修改 `src/main/resources/application.yml` 中的数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/dublin_service
    username: root
    password: your_password
```

## 运行项目

```bash
# 编译
mvn clean package

# 运行
java -jar target/bike-weather-service-1.0.0.jar
```

## API接口

### Swagger文档

启动项目后，访问以下地址查看API文档：

- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **API文档JSON**: http://localhost:8080/v3/api-docs

### 接口列表

详见 `PRD/API接口文档.md` 和 `PRD/Swagger接口文档说明.md`

## 项目结构

```
project_test/
├── src/main/
│   ├── java/com/dublin/
│   │   ├── entity/          # 实体类
│   │   ├── repository/      # MyBatis Mapper接口
│   │   ├── service/         # 业务逻辑层
│   │   └── controller/      # 控制器层
│   └── resources/
│       ├── mapper/          # MyBatis XML映射文件
│       ├── schema.sql       # 表结构脚本
│       ├── init-data.sql    # 初始化数据脚本
│       └── application.yml  # 配置文件
├── PRD/                     # 产品需求文档
├── init-database.sql        # 一键初始化脚本
└── README.md
```