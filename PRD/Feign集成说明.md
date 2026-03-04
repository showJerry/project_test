# OpenFeign集成说明

## 概述

项目使用Spring Cloud OpenFeign来调用外部API，替代了原来的RestTemplate方式。

## 优势

1. **声明式调用**: 使用注解定义接口，无需手动编写HTTP请求代码
2. **负载均衡**: 内置Ribbon支持（如果需要）
3. **熔断降级**: 可集成Hystrix或Resilience4j
4. **日志记录**: 内置请求/响应日志
5. **超时配置**: 统一的超时管理
6. **代码简洁**: 减少样板代码

## 依赖配置

### pom.xml

```xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```

### Spring Cloud版本管理

```xml
<properties>
    <spring-cloud.version>2021.0.8</spring-cloud.version>
</properties>

<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${spring-cloud.version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 启用Feign

在主应用类上添加 `@EnableFeignClients` 注解：

```java
@SpringBootApplication
@EnableScheduling
@EnableFeignClients
public class BikeWeatherApplication {
    public static void main(String[] args) {
        SpringApplication.run(BikeWeatherApplication.class, args);
    }
}
```

## Feign客户端接口

### 1. BikeApiFeign - 自行车API

```java
@FeignClient(
    name = "bike-api",
    url = "${api.bike.url}",
    configuration = FeignConfig.class
)
public interface BikeApiFeign {
    
    @GetMapping
    List<BikeStationResponse> getStations(
        @RequestParam("contract") String contract,
        @RequestParam("apiKey") String apiKey
    );
}
```

### 2. WeatherApiFeign - 天气API

```java
@FeignClient(
    name = "weather-api",
    url = "${api.weather.url}",
    configuration = FeignConfig.class
)
public interface WeatherApiFeign {
    
    @GetMapping("/weather")
    CurrentWeatherResponse getCurrentWeather(
        @RequestParam("lat") String lat,
        @RequestParam("lon") String lon,
        @RequestParam("appid") String appid,
        @RequestParam("units") String units
    );
    
    @GetMapping("/forecast/daily")
    ForecastWeatherResponse getForecastWeather(
        @RequestParam("lat") String lat,
        @RequestParam("lon") String lon,
        @RequestParam("appid") String appid,
        @RequestParam("units") String units,
        @RequestParam("cnt") Integer cnt
    );
}
```

## Feign配置

### FeignConfig.java

```java
@Configuration
public class FeignConfig {
    
    @Bean
    Logger.Level feignLoggerLevel() {
        return Logger.Level.BASIC;
    }
    
    @Bean
    public Request.Options options() {
        return new Request.Options(
            10, TimeUnit.SECONDS,  // 连接超时
            60, TimeUnit.SECONDS   // 读取超时
        );
    }
}
```

### application.yml配置

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 10000
        readTimeout: 60000
        loggerLevel: basic

logging:
  level:
    com.dublin.feign: DEBUG
```

## 响应DTO

### BikeStationResponse

```java
@Data
public class BikeStationResponse {
    private Integer number;
    private String name;
    private String address;
    private Boolean banking;
    
    @JsonProperty("bike_stands")
    private Integer bikeStands;
    
    @JsonProperty("available_bikes")
    private Integer availableBikes;
    
    @JsonProperty("available_bike_stands")
    private Integer availableBikeStands;
    
    private String status;
    
    @JsonProperty("last_update")
    private Long lastUpdate;
    
    private Position position;
    
    @Data
    public static class Position {
        private Double lat;
        private Double lng;
    }
}
```

### CurrentWeatherResponse

```java
@Data
public class CurrentWeatherResponse {
    private Long dt;
    private List<Weather> weather;
    private Main main;
    private Wind wind;
    
    @Data
    public static class Weather {
        private String main;
        private String description;
    }
    
    @Data
    public static class Main {
        private Double temp;
    }
    
    @Data
    public static class Wind {
        private Double speed;
    }
}
```

## 使用示例

### 在Client中使用Feign

```java
@Slf4j
@Component
public class BikeApiClient {

    @Autowired
    private BikeApiFeign bikeApiFeign;

    @Value("${api.bike.contract}")
    private String contract;

    @Value("${api.bike.api-key}")
    private String apiKey;

    public List<BikeStation> fetchAllStations() {
        log.info("使用Feign调用Bike API");
        
        List<BikeStationResponse> responses = bikeApiFeign.getStations(contract, apiKey);
        
        // 转换为实体类
        return responses.stream()
            .map(this::convertToEntity)
            .collect(Collectors.toList());
    }
}
```

## 日志级别

Feign支持4种日志级别：

- **NONE**: 不记录日志（默认）
- **BASIC**: 记录请求方法、URL、响应状态码和执行时间
- **HEADERS**: 在BASIC基础上，记录请求和响应的头信息
- **FULL**: 记录请求和响应的头、正文和元数据

## 超时配置

### 全局配置

```yaml
feign:
  client:
    config:
      default:
        connectTimeout: 10000  # 连接超时10秒
        readTimeout: 60000     # 读取超时60秒
```

### 针对特定客户端配置

```yaml
feign:
  client:
    config:
      bike-api:
        connectTimeout: 5000
        readTimeout: 30000
      weather-api:
        connectTimeout: 10000
        readTimeout: 60000
```

## 错误处理

可以自定义ErrorDecoder来处理API错误：

```java
@Bean
public ErrorDecoder errorDecoder() {
    return new ErrorDecoder() {
        @Override
        public Exception decode(String methodKey, Response response) {
            if (response.status() >= 400 && response.status() <= 499) {
                return new RuntimeException("客户端错误: " + response.status());
            }
            if (response.status() >= 500 && response.status() <= 599) {
                return new RuntimeException("服务器错误: " + response.status());
            }
            return new RuntimeException("未知错误: " + response.status());
        }
    };
}
```

## 重试机制

可以配置Feign的重试策略：

```java
@Bean
public Retryer retryer() {
    return new Retryer.Default(
        100,   // 初始重试间隔（毫秒）
        1000,  // 最大重试间隔（毫秒）
        3      // 最大重试次数
    );
}
```

## 拦截器

可以添加请求拦截器来统一处理请求：

```java
@Bean
public RequestInterceptor requestInterceptor() {
    return template -> {
        template.header("User-Agent", "Dublin-Service");
        template.header("Accept", "application/json");
    };
}
```

## 项目结构

```
src/main/java/com/dublin/
├── feign/                    # Feign客户端接口
│   ├── BikeApiFeign.java
│   ├── WeatherApiFeign.java
│   └── FeignConfig.java
├── client/                   # 业务客户端（封装Feign调用）
│   ├── BikeApiClient.java
│   └── WeatherApiClient.java
└── dto/                      # 响应DTO
    ├── BikeStationResponse.java
    ├── CurrentWeatherResponse.java
    └── ForecastWeatherResponse.java
```

## 注意事项

1. Feign接口方法的参数必须使用 `@RequestParam`、`@PathVariable` 等注解明确指定
2. 响应DTO的字段名要与API返回的JSON字段匹配，或使用 `@JsonProperty` 注解
3. 超时时间要根据实际API响应时间合理设置
4. 生产环境建议配置重试和熔断机制
5. 注意API密钥的安全性，不要硬编码在代码中

## 与RestTemplate对比

| 特性 | Feign | RestTemplate |
|------|-------|--------------|
| 代码风格 | 声明式 | 命令式 |
| 代码量 | 少 | 多 |
| 可读性 | 高 | 中 |
| 负载均衡 | 内置支持 | 需手动实现 |
| 熔断降级 | 易集成 | 需手动实现 |
| 学习成本 | 低 | 低 |
| 灵活性 | 中 | 高 |

## 总结

使用OpenFeign可以大大简化外部API调用的代码，提高代码的可读性和可维护性。通过统一的配置管理，可以更好地控制超时、重试、日志等行为。
