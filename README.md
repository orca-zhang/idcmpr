# 🪪 身份证号压缩算法

<p align="center">
  <a href="https://orca-zhang.github.io/idcmpr" alt='docs'>
    <img src="https://img.shields.io/badge/docs-在线demo点我-blue.svg?style=flat">
  </a>
</p>

## 背景

- 今天上午看到一篇文章，突发奇想把它写出来了。[知乎[invalid s]的评论中关于身份证号码压缩的部分](https://www.zhihu.com/question/551451538/answer/2667817410)

## 编码规则

- 参照[《中华人民共和国国家标准GB11643-1999》]https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=080D6FBF2BB468F9007657F26D60013E

- 身份证号码是由18位数字组成的，它们分别表示：
  - （1）前1、2位数字表示：所在省份的代码；
  - （2）第3、4位数字表示：所在城市的代码；
  - （3）第5、6位数字表示：所在区县的代码；
  - （4）第7~14位数字表示：出生年、月、日；7.8.9.10位是年11.12位是月13.14位是日
  - （5）第15、16位数字表示：所在地的派出所的代码；
  - （6）第17位数字表示性别：奇数表示男性，偶数表示女性；
  - （7）第18位数字是校检码：校检码可以是0~9的数字，有时也用x表示。

## 设计方案

  - (1)(2)(3)可以考虑打表，参照最新2020的区域代码表，包括历史已经撤销的区县，一共6734个，用13 bit存储。

  - (4)(5)(6)用26bit存储，时间从1900年1月1日开始，序号占10bit，可以用到2080年左右（2<sup>26</sup>/12/31/1000≈180年）。为了防止算法错误，不使用在某年内的天数来计算，而直接使用12月*31天。
    - 1900年以前出生的老人：按数据分析，2000年百岁老人为5万人，平均到每个区/县不到10人，序号压缩到2位，预留558100（=15*12*31*100+sn）给1900年以前的老人（根据报道，目前还健在最早出生年份1885年）。

  - 总计39bit，可视化表示用base36编码，压缩以后看高位情况，可以用6-8个字节表示。