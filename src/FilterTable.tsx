import React from 'react'
import './filter-table.css'
import { PurchaseOrder } from './Domain'

import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    RowData,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import EditModal from './EditModal'

declare module '@tanstack/react-table' {
    //allows us to define custom properties for our columns
    interface ColumnMeta<TData extends RowData, TValue> {
        filterVariant?: 'text' | 'range' | 'select'
    }
}


const defaultData: PurchaseOrder[] = [
    {
        purchaseDetailItemAutoId: 1,
        purchaseOrderNumber: "112334",
        itemName: "Banana",
        purchasePrice: 112.19,
        purchaseQuantity: 50,
        itemDescription: "Box of Green Bananas",
        itemNumber: 4011,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseDetailItemAutoId: 2,
        purchaseOrderNumber: "112335",
        itemName: "Gala Apple",
        purchasePrice: 212.33,
        purchaseQuantity: 125,
        itemDescription: "Bag of gala apples",
        itemNumber: 4035,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseDetailItemAutoId: 3,
        purchaseOrderNumber: "112334",
        itemName: "Kiwis",
        purchasePrice: 153.88,
        purchaseQuantity: 100,
        itemDescription: "Bag of kiwis",
        itemNumber: 4030,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseDetailItemAutoId: 4,
        purchaseOrderNumber: "112335",
        itemName: "Kiwis",
        purchasePrice: 109.88,
        purchaseQuantity: 76,
        itemDescription: "Bag of kiwis",
        itemNumber: 4030,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseDetailItemAutoId: 5,
        purchaseOrderNumber: "112335",
        itemName: "Banana",
        purchasePrice: 67.45,
        purchaseQuantity: 26,
        itemDescription: "Box of Green Bananas",
        itemNumber: 4011,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    },
    {
        purchaseDetailItemAutoId: 6,
        purchaseOrderNumber: "112335",
        itemName: "Kiwis",
        purchasePrice: 122.88,
        purchaseQuantity: 90,
        itemDescription: "Bag of kiwis",
        itemNumber: 4030,
        lastModifiedByUser: "system",
        lastModifiedDateTime: new Date(),
    }
]

function FilterTable() {
    const [modelData, setModalData] = React.useState<PurchaseOrder | null>(null)
    const [nextId, setNextId] = React.useState(defaultData[defaultData.length - 1].purchaseDetailItemAutoId + 1);

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

    const handleSave = (updateData: PurchaseOrder) => {
        setData(prev =>
            prev.map(row => (row.purchaseDetailItemAutoId === updateData.purchaseDetailItemAutoId ? updateData : row)));
        // close modal
        setModalData(null);
    }

    const handleAddRowClick = () => {
        const newRow: PurchaseOrder = {
            purchaseDetailItemAutoId: nextId,
            itemDescription: '',
            itemName: '',
            itemNumber: 0,
            purchaseOrderNumber: '',
            purchasePrice: 0,
            purchaseQuantity: 0,
            lastModifiedByUser: 'system',
            lastModifiedDateTime: new Date(),
        }
        setNextId(prev => prev + 1);
        setData(prev => [...prev, newRow]);
        // open modal
        setModalData(newRow);
    }

    const columns = React.useMemo<ColumnDef<PurchaseOrder, any>[]>(
        () => [
            {
                accessorKey: 'purchaseDetailItemAutoId',
                cell: info => (
                    <span
                        style={{ color: 'blue', cursor: 'pointer' }}
                        onClick={() => setModalData(info.row.original)}
                    >{info.getValue()}</span>),
                header: 'ID',
            },
            {
                accessorKey: 'purchaseOrderNumber',
                cell: info => info.getValue(),
                header: 'PO Nbr',
            },
            {
                accessorFn: row => row.itemName,
                id: 'itemName',
                cell: info => info.getValue(),
                header: () => <span>Item Name</span>,
            },
            {
                accessorKey: 'purchasePrice',
                header: () => 'Price',
                meta: {
                    filterVariant: 'range',
                },
            },
            {
                accessorKey: 'purchaseQuantity',
                header: () => <span>Qty</span>,
                meta: {
                    filterVariant: 'range',
                },
            },
            {
                accessorKey: 'itemDescription',
                header: 'Item Description',
            },
            {
                accessorKey: 'itemNumber',
                header: 'Item Number',
                meta: {
                    filterVariant: 'range',
                },
            },
            {
                accessorKey: 'lastModifiedByUser',
                header: 'Modified By User',
            },
            {
                accessorKey: 'lastModifiedDateTime',
                header: 'Modified Date',
                cell: ({ getValue }) => {
                    const datetime = new Date(getValue());
                    return datetime.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
                  },
                  enableColumnFilter: false, // disable column filtering for this column
            },
        ],
        []
    )

    const [data, setData] = React.useState<PurchaseOrder[]>(() => [...defaultData])

    const table = useReactTable({
        data,
        columns,
        filterFns: {},
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(), //client side filtering
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <div className="p-2">
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder ? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
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
                                                {header.column.getCanFilter() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
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
            <div className="h-2" />
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                        {table.getState().pagination.pageIndex + 1} of{' '}
                        {table.getPageCount()}
                    </strong>
                </span>
                <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                        type="number"
                        min="1"
                        max={table.getPageCount()}
                        defaultValue={table.getState().pagination.pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            table.setPageIndex(page)
                        }}
                        className="border p-1 rounded w-16"
                    />
                </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
            <div>{table.getPrePaginationRowModel().rows.length} Rows</div>
            <div>
                <button onClick={handleAddRowClick}>Add Row</button>
            </div>
            {modelData && (
                <EditModal
                    onClose={() => setModalData(null)}
                    data={modelData}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

function Filter({ column }: { column: Column<any, unknown> }) {
    const columnFilterValue = column.getFilterValue()
    const { filterVariant } = column.columnDef.meta ?? {}

    return filterVariant === 'range' ? (
        <div>
            <div className="flex space-x-2">
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[0] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [value, old?.[1]])
                    }
                    placeholder={`Min`}
                    className="w-24 border shadow rounded"
                />
                <DebouncedInput
                    type="number"
                    value={(columnFilterValue as [number, number])?.[1] ?? ''}
                    onChange={value =>
                        column.setFilterValue((old: [number, number]) => [old?.[0], value])
                    }
                    placeholder={`Max`}
                    className="w-24 border shadow rounded"
                />
            </div>
            <div className="h-1" />
        </div>
    ) : filterVariant === 'select' ? (
        <select
            onChange={e => column.setFilterValue(e.target.value)}
            value={columnFilterValue?.toString()}
        >
            <option value="">All</option>
            <option value="complicated">complicated</option>
            <option value="relationship">relationship</option>
            <option value="single">single</option>
        </select>
    ) : (
        <DebouncedInput
            className="w-36 border shadow rounded"
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            type="text"
            value={(columnFilterValue ?? '') as string}
        />
    )
}

// A typical debounced input react component
function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = React.useState(initialValue)

    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export default FilterTable;