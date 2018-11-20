const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var user_id = ctx.request.query.user_id
  var food_order_id = ctx.request.query.food_order_id
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  if (hour < 10)
    hour = '0' + hour
  var minute = date.getMinutes()
  if (minute < 10)
    minute = '0' + minute
  var take_order_time = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute 
  var orderinfo = {
    user_id: user_id,
    food_order_id: food_order_id,
    state: 1,
    take_order_time: take_order_time
  }
  await mysql("foodOrder").update({ food_order_state: 1 }).where({ food_order_id })
  var res = await mysql("orderinfo").insert(orderinfo)
  ctx.state.data = res
}