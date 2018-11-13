const { mysql } = require('../qcloud')

module.exports = async ctx => {
  var addr_id = ctx.request.query.addr_id
  var orders = JSON.parse(ctx.request.query.orders)
  var cost = ctx.request.query.cost
  var shop_id = ctx.request.query.shop_id
  var state = 1

  var user_id = ctx.request.query.user_id
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var food_order_time = year + '年' + month + '月' + day + '日 ' + hour + ':' + minute 
  //var food_order_time = ""+year+month+day

  var foodOrder = {
    //food_order_id: null,
    food_order_time: food_order_time,
    user_id: user_id,
    total_cost: cost,
    food_order_state: state,
    address_id: addr_id
  }
  var res = await mysql("foodOrder").insert(foodOrder)
  var res1 = await mysql("foodOrder").select("food_order_id").where({ food_order_time, user_id })
  var length = orders.length
  var ret = ""
  for (var i = 0; i < length; i++){
    var good_id = orders[i].foodid
    var foodOrderDetail = {
      food_order_id: res1[res1.length-1].food_order_id,
      good_id: good_id,
      good_order_num: orders[i].numb
    }
    ret+= await mysql("foodOrderDetail").insert(foodOrderDetail)
  }
``//修改默认地址
  var res1 = await mysql("contactInfo").where({user_id:user_id,default_address:1}).update({default_address:0})
  var res2 = await mysql("contactInfo").where({user_id:user_id,address_id:addr_id}).update({default_address:1})

  ctx.state.data = ret
}