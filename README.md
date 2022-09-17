# 🪪 身份证号压缩算法

<p align="left">
  <a href="https://orca-zhang.github.io/idcmpr" alt='docs'>
    <img src="https://img.shields.io/badge/docs-在线demo点我-green.svg?style=for-the-badge">
  </a>
</p>

## 背景

- 今天上午看到一篇文章，突发奇想把它写出来了。[知乎[invalid s]的评论中关于身份证号码压缩的部分](https://www.zhihu.com/question/551451538/answer/2667817410)

## 编码规则

- 第一代身份证（15位身份证号码）已于2013年1月1日停用。

- 第二代身份证号码参照[《中华人民共和国国家标准GB11643-1999》](https://openstd.samr.gov.cn/bzgk/gb/newGbInfo?hcno=080D6FBF2BB468F9007657F26D60013E)

- 第二代身份证号码是由18位数字组成的，它们分别表示：
  - （1）前1、2位数字表示：所在省份的代码；
  - （2）第3、4位数字表示：所在城市的代码；
  - （3）第5、6位数字表示：所在区县的代码；
  - （4）第7~14位数字表示：出生年、月、日；7.8.9.10位是年11.12位是月13.14位是日
  - （5）第15、16位数字表示：所在地的派出所的代码；
  - （6）第17位数字表示性别：奇数表示男性，偶数表示女性；
  - （7）第18位数字是校检码：校检码可以是0~9的数字，有时也用x表示。

## 设计方案

- 对于使用护照等其他证件的情况，可以考虑在外部存储稀疏记录。

- (1)(2)(3)可以考虑打表，参照最新2020的区域代码表，包括历史已经撤销的区县，一共6734个，用13 bit存储。

- (4)(5)(6)用26bit存储
  - 1900年以前出生的老人，序号压缩到0-99，预留偏移558100（=15\*12\*31\*100+sn）给1900年以前的老人（根据报道，目前还健在最早出生年份1885年）。[输入时有校验逻辑序号是否超过算法预设场景](https://github.com/orca-zhang/idcmpr/blob/9ee1888f57b5c1de0cecb1bc4dee118d2f4927b6/src/App.vue#L32)，如果确实有异常发生，**实际生产中应考虑添加告警，或者可以降级参照稀疏数据的规则来管理**。
    - 第二代身份证在第一代身份证号码基础上增加了校验位，年份两位世纪位，所以需要检查一代身份证颁布时候的序号情况。一代身份证1984年4月6日开始颁布，1995年7月1日起启用，附近有第四次人口普查在1990年。通过网上可查询的数据分析，到区县级最多数百人，除非他们的出生日期聚集在几天，导致序号超过100的概率不大。
    - [海南省第四次普查4396人](http://www.enorth.com.cn/travel2/mbsz/hainan/index.htm)
    - [长寿之乡广西巴马第四次普查291人](https://www.yixue.com/index.php?title=长寿#.E4.B8.AD.E5.9B.BD.E5.B7.B4.E9.A9.AC)
    - [清河县第四次普查98人](https://view.inews.qq.com/k/20200918A0K4QV00?web_channel=wap&openApp=false)
    - [四川彭县第四次普查328人](https://www.crrc.com.cn/Html/News/Articles/10376.html)
  - 1900年以后出生的人，序号0-999，占10bit，剩下的bit表示时间，时间从1900年1月1日开始，可以用到2080年左右（2<sup>26</sup>/12/31/1000≈180年）。为了防止算法错误，不使用在某年内的天数来计算，而直接使用12个月\*每月31天（delta仅为372-365.25天）。

- (7)校验位直接丢弃，根据前面所有要素可以计算出来。

- 高13bit为区域信息，低26位为出生日期和序号信息，**总计39bit**，可视化表示用base36编码，压缩以后看高位情况，正常为6-8个字节。

## 感谢以下（排名不分先后）

<table>
  <tr>
    <td align="center">
      <a href="https://code.visualstudio.com" style="height: 64px;">
        <img src="https://github.com/orca-zhang/idcmpr/raw/master/vscode.svg" width="64px;" alt=""/>
        <br />
        <b>vscode</b>
      </a>
    </td>
    <td align="center">
      <a href="https://vuejs.org">
        <img src="https://github.com/orca-zhang/idcmpr/raw/master/vue.svg" width="64px;" alt=""/>
        <br />
        <b>vue</b>
      </a>
    </td>
    <td align="center">
      <a href="https://www.zhihu.com/people/s.invalid">
        <img src="https://pic1.zhimg.com/v2-3be9cec540b8e7da359d411dee690100_xl.jpg?source=32738c0c" width="64px;" alt=""/>
        <br />
        <b>invalid&nbsp;s</b>
      </a>
    </td>
    <td align="center">
      <a href="https://vitejs.cn">
        <img src="https://vitejs.cn/logo.svg" width="64px;" alt=""/>
        <br />
        <b>vite</b>
      </a>
    </td>
    <td align="center">
      <a href="https://vant-contrib.gitee.io/vant/">
        <img src="https://fastly.jsdelivr.net/npm/@vant/assets/logo.png" width="64px;" alt=""/>
        <br />
        <b>vant</b>
      </a>
    </td>
  </tr>
</table>
