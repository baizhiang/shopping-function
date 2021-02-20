<template>
  <div class="product-main">
    <el-card class="search-box card" shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <el-input v-model="search.gname" size="small" placeholder="商品名称/模糊查询" />
        </el-col>
        <el-col :span="6">
          <el-input v-model="search.pcode" size="small" placeholder="商品编码" />
        </el-col>
        <el-col :span="6">
          <el-select v-model="search.brandId" size="small" clearable placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.id"
              :label="item.cname"
              :value="item.id"
            />
          </el-select>

        </el-col>
        <el-col :span="6">
          <el-select v-model="search.kindId" size="small" clearable placeholder="分类">
            <el-option
              v-for="item in kindList"
              :key="item.id"
              :label="item.ctitle"
              :value="item.id"
            />
          </el-select>

        </el-col>
        <el-col :span="6" :offset="18" class="btn-group">
          <el-button type="default" size="mini" @click="doReset">重置</el-button>
          <el-button type="primary" size="mini" @click="doSearch">搜索</el-button>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="content card" shadow="never">
      <div slot="header">
        <el-button type="primary" @click="goAdd">新增</el-button>
      </div>
      <el-table v-loading="loading" :data="productList" border stripe>
        <el-table-column type="index" fixed :width="50" />
        <el-table-column align="center" fixed prop="gname" label="商品图片" :width="180">
          <template slot-scope="scope">
            <router-link
              :to="{name:'productEdit',params:{id:scope.row.id}}"
            >
              <img class="cover-img" :src="scope.row.cover_img">
            </router-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" :width="380">
          <template slot-scope="scope">
            <p>{{ scope.row.gname }}</p>
            <p>品牌: {{ scope.row.brandName }} | {{ scope.row.brandEname }}</p>
            <p>{{ scope.row.descr }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签" :width="180">
          <template slot-scope="scope">
            <p>
              上架:
              <el-switch v-model="scope.row.isshow" size="small" :active-value="1" :inactive-value="0" @change="switchCode('isshow',scope.row.isshow,scope.row.id)" />
            </p>
            <p>
              最热:
              <el-switch v-model="scope.row.ishot" size="small" :active-value="1" :inactive-value="0" @change="switchCode('ishot',scope.row.ishot,scope.row.id)" />
            </p>
            <p>
              最新:
              <el-switch v-model="scope.row.isnew" size="small" :active-value="1" :inactive-value="0" @change="switchCode('isnew',scope.row.isnew,scope.row.id)" />
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格货号" :width="180">
          <template slot-scope="scope">
            <p>价格: ¥{{ scope.row.price_now | money }}</p>
            <p>货号:{{ scope.row.pcode }}</p>
            <p>排序:{{ scope.row.sort }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ctitles" label="所属分类" :width="180" />
        <el-table-column align="center" label="查看sku" :width="180">
          <template slot-scope="scope">
            <i style="color: #409EFF;" class="el-icon-edit" @click="showSkuList(scope.row)">修改sku</i>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="origin_city" label="原产地" :width="120" />
        <el-table-column align="center" prop="addtime" label="添加时间" :width="160" />
        <el-table-column fixed="right" align="center" label="操作" :width="160">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="goEdit(scope.row.id)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <Pagination :page="page" align="right" @handle-size-change="handleSizeChange" @handle-current-change="handleCurrentChange" />
    </el-card>
    <el-dialog
      :title="tempSkuObj.title"
      :visible.sync="dialog"
      width="40%"
      @close="handleSkuClose"
    >
      <el-table :data="tempSkuObj.skuList" border stripe>
        <el-table-column prop="color_text" label="颜色" :width="120" />
        <el-table-column prop="color" label="色值" :width="120" />
        <el-table-column label="sku编码" :width="200">
          <template slot-scope="scope">
            <el-input v-model="scope.row.sku_code" size="mini" placeholder="自定义sku编码" />
          </template>
        </el-table-column>
        <el-table-column label="价格" :width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" size="mini" placeholder="价格,单位:分" />
          </template>
        </el-table-column>
        <el-table-column label="库存" :width="160">
          <template slot-scope="scope">
            <el-input v-model="scope.row.count" size="mini" />
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="160">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="doSaveSku(scope.row)"
            >提交修改</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-dialog>

  </div>
</template>

<script>
import productApi from '@/api/product/index'
import skuApi from '@/api/product/sku'
import Pagination from '@/components/MyPagination'
import pageMixin from '@/mixins/pageMixin'
import brandApi from '@/api/brand'
import kindApi from '@/api/product/kind'
import _ from 'lodash'
export default {
  name: 'Product',
  components: {
    Pagination
  },
  mixins: [pageMixin],
  data() {
    return {
      dialog: false,
      loading: false,
      search: {},
      productList: [],
      brandList: [], // 品牌
      kindList: [],
      tempSkuObj: {
        title: '',
        id: '',
        skuList: []
      }
    }
  },
  computed: {},
  created() {
    this.getBrandListAll()
    this.getProductList()
    this.getKindList()
  },
  mounted() {},
  methods: {
    getProductList() {
      this.loading = true
      let params = {
        ... this.search,
        start: this.page.start,
        limit: this.page.limit
      }
      params = _.pickBy(params, item => item)
      productApi.productList(
        params
      ).then(res => {
        this.loading = false
        this.productList = res.data.list
        this.page.totalCount = res.data.totalRow
      })
    },
    doSearch() {},
    doReset() {},
    goAdd() {
      this.$router.push({ name: 'productAdd' })
    },
    goEdit(id) {
      this.$router.push({ name: 'productEdit', params: { id }})
    },
    showSkuList(row) {
      this.dialog = true
      skuApi.skuList({
        productId: row.id
      }).then(res => {
        this.tempSkuObj = {
          id: row.id,
          title: row.gname,
          skuList: res.data
        }
      })
    },
    handleSkuClose() {
      this.tempSkuObj = {
        title: '',
        id: '',
        skuList: []
      }
      this.dialog = false
    },
    doSaveSku(sku) {
      skuApi.saveOrUpdate(sku)
        .then(res => {
          if (res.code == 'success') {
            this.$message.success('更新成功!')
          } else {
            this.$message.error('更新失败!')
          }
        })
    },
    switchCode(code, v, id) {
      var obj = {
        id
      }
      obj[code] = v
      productApi.switchCode(obj)
        .then(res => {
          if (res.code == 'success') {
            this.$message.success('更新成功!')
          } else {
            this.$message.error('更新失败!')
          }
        })
    },
    handleSizeChange(v) {
      this.page.limit = v
      this.getProductList()
    },
    handleCurrentChange(v) {
      this.page.start = v
      this.getProductList()
    },
    getBrandListAll() {
      brandApi.brandListAll()
        .then(res => {
          this.brandList = res.data
        })
    },
    getKindList() {
      kindApi.kindList()
        .then(res => {
          this.kindList = res.data
        })
    }

  }
}
</script>

<style scoped lang="scss">
.product-main {
  .card {
    margin: 30px;
  }
  .search-box {
    .el-input {
      width: 200px;
    }
    .btn-group{
      margin-top: 30px;
      text-align: right;
      box-sizing: border-box;
    }
  }
  .cover-img{
    width: 100px;
    height: 100px;
  }
}
</style>
