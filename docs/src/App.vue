<script setup lang="ts">
import { ref } from 'vue';
import { id2idx, idx2str, cmpr, decmpr, id_cksum } from './idcmpr';

const id = ref('');
const id_formatter = (value:string) => value.replace(/[^\dxX]|[xX](?=[\d])|[xX]{2}/g, '');
const errmsg = ref('');
const on_id_change = (id:string) => {
  if(id.length == 18) {
    let idx = id2idx(id);
    if(idx == -1) {
      errmsg.value = '不存在的区域代码';
      return
    }
    if(!/^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(id)) {
      let y = ~~id.substring(6, 10);
      if(y<1800||y>2100) {
        errmsg.value = '年份格式不正确';
        return
      }
      let m = ~~id.substring(10, 12);
      let d = ~~id.substring(12, 14);
      let date = new Date(y+'/'+m+'/'+d)
      if(!(date instanceof Date && !isNaN(date.getTime()))) {
        errmsg.value = '日期格式不正确';
        return
      }
      errmsg.value = '身份证格式不正确';
      return
    }
    if(~~id.substring(6, 10) < 1900 && ~~id.substring(14, 17) > 99){
      errmsg.value = '1900年前老人序号不支持超过100';
      return
    }
    if(id_cksum(id) != id[17].toUpperCase()) {
      errmsg.value = '校验位不正确';
      return
    }
    errmsg.value = '';
    cmpr_code.value = cmpr(id).toString(36);

    ext_show.value = true;
    region.value = idx2str(idx);
    birthdate.value = id.substring(6, 10)+'/'+id.substring(10, 12)+'/'+id.substring(12, 14);
    gender.value = ~~id.substring(17, 1)&1? '男':'女';
  } else {
    cmpr_code.value = '';
    region.value = '';
    birthdate.value = '';
    gender.value = '';
  }
}

const cmpr_code = ref('');
const cmpr_code_formatter = (value:string) => value.replace(/\W/g, '');

const region = ref('');
const birthdate = ref('');
const gender = ref('');

const ext_show = ref(false);

const on_cmpr_code_change = (ic:string) => {
  if(ic.length > 6) {
    id.value = decmpr(parseInt(ic, 36));

    ext_show.value = true;
    region.value = idx2str(id2idx(id.value));
    birthdate.value = id.value.substring(6, 10)+'/'+id.value.substring(10, 12)+'/'+id.value.substring(12, 14);
    gender.value = ~~id.value.substring(17, 1)&1? '男':'女';
  } else {
    id.value = '';
    region.value = '';
    birthdate.value = '';
    gender.value = '';
  }
}
</script>

<template>
  <div>
    <a class="logo" href="https://github.com/orca-zhang/idcmpr">
      <svg height="64" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="64" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>
    <h1>🪪 身份证压缩演示</h1>
    <van-cell-group inset>
      <van-field
        v-model="id"
        label="身份证号码"
        placeholder="请输入身份证号码(18位)"
        maxlength=18
        :formatter=id_formatter
        enterkeyhint="done"
        @update:model-value=on_id_change
        :error-message=errmsg
      />
    </van-cell-group>
    <br />
    <van-cell-group inset>
      <van-field
        v-model="cmpr_code"
        label="压缩码"
        placeholder="请输入压缩码(6-8位)"
        maxlength=8
        :formatter=cmpr_code_formatter
        enterkeyhint="done"
        @update:model-value=on_cmpr_code_change
      />
    </van-cell-group>
    <br />
    <van-cell-group inset v-show="ext_show">
      <van-cell title="地区" :value=region />
      <van-cell title="生日" :value=birthdate />
      <van-cell title="性别" :value=gender />
    </van-cell-group>
  </div>
</template>

<style scoped>
.logo {
  height: 3em;
  padding: 1.5em;
  will-change: filter;
  fill: rgb(240, 246, 252);
}
.logo:hover {
  filter: drop-shadow(0 0 2em #777);
}
</style>
