import moment from 'moment'

const DateUtil = {
	/* 获取当前日期-带时分秒 */
	getNowFormatDateTime: function () {
		var now = moment()
		return now.format('YYYY-MM-DD HH:mm:ss')
	},
	/* 获取当前日期-不带时分秒 */
	getNowFormatDate: function () {
		var now = moment()
		return now.format('YYYY-MM-DD')
	},
	getNowFormatTime: function () {
		var now = moment()
		return now.format('HH:mm:ss')
	},
	/* date 可以是时间戳、日期字符串、Date对象 */
	formatDate: function (date, format) {
		var day = moment(date)
		if (day.isValid()) {
			return day.format(format)
		} else {
			return date
		}
	},
	getYear: function (date) {
		var day = moment(date)
		if (day.isValid()) {
			return day.year()
		} else {
			return ''
		}
	},
	getQuarter: function (date) {
		var day = moment(date)
		if (day.isValid()) {
			return day.quarter()
		} else {
			return ''
		}
	},
	getMonth: function (date) {
		var day = moment(date)
		if (day.isValid()) {
			return day.month() + 1
		} else {
			return ''
		}
	},
	/* 增加指定的时间 */
	addDays: function (day, date) {
		return moment(date).add(day, 'days')
	},
	addMonths: function (month, date) {
		return moment(date).add(month, 'months')
	},
	addQuarter: function (quarter, date) {
		return moment(date).add(quarter, 'quarters')
	},
	addYears: function (year, date) {
		return moment(date).add(year, 'years')
	},
	/* 减去指定的时间 */
	subtractDays: function (day, date) {
		return moment(date).subtract(day, 'days')
	},
	subtractMonths: function (month, date) {
		return moment(date).subtract(month, 'months')
	},
	subtractQuarter: function (quarter, date) {
		return moment(date).subtract(quarter, 'quarters')
	},
	subtractYears: function (year, date) {
		return moment(date).subtract(year, 'years')
	},
	/* 获取两个日期相差天数 */
	getDays: function (startDate, endDate) {
		var start = moment(startDate)
		var end = moment(endDate)
		return Math.abs(start.diff(end, 'days'))
	},
	/* 以给定时间为基准，前bef年、后aft年 */
	getYearsByDistance: function (bef, aft) {
		var date = new Date()
		var year = date.getFullYear()
		var years = []
		for (var i = year + aft; i >= (year - bef); i--) {
			years.push({
				'id': i,
				'text': i
			})
		}
		return years
	},
  // 日期转时间戳
  dateToTime: function (date) {
    return moment(date).valueOf() / 1000
  },
  // 时间戳转日期
  timeToDate: function (time) {
    return moment.unix(time)
  }
}

export default DateUtil
