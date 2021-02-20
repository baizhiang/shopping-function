<template>
  <div class="order-back-main">
    <el-card class="search-box card" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-input v-model="search.username" size="small" placeholder="用户名/模糊查询" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.process" size="small" clearable placeholder="订单状态">
            <!-- 进度: 0 等待处理 ; 1 确认退货,等待收货; 2 : 确认收货,已退款 ; 9 : 拒绝退货 -->
            <el-option label="等待处理" value="0" />
            <el-option label="正在处理" value="1" />
            <el-option label="已处理" value="2" />
            <el-option label="拒绝退货" value="9" />
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
      <el-table :data="orderList" border stripe>
        <el-table-column fixed type="index" :width="50" />

        <el-table-column fixed align="center" prop="username" label="用户账号" :width="160" />
        <el-table-column align="center" prop="addtime" label="申请时间" :width="200" />
        <el-table-column align="center" label="数量/金额" :width="160">
          <template slot-scope="scope">
            <p>数量: <span style="color: #409EFF">{{ scope.row.count }}</span> </p>
            <p>金额: ¥ <span style="color: #F56C6C">{{ scope.row.order_price | money }}</span></p>
          </template>
        </el-table-column>

        <!-- <el-table-column align="center" prop="orderStatus" label="订单状态" :width="160"></el-table-column> -->

        <el-table-column align="center" prop="statusend" label="退单状态" :width="300">
          <template slot-scope="scope">
            <!-- process = 2 同意退款 ; process = 9  拒绝退款  ; statusend = 0 进行中 ; statusend = 1 结束 -->
            <svg-icon v-if="scope.row.process == '2'" style="color:#3BB430" class="icon-status" icon-class="agreeback" />
            <svg-icon v-if="scope.row.process == '9'" style="color:#F56C6C;" class="icon-status" icon-class="refuseback" />
            <svg-icon v-if="scope.row.statusend == '1'" style="color:#3BB430" class="icon-status" icon-class="statusend" />
            <svg-icon v-if="scope.row.statusend == '0'" style="color:#1296db;" class="icon-status" icon-class="statusing" />
            <p v-if="scope.row.statusend=='1'" style="color: #999;font-size:14px;">完成时间: {{ scope.row.endtime }}</p>
          </template>
        </el-table-column>
        <!-- <el-table-column align="center" prop="endtime" label="完成时间" :width="160" /> -->
        <el-table-column align="center" prop="orderId" label="订单编号" :width="200" />
        <el-table-column fixed="right" align="center" label="操作" :width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goDetail(scope.row.backId)">查看订单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
  </div>
</template>

<script>
import orderBackApi from '@/api/order/orderBack'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
export default {
  name: 'OrderBack',
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      loading: false,
      search: {},
      orderList: []
    }
  },
  computed: {},
  created() {
    this.getOrderBackList()
  },
  mounted() {},
  methods: {
    doReset() {},
    doSearch() {},
    getOrderBackList() {
      this.loading = true
      const params = {
        ... this.search,
        start: this.start,
        limit: this.limit
      }
      orderBackApi.orderList(params).then(res => {
        this.orderList = res.data.list
        this.page.totalCount = res.data.totalRow
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    goDetail(backId) {
      this.$router.push({ name: 'orderBackDetail', params: { backId }})
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
.order-back-main {
  .card {
    margin: 30px;
  }
  p{
    margin-block-start: 4px;
    margin-block-end:4px;
  }
  .icon-status{
    font-size: 40px;
  }
  .search-box {
    .el-input {
      width: 200px;
    }
  }
}
</style>
