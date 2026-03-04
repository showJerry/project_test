# 都柏林共享单车与天气服务 - API接口文档

## 基础信息

- **Base URL**: `http://localhost:8080/api`
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 自行车站点接口

### 1. 查询所有站点信息

**接口说明**: 查询所有自行车站点的静态信息和最新动态状态

**请求方式**: `GET`

**请求路径**: `/bike/stations`

**请求参数**: 无

**响应示例**:
```json
[
  {
    "number": 42,
    "name": "SMITHFIELD NORTH",
    "address": "Smithfield North",
    "banking": 0,
    "positionLat": 53.349562,
    "positionLng": -6.278198,
    "bikeStands": 30,
    "availableBikes": 24,
    "availableBikeStands": 6,
    "status": "OPEN",
    "lastUpdate": "2026-01-01T12:00:00"
  }
]
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| number | Integer | 站点编号 |
| name | String | 站点名称 |
| address | String | 站点地址 |
| banking | Integer | 是否支持银行卡（0/1） |
| positionLat | Float | 纬度 |
| positionLng | Float | 经度 |
| bikeStands | Integer | 车位总数 |
| availableBikes | Integer | 可用自行车数量 |
| availableBikeStands | Integer | 可用车位数量 |
| status | String | 站点状态（OPEN/CLOSED） |
| lastUpdate | DateTime | 最后更新时间 |

---

### 2. 根据站点编号查询

**接口说明**: 根据站点编号查询单个站点的详细信息

**请求方式**: `GET`

**请求路径**: `/bike/stations/{number}`

**路径参数**:
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| number | Integer | 是 | 站点编号 |

**请求示例**: `/bike/stations/42`

**响应示例**:
```json
{
  "number": 42,
  "name": "SMITHFIELD NORTH",
  "address": "Smithfield North",
  "banking": 0,
  "positionLat": 53.349562,
  "positionLng": -6.278198,
  "bikeStands": 30,
  "availableBikes": 24,
  "availableBikeStands": 6,
  "status": "OPEN",
  "lastUpdate": "2026-01-01T12:00:00"
}
```

**错误响应**:
- `404 Not Found`: 站点不存在

---

## 天气接口

### 3. 查询实时天气

**接口说明**: 查询都柏林的最新实时天气信息

**请求方式**: `GET`

**请求路径**: `/weather/current`

**请求参数**: 无

**响应示例**:
```json
{
  "id": 1,
  "dt": "2026-01-01T12:00:00",
  "main": "Clouds",
  "description": "broken clouds",
  "temp": 7.71,
  "windSpeed": 2.57,
  "snapshotTime": "2026-01-01T12:05:00"
}
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 记录ID |
| dt | DateTime | 天气数据时间 |
| main | String | 天气主要状况 |
| description | String | 天气详细描述 |
| temp | Float | 温度（摄氏度） |
| windSpeed | Float | 风速（m/s） |
| snapshotTime | DateTime | 数据入库时间 |

---

### 4. 查询未来3天天气预报

**接口说明**: 查询都柏林未来3天的天气预报

**请求方式**: `GET`

**请求路径**: `/weather/forecast`

**请求参数**: 无

**响应示例**:
```json
[
  {
    "id": 1,
    "futureDt": "2026-01-02T12:00:00",
    "main": "Clear",
    "description": "sky is clear",
    "temp12": 9.36,
    "tempMin": 1.29,
    "tempMax": 9.8,
    "windSpeedMax": 3.92,
    "snapshotTime": "2026-01-01T12:00:00"
  },
  {
    "id": 2,
    "futureDt": "2026-01-03T12:00:00",
    "main": "Clouds",
    "description": "overcast clouds",
    "temp12": 10.42,
    "tempMin": 3.86,
    "tempMax": 12.25,
    "windSpeedMax": 5.09,
    "snapshotTime": "2026-01-01T12:00:00"
  }
]
```

**字段说明**:
| 字段 | 类型 | 说明 |
|------|------|------|
| id | Long | 记录ID |
| futureDt | DateTime | 预测日期时间 |
| main | String | 天气主要状况 |
| description | String | 天气详细描述 |
| temp12 | Float | 12点温度（摄氏度） |
| tempMin | Float | 最低温度（摄氏度） |
| tempMax | Float | 最高温度（摄氏度） |
| windSpeedMax | Float | 最大风速（m/s） |
| snapshotTime | DateTime | 数据入库时间 |

---

## 错误码说明

| HTTP状态码 | 说明 |
|-----------|------|
| 200 | 请求成功 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 数据更新频率

- **自行车站点静态信息**: 首次启动时初始化，之后不再更新
- **自行车站点动态状态**: 每5分钟更新一次
- **实时天气**: 每1小时更新一次
- **天气预报**: 每1小时更新一次
- **数据保留**: 动态数据保留7天，自动清理

---

## 使用示例

### cURL示例

```bash
# 查询所有站点
curl http://localhost:8080/api/bike/stations

# 查询指定站点
curl http://localhost:8080/api/bike/stations/42

# 查询实时天气
curl http://localhost:8080/api/weather/current

# 查询天气预报
curl http://localhost:8080/api/weather/forecast
```

### JavaScript示例

```javascript
// 查询所有站点
fetch('http://localhost:8080/api/bike/stations')
  .then(response => response.json())
  .then(data => console.log(data));

// 查询实时天气
fetch('http://localhost:8080/api/weather/current')
  .then(response => response.json())
  .then(data => console.log(data));
```

---

## 注意事项

1. 所有接口都支持跨域访问（CORS）
2. 时间格式统一为ISO 8601格式
3. 温度单位为摄氏度（Celsius）
4. 风速单位为米/秒（m/s）
5. 接口返回的是数据库中最新的数据，不是实时调用外部API
