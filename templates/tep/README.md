# Deno Project Template

## 指令运行

1. 启动运行 : `deno task run`
2. 运行测试 : `deno task test`
3. 模块化 : `deno task mod`
4. 项目打包 : `deno task build`

## 文件结构

- `main.ts` - 入口
- `lib/` - 库
- `src/` - 源码
- `test/` - 测试
- `dist/` - 构建

## 项目模板介绍

### 模块化

模块化规则如下:

1. 项目统一的importMap为:

- `@` --> `src/` [项目源码目录]
- `self` --> `lib/mod.ts` [项目导出库的入口,tsdoc标记为 @pub(默认)]
- `internal` --> `lib/internal.ts` [项目内部库入口,需要tsdoc标记为 @lib]

2. 对于`lib`目录下的文件,遵循以下规则:

- 每个文件夹都必须有一个`mod.ts`文件,作为该文件夹的导出入口,上层的mod.ts会自动导入该文件夹的mod.ts

### 默认库

- `@chzky/core` : Core library for chzky
- `@chzky/std` : Standard Library for chzky
- `@chzky/cest` : Test Library for chzky

### format and lint

项目使用`biome`进行format/lint,具体规则见`biome.jsonc`
