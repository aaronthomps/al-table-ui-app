import React from 'react'
import './sort-table.css'

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from '@tanstack/react-table'
import { PurchaseOrder } from './Domain'
//import { makeData, Person } from './makeData'
const defaultData: PurchaseOrder[] = [
    {
        purchaseOrderNumber: '11',
        itemName: 'Rock',
        purchasePrice: 24,
        purchaseQuantity: 100,
        itemDescription: 'Big Rock',
        purchaseDetailItemAutoId: 50,
        itemNumber: 123,
        lastModifiedByUser: 'system',
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseOrderNumber: '22',
        itemName: 'Paper',
        purchasePrice: 40,
        purchaseQuantity: 40,
        itemDescription: 'Solid Paper',
        purchaseDetailItemAutoId: 80,
        itemNumber: 234,
        lastModifiedByUser: 'system',
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseOrderNumber: '33',
        itemName: 'Sissors',
        purchasePrice: 45,
        purchaseQuantity: 20,
        itemDescription: 'Sharp sissors',
        purchaseDetailItemAutoId: 10,
        itemNumber: 345,
        lastModifiedByUser: 'system',
        lastModifiedDateTime: new Date(),
    },
]

function SortTable() {
    const [data, setData] = React.useState(() => [...defaultData]);
    const rerender = React.useReducer(() => ({}), {})[1]
    const refreshData = () => setData(() => [...defaultData])
    const [sorting, setSorting] = React.useState<SortingState>([])

    const columns = React.useMemo<ColumnDef<PurchaseOrder>[]>(
        () => [
            {
                accessorKey: 'purchaseOrderNumber',
                cell: info => info.getValue(),
                header: () => <span>PO Nbr</span>,
                //this column will sort in ascending order by default since it is a string column
            },
            {
                accessorFn: row => row.itemName,
                id: 'itemName',
                cell: info => info.getValue(),
                header: () => <span>Item Name</span>,
                sortUndefined: 'last', //force undefined values to the end
                sortDescFirst: false, //first sort order will be ascending (nullable values can mess up auto detection of sort order)
            },
            {
                accessorKey: 'purchasePrice',
                header: () => 'purchasePrice',
                //this column will sort in descending order by default since it is a number column
            },
            {
                accessorKey: 'purchaseQuantity',
                header: () => <span>Qty</span>,
                sortUndefined: 'last', //force undefined values to the end
            },
            {
                accessorKey: 'itemDescription',
                header: 'Item Description',
            },
            {
                accessorKey: 'progress',
                header: 'Profile Progress',
                // enableSorting: false, //disable sorting for this column
            },
            {
                accessorKey: 'itemNumber',
                header: 'Item Number',
                invertSorting: true, //invert the sorting order (golf score-like where smaller is better)
            },
            //   {
            //     accessorKey: 'createdAt',
            //     header: 'Created At',
            //     // sortingFn: 'datetime' //make sure table knows this is a datetime column (usually can detect if no null values)
            //   },
        ],
        []
    )

    //const [data, setData] = React.useState(() => makeData(1_000))
    //const refreshData = () => setData(() => makeData(100_000)) //stress test with 100k rows


    const table = useReactTable({
        columns,
        data,
        debugTable: true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), //client-side sorting
        onSortingChange: setSorting, //optionally control sorting state in your own scope for easy access
        // sortingFns: {
        //   sortStatusFn, //or provide our custom sorting function globally for all columns to be able to use
        // },
        //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
        state: {
            sorting,
        },
        // autoResetPageIndex: false, // turn off page index reset when sorting or filtering - default on/true
        // enableMultiSort: false, //Don't allow shift key to sort multiple columns - default on/true
        // enableSorting: false, // - default on/true
        // enableSortingRemoval: false, //Don't allow - default on/true
        // isMultiSortEvent: (e) => true, //Make all clicks multi-sort - default requires `shift` key
        // maxMultiSortColCount: 3, // only allow 3 columns to be sorted at once - default is Infinity
    })

    //access sorting state from the table instance
    console.log(table.getState().sorting)

    return (
        <div className="p-2">
            <div className="h-2" />
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                className={
                                                    header.column.getCanSort()
                                                        ? 'cursor-pointer select-none'
                                                        : ''
                                                }
                                                onClick={header.column.getToggleSortingHandler()}
                                                title={
                                                    header.column.getCanSort()
                                                        ? header.column.getNextSortingOrder() === 'asc'
                                                            ? 'Sort ascending'
                                                            : header.column.getNextSortingOrder() === 'desc'
                                                                ? 'Sort descending'
                                                                : 'Clear sort'
                                                        : undefined
                                                }
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: ' 🔼',
                                                    desc: ' 🔽',
                                                }[header.column.getIsSorted() as string] ?? null}
                                            </div>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table
                        .getRowModel()
                        .rows.slice(0, 10)
                        .map(row => {
                            return (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            )
                        })}
                </tbody>
            </table>
            <div>{table.getRowModel().rows.length.toLocaleString()} Rows</div>
            <div>
                <button onClick={() => rerender()}>Force Rerender</button>
            </div>
            <div>
                <button onClick={() => refreshData()}>Refresh Data</button>
            </div>
            <pre>{JSON.stringify(sorting, null, 2)}</pre>
        </div>
    )
}

export default SortTable;