import {rs} from './regions'

function code2idx(item:number) {
    let low = 0;
    let height = rs.length - 1;
    while (low <= height) {
        let mid = ~~((height + low) / 2);
        let guess = rs[mid][0];
        if(guess == item) {
            return mid;
        } else if (guess  > item) {
            height = mid - 1;
        } else {
            low = mid + 1;
        }
    }
    return -1
}

export function idx2str(idx:number):string {
    const code = rs[idx][0];
    let res = rs[idx][1];
    if(code%10000){
        let subidx = code2idx(~~(code/100)*100);
        if(subidx>-1) {
            res = rs[subidx][1]+res;
        }
    }
    let subidx = code2idx(~~(code/10000)*10000);
    if(subidx>-1) {
        res = rs[subidx][1]+res;
    }
    return res;
}

export function id2idx(id:string):number {
    let code = id.substring(0, 6);
    return code2idx(~~code);
}

export function cmpr(id:string):number {
    let idx = id2idx(id);
    let y = ~~id.substring(6, 10);
    let m = ~~id.substring(10, 12);
    let d = ~~id.substring(12, 14);
    let sn = ~~id.substring(14, 17);
    let tail:number;
    if(y < 1900) {
        tail = (((1900 - y) * 12 + m - 1) * 31 + d - 1) * 100 + sn;
    }
    tail = (558100 + (((y - 1900) * 12 + m - 1) * 31 + d - 1) * 1000 + sn);
    // 因为js超过32位无法用位运算，会被截断到32位，所以只能用乘以2^x的方式绕过去，其他语言用 (idx << 26) | tail
    return idx * Math.pow(2, 26) + tail;
}

function padding(n:number,len:number) {
    return new Array(len - (n + '').length + 1).join('0') + n;
}

export function decmpr(idcmpr:number):string {
    let idx = ~~(idcmpr / Math.pow(2, 26));
    let id = rs[idx][0]+'';
    let ts_sn = (idcmpr & 0x3FFFFFF);
    let sn,d,m,y:number;
    if(ts_sn<=558100) {
        sn = ~~(ts_sn%100);
        d = ~~(ts_sn/100%31)+1;
        m = ~~(ts_sn/100/31%12)+1;
        y = 1900 - ~~(ts_sn/100/31/12);
    } else {
        ts_sn = ts_sn - 558100;
        sn = ~~(ts_sn%1000);
        d = ~~(ts_sn/1000%31)+1;
        m = ~~(ts_sn/1000/31%12)+1;
        y = 1900 + ~~(ts_sn/1000/31/12);
    }
    let hdr = id+y+padding(m,2)+padding(d,2)+padding(sn,3);
    return hdr+id_cksum(hdr);
}

export function id_cksum(id:string):string {
    const powerList = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const paritybitList = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let num = 0;
    let certArr = id.split('').map(Number).slice(0, 17);

    for (let i = 0; i < certArr.length; i++) {
        num += (certArr[i] * powerList[i]);
    }
    return paritybitList[num % 11];
}