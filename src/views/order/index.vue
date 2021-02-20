<template>
  <div class="order-main">
    <el-card class="search-box card" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-input v-model="search.username" size="small" placeholder="用户名/模糊查询" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.status" size="small" clearable placeholder="订单状态">
            <!-- 订单状态 0 未付款; 1 已付款 ;  2 已发货; 3: 已收货; 9 申请退款 -->
            <el-option v-for="(v,key) in orderStatusObj" :key="v" :label="v" :value="key" />
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.statusend" size="small" clearable placeholder="是否关闭">
            <el-option label="正在进行" value="0" />
            <el-option label="已关闭" value="1" />
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-button type="default" size="mini" @click="doReset">重置</el-button>
          <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-card class="content box card" shadow="never">
      <el-table v-loading="loading" :data="orderListCom" border stripe>
        <el-table-column fixed type="index" :width="50" />

        <el-table-column fixed align="center" prop="username" label="用户账号" :width="160" />
        <el-table-column align="center" prop="addTime" label="添加时间" :width="200" />
        <el-table-column align="center" label="数量/金额" :width="160">
          <template slot-scope="scope">
            <p>数量: <span style="color: #409EFF">{{ scope.row.count }}</span> </p>
            <p>金额: ¥ <span style="color: #F56C6C">{{ scope.row.price | money }}</span></p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付状态" :width="160">
          <template slot-scope="scope">
            <p v-if="scope.row.orderStatus>'0'" class="icon-payType">
              <svg-icon v-if="scope.row.payType == 'alipay'" style="color:#1296db;" icon-class="ali-pay" />
              <svg-icon v-else-if="scope.row.payType == 'wxpay'" style="color: #3BB430;" icon-class="wx-pay" />
              <svg-icon v-else icon-class="unknow" style="color: #e5e5e5" />

            </p>

            <el-button v-if="scope.row.orderStatus == 0" style="font-size:12px;padding:0 0;" plain size="mini" @click="goDetail(scope.row.orderId)">未付款</el-button>
            <el-button v-if="scope.row.orderStatus == 1" style="font-size:12px;padding:0 0;" plain type="warning" size="mini" @click="goDetail(scope.row.orderId)">已付款</el-button>
            <el-button v-if="scope.row.orderStatus == 2" style="font-size:12px;padding:0 0;" plain type="primary" size="mini" @click="goDetail(scope.row.orderId)">已发货</el-button>
            <el-button v-if="scope.row.orderStatus == 3" style="font-size:12px;padding:0 0;" plain type="success" size="mini" @click="goDetail(scope.row.orderId)">已收货</el-button>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="statusend" label="订单状态" :width="260">
          <template slot-scope="scope">
            <div class="foo">
              <svg-icon v-if="scope.row.statusend == '1'" class="icon-status" style="color:#3BB430;" icon-class="processdone" />
              <svg-icon v-if="scope.row.statusend == '0'" class="icon-status" style="color:#1296db;" icon-class="statusing" />
              <p v-if="scope.row.statusend == '1'" style="color: #999;font-size:14px;">完成时间:{{ scope.row.doneTime }}</p>
            </div>

          </template>
        </el-table-column>
        <el-table-column align="center" prop="orderId" label="订单编号" :width="200" />
        <el-table-column fixed="right" align="center" label="操作" :width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goDetail(scope.row.orderId)">查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>

<script>
import orderApi from '@/api/order/index'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
export default {
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      search: {},
      orderList: [],
      orderStatusObj: {
        '0': '未付款',
        '1': '已付款',
        '2': '已发货',
        '3': '已收货',
        '9': '申请退货'
      }
    }
  },
  computed: {
    orderListCom() {
      var vm = this
      // 对象遍历  修改的是对象本身 隐患:修改了原始数据,可能造成程序在其他地方受影响
      this.orderList.forEach(item => {
        item.orderStatusText = vm.orderStatusObj[item.orderStatus]
        // // 添加了以元为单位的字段
        // item.priceCom = item.price / 100
      })
      return this.orderList
    }
  },
  created() {
    this.getOrderList()
  },
  mounted() {},
  methods: {
    doReset() {},
    doSearch() {},
    goDetail(orderId) {
      this.$router.push({ name: 'orderDetail', params: { orderId }})
    },
    getOrderList() {
      this.loading = true
      const params = {
        ... this.search,
        start: this.page.start,
        limit: this.page.limt
      }
      orderApi.orderList(params)
        .then(res => {
          this.page.totalCount = res.data.totalRow
          this.orderList = res.data.list
          this.loading = false
        }).catch(() => {
          this.loading = false
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getOrderList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getOrderList()
    }
  }
}
</script>

<style scoped lang="scss">
.order-main {
  .icon-payType{
    font-size: 30px;
  }

  // svg图标可以被修改颜色  但是需要设置父类,而且设置svg的path.fill: inherit
  // 处于方便管理,这里在全局样式中 设置了  path { fill: inherit !important }
  // 参考: https://github.com/PanJiaChen/vue-element-admin/issues/330
  ::v-deep .icon-status{
    font-size: 40px;
  }
  p{
    margin-block-start: 4px;
    margin-block-end:4px;
  }
  .card {
    margin: 30px;
  }
  .search-box {
    .el-input {
      width: 200px;
    }
  }
}
</style>
