import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BinsDataService {

  constructor() {
  }

  public binDist(variants, opts) {
    //заменить NULL на -infinity
    opts = opts || {};
    let disc = opts.disc || 30000;//Дискретность
    const width = opts.width || 200;//длина плашки в пикселях
    const padding = opts.padding || 8;//отсупы в плашке в пикселях
    const confRange = opts.confRange || 0.8;//длина дов интервал (1-коеф. значимости)
    const confRangeExp = Math.log(confRange);//длина дов интервал (1-коеф. значимости)
    //disc=5000;
    //var apriori=opts.apriori;


    let i, j, cur, sum;
    let count = 0;
    let countAll = 0;
    let maxN = 0;
    let average = 0;

    function round(val, lowPrecession) {
      if (lowPrecession) {
        if (val > 0.10 && val < 0.90) {
          return (Math.round(100 * val)) + '%';
        } else if (val > 0.005 && val < 0.995) {
          return (Math.round(1000 * val) / 10) + '%';
        } else {
          return (Math.round(10000 * val) / 100) + '%';
        }
      } else if (val > 0.05 && val < 0.95) {
        return (Math.round(1000 * val) / 10) + '%';
      } else if (val > 0.0005 && val < 0.9995) {
        return (Math.round(10000 * val) / 100) + '%';
      } else if (val > 0.00005 && val < 0.99995) {
        return (Math.round(100000 * val) / 1000) + '%';
      } else if (val > 0.000005 && val < 0.999995) {
        return (Math.round(1000000 * val) / 10000) + '%';
      } else {
        return (Math.round(10000000 * val) / 100000) + '%';
      }
    }


    function minus(a, b) {
      //Одно из чисел 0

      const delta = a - b;

      //Одно число больше другого в более чем миллион раз
      if (delta > 30) {
        return a;
      }
      if (delta < -30) {
        return b;
      }
      if (b === -Infinity)//a===b===-Infinity
      {
        return -Infinity;
      }

      return b + Math.log(Math.exp(delta) - 1);
    }

    function plus(a, b) {
      //Одно из чисел 0

      const delta = a - b;

      //Одно число больше другого в более чем миллион раз
      if (delta > 30) {
        return a;
      }
      if (delta < -30) {
        return b;
      }
      if (b === -Infinity)//a===b===-Infinity
      {
        return -Infinity;
      }

      //e^a+e^b = e^b * (1+e^(a-b))
      return b + Math.log(1 + Math.exp(delta));
    }

    function init() {
      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          countAll++;
          cur = variants[i];
          //cur.eq = [];//вероятность равенства
          //cur.less = [];//вероятностьтого, что меньше
          //cur.sum = -Infinity;

          if (typeof (cur.n) != 'undefined') {
            if (typeof (cur.s) == 'undefined') {
              cur.s = cur.n - cur.f;
            }
            if (typeof (cur.f) == 'undefined') {
              cur.f = cur.n - cur.s;
            }
          } else {
            cur.n = cur.s + cur.f;
          }
          cur.av = cur.s / cur.n;
          if (cur.n) {
            average += cur.av;
            count++;
          }
          maxN = Math.max(cur.n, maxN);
        }
      }
      average = !count ? 1 / 2 : average / count;
      let A = 0;
      let B = 0;
      if (average > 0.000001 && average > 0.999999 && count) {
        A = 1;
        B = 1 / average - A;
      }

      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          variants[i].s2 = variants[i].s + A;
          variants[i].f2 = variants[i].f + B;
        }
      }
    }

    init();

    if (countAll > 50) {
      disc = disc / 4;
    } else if (countAll > 10) {
      disc = disc / 2;
    }

    const ranges = [];//1,0.1,0.01,0.001,0.0001];
    for (i = 0; i < Math.max(1, Math.log(maxN) / Math.LN10); i++) {
      ranges.push(Math.pow(0.1, i));
    }

    const discArr = [];
    const discExpArr = [];
    const discExpArrM = [];
    const discLenArr = [];

    let pos = 0.0;

    function calcDisc() {//вычисляем точки в которых будем считать
      for (i = 0; i <= disc * 4; i++) {
        if (pos > 1) {
          break;
        }
        discArr.push(pos);
        for (var range = 1; range < ranges.length; range++) {
          if (Math.abs(average - pos) > ranges[range]) {
            break;
          }
        }
        pos += (2 * (ranges[range - 1] * ranges.length)) / disc;
      }
      disc = discArr.length;
      if (discArr[disc - 1] === 1) {
        disc--;
      } else {
        discArr.push(1);
      }

      discLenArr.push(-Infinity);
      for (var i = 0; i < discArr.length; i++) {
        discExpArr.push(Math.log(discArr[i]));
        discExpArrM.push(Math.log(1 - discArr[i]));
        if (i !== 0 && i !== discArr.length - 1) {
          discLenArr.push(Math.log(discArr[i + 1] - discArr[i - 1]));
        }
      }
      discLenArr.push(-Infinity);

    }

    calcDisc();

    //var pSum=0;//произведение сум
    function eq() {
      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          cur = variants[i];
          sum = -Infinity;


          cur.eq = new Array(disc + 1);
          cur.less = new Array(disc + 1);
          cur.eq[0] = -Infinity;
          cur.eq[disc] = -Infinity;
          cur.less[0] = -Infinity;
          cur.less[disc] = -Infinity;

          for (j = 1; j < disc; j++) {
            const p = discLenArr[j] + discExpArr[j] * cur.s + discExpArrM[j] * cur.f;//len * p^s * (1-p)^s
            //if(apriori)//умножаем на априори
            //	p += Math.log(apriori(discArr[j]));

            sum = plus(sum, p);
            cur.eq[j] = p;
            cur.less[j] = sum;
          }
          //cur.sum=sum;
          //pSum+=sum;
          //Суммарная вероятность должна быть равна 1
          for (j = 1; j < disc; j++) {
            cur.eq[j] -= sum;
            cur.less[j] -= sum;
          }
        }
      }
    }

    eq();

    function conf() {
      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          cur = variants[i];
          sum = -Infinity;

          //Находим максимум
          let av = 0;

          max = -Infinity;
          for (j = 1; j < disc; j++) {
            if (max <= cur.eq[j]) {
              max = cur.eq[j];
              cur.max = discArr[j];//вверх дов интервала
              av = j;

            }
          }
          const middle = cur.s / cur.n;
          cur.min = cur.max;

          sum = max;
          let sumF = 0;

          let minPos = av;
          let maxPos = av;

          for (j = 0; j < disc; j++) {//выбираем такое число ближайщих точек, чтобы вписатся в дов интервал
            if (minPos === 1 && maxPos === disc) {
              break;
            }
            var dir;
            if (minPos === 1) {
              dir = 1;
            } else if (maxPos === disc) {
              dir = -1;
            } else if (discArr[maxPos + 1] - middle < middle - discArr[minPos - 1]) {
              dir = 1;
            } else {
              dir = -1;
            }

            var pos;
            if (dir === 1) {
              maxPos++;
              pos = maxPos;
              cur.max = discArr[pos];
            } else {
              minPos--;
              pos = minPos;
              cur.min = discArr[pos];
            }
            sumF += Math.exp(cur.eq[pos]);
            sum = plus(sum, cur.eq[pos]);
            if (sum >= confRangeExp) {
              break;
            }

          }
          cur.pm = Math.max(cur.max - middle, middle - cur.min);
        }
      }
    }

    conf();
    //считаем произведение вероятностей

    const lessComp = [];//В массиве храниться вероятность того, что все p < x
    function less() {
      for (j = 0; j <= disc; j++) {
        lessComp.push(0);
      }//1
      lessComp[0] = -Infinity;//0
      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          const cur = variants[i];
          for (j = 1; j < disc; j++) {
            lessComp[j] += cur.less[j];
          }//*=sum
        }
      }
    }

    less();
    var max = 0;
    let min = 1;
    let max0 = 0;
    let min0 = 1;

    for (i in variants) {
      if (variants.hasOwnProperty(i)) {
        cur = variants[i];
        if (max < cur.max) {
          max0 = max;
          max = cur.max;
        } else if (max0 < cur.max) {
          max0 = cur.max;
        }

        if (min > cur.min) {
          min0 = min;
          min = cur.min;
        } else if (min0 > cur.min) {
          min0 = cur.min;
        }
      }
    }
    const delta = max - min;

    const aw = width - 2 * padding;
    const a = aw / delta;


    for (i in variants) {
      if (variants.hasOwnProperty(i)) {
        cur = variants[i];

        cur.iMinWidth = 0;
        cur.iMaxWidth = 0;
        cur.iMinStart = 0;
        cur.iMaxStart = 0;

        cur.iStart = padding + Math.round((cur.min - min) * a);
        cur.iWidth = Math.round((cur.max - cur.min) * a);

        cur.iMiddle = padding + (cur.s / cur.n - min) * a;

        if (max0 !== 0 || min0 !== 1) {
          if (cur.max > max0) {
            cur.iMaxWidth = Math.round((cur.max - Math.max(cur.min, max0)) * a);
            if (cur.iMaxWidth >= 5) {
              cur.iMaxStart = cur.iStart + cur.iWidth - cur.iMaxWidth;
              cur.iWidth -= cur.iMaxWidth;
            } else {
              cur.iMaxWidth = 0;
            }
          }
          if (cur.min < min0) {
            cur.iMinWidth = Math.round((Math.min(min0, cur.max, max0) - cur.min) * a);
            if (cur.iMinWidth >= 5) {
              cur.iMinStart = cur.iStart;
              cur.iWidth -= cur.iMinWidth;
              cur.iStart += cur.iMinWidth;
            } else {
              cur.iMinWidth = 0;
            }
          }

        }
        cur.confHtml = '';
        //cur.pHtml='&mdash;';
        if (cur.n) {
          cur.confHtml =
            '<div class="confInterval">'
            + '<div class="'
            + ((cur.iMaxWidth === 0) ? 'confIntervalREnd ' : '')
            + ((cur.iMinWidth === 0) ? 'confIntervalLEnd ' : '')
            + '"'
            + 'style="left:' + cur.iStart + 'px; width:' + cur.iWidth + 'px"></div>'
            + ((cur.iMaxWidth + cur.iMinWidth + cur.iWidth > 15) ? ('<div class="middleConfInterval" style="left:' + cur.iMiddle + 'px;"></div>') : '')
            + ((cur.iMaxWidth === 0) ? '' : '<div class="bestConfInterval ' + ((cur.iMinWidth === 0 && cur.iWidth === 0) ? 'confIntervalLEnd ' : '') + '" style="left:' + cur.iMaxStart + 'px; width:' + cur.iMaxWidth + 'px"></div>')
            + ((cur.iMinWidth === 0) ? '' : '<div class="worstConfInterval ' + ((cur.iMaxWidth === 0 && cur.iWidth === 0) ? 'confIntervalREnd ' : '') + '" style="left:' + cur.iMinStart + 'px; width:' + cur.iMinWidth + 'px"></div>')
            + '</div>';

          cur.pHtml = '<b>' + round(cur.s / cur.n, false) + '</b> <small>&plusmn;' + round(cur.pm, true) + '</small>';
        }
      }
    }

    function ctba() {
      for (i in variants) {
        if (variants.hasOwnProperty(i)) {
          cur = variants[i];
          cur.ctba = 0;
          cur.pCtba = Array(disc + 1);
          cur.pCtba[0] = -Infinity;
          cur.pCtba[disc] = -Infinity;
          for (j = 1; j < disc; j++) {
            let t = cur.eq[j] + lessComp[j] - cur.less[j];//cur.eq[j] * lessComp[j] / cur.less[j]
            t = Math.exp(t);
            cur.pCtba[j] = t;
            cur.ctba += t;
          }
        }
      }
    }

    ctba();

    function erf(x) {
      // constants
      const a1 = 0.254829592;
      const a2 = -0.284496736;
      const a3 = 1.421413741;
      const a4 = -1.453152027;
      const a5 = 1.061405429;
      const p = 0.3275911;

      // Save the sign of x
      let sign = 1;
      if (x < 0) {
        sign = -1;
      }
      x = Math.abs(x);

      // A&S formula 7.1.26
      const t = 1.0 / (1.0 + p * x);
      const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

      return sign * y;
    }

    function poh() {
      for (var i in variants) {
        if (variants.hasOwnProperty(i)) {
          variants[i].poh = 0;
          for (const j in variants) {
            if (variants.hasOwnProperty(j) && i !== j) {
              const v1 = variants[i];
              const v2 = variants[j];
              if (!v1.n || !v2.n || v1.n < 0 || v2.n < 0) {
                continue;
              }
              const m1 = v1.s / v1.n;
              const m2 = v2.s / v2.n;
              const m = m1 - m2;
              const s = Math.sqrt(m1 * (1 - m1) / (v1.n + 1) + m2 * (1 - m2) / (v2.n + 1));

              v1.poh = v1.poh + Math.abs(0.5 * m + 0.5 * m * erf(-m / (Math.sqrt(2) * s)) - (s * Math.exp(-m * m / (2 * s * s))) / Math.sqrt(2 * Math.PI));
            }
          }
        }
      }
      for (var i in variants) {
        if (variants.hasOwnProperty(i)) {
          const cur = variants[i];
          let val = cur.poh * 100
          let den = 1;
          for (let j = 0; j < 20; j++) {
            if (val > 10) {
              break;
            }
            den = den * 10;
            val = val * 10;
          }
          cur.pohHtml = (Math.round(val) / den) + '%';
        }
      }
    }

    poh();

    for (i in variants) {
      if (variants.hasOwnProperty(i)) {
        cur = variants[i];
        cur.ctbaHtml = round(cur.ctba, true);
      }
    }
    return { res: variants, disc: discArr };
  }

  public distRound(val) {
    if (val > 0.05 && val < 0.95) {
      return (Math.round(10000 * val) / 100) + '%';
    } else if (val > 0.0005 && val < 0.9995) {
      return (Math.round(10000 * val) / 100) + '%';
    } else if (val > 0.00005 && val < 0.99995) {
      return (Math.round(100000 * val) / 1000) + '%';
    } else if (val > 0.000005 && val < 0.999995) {
      return (Math.round(1000000 * val) / 10000) + '%';
    } else {
      return (Math.round(10000000 * val) / 100000) + '%';
    }
  }
}
