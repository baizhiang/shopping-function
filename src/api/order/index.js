import request from '@/api/request'

function orderList(data) {
  return request({
    url: '/api/leju/admin/order/list', // 相对路径
    method: 'get',
    data
  })
}
function orderDetail(data) {
  return request({
    url: '/api/leju/admin/order/detail', // 相对路径
    method: 'get',
    data
  })
}
function orderUserInfo(data) {
  return request({
    url: '/api/leju/admin/order/orderUserInfo', // 相对路径
    method: 'get',
    data
  })
}
// 说明: 此接口是前台移动端调用的,这里用于模拟前台添加
// 测试接口
function addOrders(data) {
  return request({
    url: '/api/leju/front/order/addOrders',
    method: 'post',
    data
  })
}

function sendDone(data) {
  return request({
    url: '/api/leju/admin/order/sendDone',
    method: 'get',
    data
  })
}
function closeOrder(data) {
  return request({
    url: '/api/leju/admin/order/closeOrder',
    method: 'get',
    data
  })
}
/**
 * 用于在后台强制"确认收货"
 * @param {*} data
 */
function closeOrderByBack(data) {
  return request({
    url: '/api/leju/admin/order/closeOrderByBack',
    method: 'post',
    data
  })
}

export default {
  orderList,
  orderDetail,
  orderUserInfo,
  addOrders,
  sendDone,
  closeOrder,
  closeOrderByBack
}
