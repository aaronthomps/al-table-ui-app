import * as React from 'react'

import './index.css'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'

type Person = {
  purchaseOrderNumber: string
  itemName: string
  purchasePrice: number
  purchaseQuantity: number
  itemDescription: string
  purchaseDetailItemAutoId: number,
  itemNumber: number,
}

const defaultData: Person[] = [
  {
    purchaseOrderNumber: '11',
    itemName: 'Rock',
    purchasePrice: 24,
    purchaseQuantity: 100,
    itemDescription: 'Big Rock',
    purchaseDetailItemAutoId: 50,
    itemNumber: 123,
  },
  {
    purchaseOrderNumber: '22',
    itemName: 'Paper',
    purchasePrice: 40,
    purchaseQuantity: 40,
    itemDescription: 'Solid Paper',
    purchaseDetailItemAutoId: 80,
    itemNumber: 234,
  },
  {
    purchaseOrderNumber: '33',
    itemName: 'Sissors',
    purchasePrice: 45,
    purchaseQuantity: 20,
    itemDescription: 'Sharp sissors',
    purchaseDetailItemAutoId: 10,
    itemNumber: 345,
  },
]

const columnHelper = createColumnHelper<Person>()

const columns = [
  columnHelper.accessor('purchaseOrderNumber', {
    header: "Order #",
    cell: info => info.getValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor(row => row.itemName, {
    id: 'itemName',
    cell: info => <i>{info.getValue()}</i>,
    header: () => <span>Item Name</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor(r=>r.itemNumber, {
    id: 'itemNumber',
    header: () => 'Item',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('purchasePrice', {
    header: () => 'Purchase Price',
    cell: info => info.renderValue(),
    footer: info => info.column.id,
  }),
  columnHelper.accessor('purchaseQuantity', {
    header: () => <span>Qty</span>,
    footer: info => info.column.id,
  }),
  columnHelper.accessor('itemDescription', {
    header: 'itemDescription',
    footer: info => info.column.id,
  }),
  columnHelper.accessor('purchaseDetailItemAutoId', {
    header: 'Id',
    footer: info => info.column.id,
  }),
]

function Table() {
  const [data, _setData] = React.useState(() => [...defaultData])
  const rerender = React.useReducer(() => ({}), {})[1]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  )
}

export default Table;