import * as XLSX from 'xlsx';

export function useExcel() {

  const exportToExcel = (dataArray: any[], fileName: string) => {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(dataArray,{ skipHeader: true }); // dataArray是要导出的数据数组
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1'); // 'Sheet1'是工作表的名称
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveExcelFile(excelBuffer, fileName+'.xlsx'); // 调用保存Excel文件的方法
  }
  const saveExcelFile = (buffer: any, fileName: string) => {
    const data = new Blob([buffer], { type: 'application/octet-stream' });
       const url = URL.createObjectURL(data);
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', fileName);
       document.body.appendChild(link);
       link.click();
       document.body.removeChild(link);
  }

  return {
    exportToExcel
  }
}
