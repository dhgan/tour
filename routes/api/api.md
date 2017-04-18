# 接口文档

## common

### 1. /common/getECode

#### 基本信息
说明：获取邮箱验证码
请求方式： POST

#### 请求参数
- email: 
	- String
	- 邮箱
- type: 
	- String
	- 注册类型
		- 100：注册


### 响应数据
- status: 
	- String
	- 响应码
		- 200：成功
		- 300：邮箱格式错误
		- 400：错误type
		- 500：数据库错误
		- 800：存在参数为空


## tourist

### 1. /tourist/register

#### 基本信息
说明：注册
请求方式： POST

#### 请求参数
- userName: 
	- String
	- 用户名
- email: 
	- String
	- 邮箱
- eCode: 
	- String
	- 邮箱验证码
- password: 
	- String
	- 密码

### 响应数据
- status: 
	- String
	- 响应码
		- 200：成功
		- 300：邮箱格式错误
		- 400：用户名已存在
		- 500：数据库错误
		- 600：邮箱验证码错误
		- 601：邮箱验证码过期
		- 800：存在参数为空

### 2. /tourist/login

#### 基本信息
说明：登录
请求方式： POST

#### 请求参数
- userName: 
	- String
	- 用户名
- password: 
	- String
	- 密码
- captcha: 
	- String
	- 图片验证码

### 响应数据
- status: 
	- String
	- 响应码
		- 200：成功
		- 300：图片验证码错误
		- 400：用户名或密码错误
		- 500：数据库错误
		- 800：存在参数为空

## admin