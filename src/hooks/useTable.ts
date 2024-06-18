import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance } from 'element-plus';
import request from '@/api/index.js';

import type { ZimaTable } from '@/types/table.t'

interface Items {
  [key: string]:any
}
interface UseTableOptions {
  baseUrl?: string;
}
export function useTable<T>(options: UseTableOptions) {

  const url = {
    list: options.baseUrl + '/list',
    add: options.baseUrl + '/add',
  } 


  const table:ZimaTable<T> = reactive({
    loading:false,
    data:[],
    total:0,
    filter:{
      pageNo:1,
      pageSize:10
    },
    form:{
      operate:'',
      items:{},
      loading:false,
    }
  })

  const getTableData = ()=>{
    table.loading = true;
    request({
      url:url.list,
      method:'get',
      params: table.filter
    }).then((res) => {
      table.data = res.data
    }).finally(()=>{
      table.loading = false;
    })
  }

  const handleAdd = () => {
    table.form.items = {}
    table.form.operate = 'add'
  }
  const handleEdit = (item:T) => {
    table.form.items =JSON.parse(JSON.stringify(item));
    table.form.operate = 'edit';
  }

  const handleSubmit = async(formEl: FormInstance | undefined)=>{
    table.form.loading = true

    if (!formEl) return
    await formEl.validate((valid, fields) => {
      if (valid) {
        table.form.operate === 'add'?confirmAdd():confirmEdit()
      } else {
        table.form.loading = false
        console.log('error submit!', fields)
      }
    })
  }
  const confirmAdd = () => {
    request.post(url.add, {
      ...table.form.items,
    }
    ).then((res: any) => {
      ElMessage.success(res.data.message)
      closeForm()
      getTableData()
    });
  }

  const confirmEdit = () => {
    request.put('/gallery/edit', {
      ...table.form.items,
    }
    ).then((res: any) => {
      ElMessage.success(res.data.message)
      closeForm()
      getTableData()
    });
  }
  const confirmDelete = (item: Items) => {
    request.delete('/gallery/delete/'+item.id).then((res:any) => {
      ElMessage.success(res.data.message)
      getTableData()
    });
  }
  const closeForm = () => {
    table.form.operate = ''
    table.form.loading = false
  }
  return {
    table,
    getTableData,
    handleAdd,
    handleEdit,
    handleSubmit,
    confirmDelete,
    closeForm
  };
}
