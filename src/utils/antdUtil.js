export default {
  setHeaderAlign (column, align = 'center') {
    // 表头行居中
    column.forEach(col => (col.align = align))
    return column
  },
  getSelectedKeys (type, selectedRowKeys, record, rowKey = 'id') {
    let selectKeys = [...selectedRowKeys]
    if (type === 'radio') {
      if (selectKeys.length > 0 && selectKeys.includes(record[rowKey])) {
        selectKeys.splice(selectKeys.indexOf(record[rowKey]), 1)
      } else {
        selectKeys = [record[rowKey]]
      }
    } else if (type === 'checkbox') {
      if (selectKeys.length > 0 && selectKeys.includes(record[rowKey])) {
        selectKeys.splice(selectKeys.indexOf(record[rowKey]), 1)
      } else {
        selectKeys.push(record[rowKey])
      }
    }
    return selectKeys
  },
  getSelectedRows (type, selectedRows, record, rowKey = 'id') {
    let selectRows = [...selectedRows]
    if (type === 'radio') {
      const rowIndex = selectRows.findIndex(row => {
        return row[rowKey] === record[rowKey]
      })

      if (selectRows.length > 0 && rowIndex > -1) {
        selectRows.splice(rowIndex, 1)
      } else {
        selectRows = [record]
      }
    } else if (type === 'checkbox') {
      const rowIndex = selectRows.findIndex(row => {
        return row[rowKey] === record[rowKey]
      })

      if (selectRows.length > 0 && rowIndex > -1) {
        selectRows.splice(rowIndex, 1)
      } else {
        selectRows.push(record)
      }
    }
    return selectRows
  }
}
