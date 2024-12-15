import React, { useState } from 'react';
import { Input, Table } from 'antd';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { DataType } from '../types/Data-type';
import { useBaseContext } from '../context/BaseContext';

interface DataTableProps {
  columns: TableColumnsType<DataType>,
  data: DataType[]
}


const DataTable: React.FC<DataTableProps> = ({columns,data}) => {
    const {pagination,getUsers,searchText} = useBaseContext()

    const handleTableChange = async(pagination: TablePaginationConfig) => {
      await getUsers(pagination.current,pagination.pageSize,searchText);
    };

    

    return (
     
        <Table<DataType> rowKey="id" columns={columns} dataSource={data}
         pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ['1', '5', '10', '20', '50', '100'],
          showTotal: (total) => `Total ${total} user`,
        }} 
        onChange={handleTableChange}
        />
    )
};

export default DataTable