// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//默认执行，扩展Date的方法
Date.prototype.Format = function(fmt)
{ //author: meizz
  var o = {
    "M+" : this.getMonth()+1,                 //月份
    "d+" : this.getDate(),                    //日
    "h+" : this.getHours(),                   //小时
    "m+" : this.getMinutes(),                 //分
    "s+" : this.getSeconds(),                 //秒
    "q+" : Math.floor((this.getMonth()+3)/3), //季度
    "S"  : this.getMilliseconds()             //毫秒
  };
  if(/(y+)/.test(fmt))
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  for(var k in o)
    if(new RegExp("("+ k +")").test(fmt))
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
  return fmt;
}

/*
  dif: [number]  当前时间戳1
  dif2: [number] 比较时间戳2
*/
function timeDiff(dif, dif2){
  var orientation = 'before',
      _diff = dif-dif2;

  if (_diff<0) {
    orientation: 'future'
  }
  var diff = Math.abs(_diff)
  const $diff = timeDiff.getDiff(diff)
  return {
    now: dif,
    target: dif2,
    orientation: orientation,
    diff:{...$diff},
    ...$diff
  }
}

timeDiff.getDiff = function(diff){
  const __second = _.ceil(diff/1000)
  const __min = 60
  const __hour = 3600
  const __day = 3600*24
  const __month = 3600*24*30
  const __year = 3600*24*30*12

  let $year, $month, $day, $hour, $min, xsecond

  let yushu = 0
  $year = (()=>{
    if (__second/__year >= 1) {
      yushu = __second%__year
      return _.floor(__second/__year)
    }
    else { yushu = __second%__year }
  })()
  if ($year && $year<10) $year = '0'+$year
  if (yushu == 0) {
    $month='00'; $day='00'; $hour='00'; $min='00';
  }

  $month = (()=>{
    if (__second/__month >= 1) {
      yushu = __second%__month
      return _.floor(__second/__month)
    }
    else { yushu = __second%__month }
  })()
  if ($month && $month<10) $month = '0'+$month
  if (yushu == 0) {
    $day='00'; $hour='00'; $min='00';
  }

  $day = (()=>{
    if (yushu && yushu/__day >= 1) {
      const day = _.floor(yushu/__day)
      yushu = yushu%__day
      return day
    }
    else { yushu = yushu%__day }
  })()
  if ($day && $day<10) $day = '0'+$day
  if (yushu == 0) {
    $hour='00'; $min='00';
  }

  $hour = (()=>{
    if (yushu && yushu/__hour >= 1) {
      const hour = _.floor(yushu/__hour)
      yushu = yushu%__hour
      return hour
    }
    else { yushu = yushu%__hour }
  })()
  if ($hour && $hour<10) $hour = '0'+$hour
  if (yushu == 0) {
    $min='00';
  }

  $min = (()=>{
    if (yushu && yushu/__min >= 1) {
      const min = _.floor(yushu/__min)
      yushu = yushu%__min
      return min
    }
    else { yushu = yushu%__min }
  })()
  if ($min && $min<10) $min = '0'+$min
  if (yushu == 0) {
    yushu='00';
  }

  xsecond = yushu
  if (xsecond && xsecond<10 && xsecond!='00') xsecond = '0'+xsecond
  const _second = __second

  return {
    differ: diff,
    $seconds: _second,
    seconds: xsecond,
    minute: $min,
    hour: $hour,
    day: $day,
    month: $month,
    year: ''
  }
}

timeDiff.ago = function(dif){
  if (typeof dif === 'string'){
    if (dif.indexOf('-')>-1 && dif.indexOf(':')>-1 ) dif = convTimestamp(dif);
    dif = parseFloat(dif)
  }

  var date = new Date().Format("yyyy-MM-dd hh:mm:ss")
  // var now = Date.parse(date)
  var now = convTimestamp(date)
  return timeDiff(now, dif)
}

timeDiff.will = function(dif){
  if (typeof dif === 'string'){
    if (dif.indexOf('-')>-1 && dif.indexOf(':')>-1 ) dif = convTimestamp(dif);
    dif = parseFloat(dif)
  }

  var date = new Date().Format("yyyy-MM-dd hh:mm:ss")
  var now = convTimestamp(date)
  return timeDiff(now, dif)
}

timeDiff.add = function(seconds){
  var date = new Date().Format("yyyy-MM-dd hh:mm:ss")
  var now = convTimestamp(date)
  var will = now+(seconds*1000)
  return timeDiff(now, will)
}

/*
 * 返回和现在时间的时间差
 * ago {String}  timestamp 必须为时间戳
 * cb {function}  回调函数，用户自定义返回值
 */
function timeAgo(ago, cb){
  var _time = timeDiff.ago(ago)
  var _date = new Date(_time.target)
  var _now = new Date(_time.now)

  // 用户自行处理时间数据
  if (cb && typeof cb==='function'){
      return cb(_time)
  }

  var diff = _time.diff
  diff.seconds = parseInt(diff.seconds)
  diff.minute = parseInt(diff.minute)
  diff.hour = parseInt(diff.hour)
  diff.month = parseInt(diff.month)
  diff.year = parseInt(diff.year)

  if (diff.year >=1) {
    return _date.Format("yyyy-MM-dd")
  }

  if (diff.month>=1){
    return _date.Format("yyyy-MM-dd")
  }

  if (diff.seconds>=1 && diff.seconds<60){
    var _time = _date.Format("ss")
    return _time+'秒前'
  }

  if (diff.minute>=1 && diff.minute<60){
    var _time = _date.Format("mm")
    return _time+'分钟前'
  }

  if (diff.hour>=1 && diff.hour<12){
    var _time = _date.Format("mm")
    return _time+'小时前'
  }

  if (diff.$seconds < (24*3600)) {
    var _curHour = parseInt(_now.Format('h'))
    var _time = _date.Format("hh:mm")
    if (diff.hour > _curHour) return '昨天 '+_time
    return '今天'+_time
  }

  if (diff.$seconds > (24*3600) && diff.$seconds < (2*24*3600)) {
    var _time = _date.Format("hh:mm")
    return '前天 ' + _time
  }
}

/*
 * "2010-03-15 10:30:00" 时间转时间戳
 * 兼容pc/ios/android
 * @time  {String}  "2010-03-15 10:30:00"
 */
function convTimestamp(time){
  var arr = time.split(/[- :]/),
      _date = new Date(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]),
      timeStr = Date.parse(_date);
  return timeStr
}

module.exports = {
  timeDiff: timeDiff,
  timeAgo: timeAgo,
  countDown: countDown,
  convTimestamp: convTimestamp
}
