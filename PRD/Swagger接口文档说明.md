# Swagger接口文档说明

## 概述

项目已集成Swagger 3.0（OpenAPI 3.0），提供可视化的API文档和在线测试功能。

## 访问地址

启动应用后，可以通过以下地址访问Swagger文档：

- **Swagger UI**: http://localhost:8080/swagger-ui/index.html
- **API文档JSON**: http://localhost:8080/v3/api-docs

## 依赖配置

### pom.xml

```xml
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-boot-starter</artifactId>
    <version>3.0.0</version>
</dependency>
```

## Swagger配置

### SwaggerConfig.java

```java
@Configuration
public class SwaggerConfig {

    @Bean
    public Docket createRestApi() {
        return new Docket(DocumentationType.OAS_30)
                .apiInfo(apiInfo())
                .select()
                .apis(RequestHandlerSelectors.basePackage("com.dublin.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    private ApiInfo apiInfo() {
        return new ApiInfoBuilder()
                .title("都柏林共享单车与天气服务 API文档")
                .description("提供都柏林共享单车站点信息查询和天气信息查询服务")
                .contact(new Contact("Dublin Service Team", "http://localhost:8080", "contact@dublin-service.com"))
                .version("1.0.0")
                .build();
    }
}
```

### application.yml配置

```yaml
# Swagger配置
springfox:
  documentation:
    swagger-ui:
      enabled: true
    enabled: true

spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```

## 注解说明

### Controller层注解

#### @Api
用于Controller类上，标识这是一个API资源

```java
@Api(tags = "自行车站点接口", description = "提供都柏林共享单车站点信息查询服务")
@RestController
@RequestMapping("/api/bike")
public class BikeController {
    // ...
}
```

#### @ApiOperation
用于Controller方法上，描述API操作

```java
@ApiOperation(value = "查询所有站点信息", notes = "获取所有自行车站点的静态信息和最新动态状态")
@GetMapping("/stations")
public ResponseEntity<List<BikeStationDTO>> getAllStations() {
    // ...
}
```

#### @ApiParam
用于方法参数上，描述参数信息

```java
@GetMapping("/stations/{number}")
public ResponseEntity<BikeStationDTO> getStationByNumber(
    @ApiParam(value = "站点编号", required = true, example = "42")
    @PathVariable Integer number) {
    // ...
}
```

### Model层注解

#### @ApiModel
用于实体类或DTO上，描述数据模型

```java
@Data
@ApiModel(description = "自行车站点信息")
public class BikeStationDTO {
    // ...
}
```

#### @ApiModelProperty
用于字段上，描述字段信息

```java
@ApiModelProperty(value = "站点编号", example = "42")
private Integer number;

@ApiModelProperty(value = "站点状态", example = "OPEN", notes = "OPEN-开放，CLOSED-关闭")
private String status;
```

## API分组

当前项目按功能模块分为两个API组：

1. **自行车站点接口** - 提供站点信息查询
2. **天气信息接口** - 提供天气信息查询

## 使用Swagger UI

### 1. 查看API列表

访问 http://localhost:8080/swagger-ui/index.html，可以看到所有API接口按标签分组展示。

### 2. 查看接口详情

点击任意接口，可以查看：
- 接口路径和HTTP方法
- 请求参数说明
- 响应数据结构
- 响应状态码说明

### 3. 在线测试接口

1. 点击接口右侧的 "Try it out" 按钮
2. 填写必要的参数
3. 点击 "Execute" 按钮执行请求
4. 查看响应结果

### 4. 查看数据模型

在页面底部的 "Schemas" 部分，可以查看所有数据模型的结构定义。

## API接口列表

### 自行车站点接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 查询所有站点信息 | GET | /api/bike/stations | 获取所有站点信息和最新状态 |
| 根据站点编号查询 | GET | /api/bike/stations/{number} | 查询指定站点的详细信息 |

### 天气信息接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 查询实时天气 | GET | /api/weather/current | 获取最新的实时天气信息 |
| 查询天气预报 | GET | /api/weather/forecast | 获取未来3天的天气预报 |

## 数据模型

### BikeStationDTO - 自行车站点信息

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| number | Integer | 站点编号 | 42 |
| name | String | 站点名称 | SMITHFIELD NORTH |
| address | String | 站点地址 | Smithfield North |
| banking | Integer | 是否支持银行卡 | 0 |
| positionLat | Float | 纬度 | 53.349562 |
| positionLng | Float | 经度 | -6.278198 |
| bikeStands | Integer | 车位总数 | 30 |
| availableBikes | Integer | 可用自行车数量 | 24 |
| availableBikeStands | Integer | 可用车位数量 | 6 |
| status | String | 站点状态 | OPEN |
| lastUpdate | DateTime | 最后更新时间 | 2026-01-01T12:00:00 |

### CurrentWeather - 实时天气信息

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | Long | 记录ID | 1 |
| dt | DateTime | 天气数据时间 | 2026-01-01T12:00:00 |
| main | String | 天气主要状况 | Clouds |
| description | String | 天气详细描述 | broken clouds |
| temp | Float | 温度（摄氏度） | 7.71 |
| windSpeed | Float | 风速（米/秒） | 2.57 |
| snapshotTime | DateTime | 数据入库时间 | 2026-01-01T12:05:00 |

### ForecastWeather - 预测天气信息

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| id | Long | 记录ID | 1 |
| futureDt | DateTime | 预测日期时间 | 2026-01-02T12:00:00 |
| main | String | 天气主要状况 | Clear |
| description | String | 天气详细描述 | sky is clear |
| temp12 | Float | 12点温度（摄氏度） | 9.36 |
| tempMin | Float | 最低温度（摄氏度） | 1.29 |
| tempMax | Float | 最高温度（摄氏度） | 9.8 |
| windSpeedMax | Float | 最大风速（米/秒） | 3.92 |
| snapshotTime | DateTime | 数据入库时间 | 2026-01-01T12:00:00 |

## 导出API文档

### 导出JSON格式

访问 http://localhost:8080/v3/api-docs 可以获取OpenAPI 3.0规范的JSON格式文档。

### 导出YAML格式

访问 http://localhost:8080/v3/api-docs.yaml 可以获取YAML格式文档。

## 自定义配置

### 修改扫描包路径

```java
.apis(RequestHandlerSelectors.basePackage("com.dublin.controller"))
```

### 修改API路径过滤

```java
.paths(PathSelectors.ant("/api/**"))  // 只扫描/api开头的路径
```

### 添加全局参数

```java
@Bean
public Docket createRestApi() {
    return new Docket(DocumentationType.OAS_30)
            .apiInfo(apiInfo())
            .globalRequestParameters(getGlobalRequestParameters())
            .select()
            .apis(RequestHandlerSelectors.basePackage("com.dublin.controller"))
            .paths(PathSelectors.any())
            .build();
}

private List<RequestParameter> getGlobalRequestParameters() {
    List<RequestParameter> parameters = new ArrayList<>();
    parameters.add(new RequestParameterBuilder()
            .name("token")
            .description("认证令牌")
            .in(ParameterType.HEADER)
            .required(false)
            .build());
    return parameters;
}
```

### 添加认证配置

```java
private List<SecurityScheme> securitySchemes() {
    List<SecurityScheme> apiKeyList = new ArrayList<>();
    apiKeyList.add(new ApiKey("token", "token", "header"));
    return apiKeyList;
}
```

## 生产环境配置

生产环境建议关闭Swagger，可以通过配置文件控制：

```yaml
# application-prod.yml
springfox:
  documentation:
    swagger-ui:
      enabled: false
    enabled: false
```

或者在配置类中添加条件注解：

```java
@Configuration
@Profile("!prod")  // 非生产环境才启用
public class SwaggerConfig {
    // ...
}
```

## 常见问题

### 1. 访问Swagger UI出现404

确保配置了正确的路径匹配策略：

```yaml
spring:
  mvc:
    pathmatch:
      matching-strategy: ant_path_matcher
```

### 2. 接口没有显示在Swagger中

检查Controller类是否在配置的扫描包路径下。

### 3. 时间格式显示问题

可以在配置类中添加日期格式化配置：

```java
@Bean
public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
    return builder -> {
        builder.simpleDateFormat("yyyy-MM-dd HH:mm:ss");
    };
}
```

## 最佳实践

1. **完善注解信息**: 为所有API添加详细的注解说明
2. **提供示例值**: 使用 `example` 属性提供参数示例
3. **分组管理**: 使用 `tags` 对API进行分组
4. **版本控制**: 在API路径中包含版本号（如 /api/v1/）
5. **生产环境关闭**: 生产环境禁用Swagger以提高安全性

## 总结

Swagger提供了强大的API文档和测试功能，可以：
- 自动生成API文档
- 在线测试接口
- 导出标准格式文档
- 提高前后端协作效率

通过合理使用Swagger注解，可以让API文档更加清晰易懂。
