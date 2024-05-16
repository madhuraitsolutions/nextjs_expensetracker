"use client";

import { GetTransactionsHistoryResponseType } from '@/app/api/transactions-history/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { DataTableColumnHeader } from '@/components/datatable/ColumnHeader';
import { DataTableViewOptions } from '@/components/datatable/ColumnToogle';
import { DataTableFacetedFilter } from '@/components/datatable/FacedFilter';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, ColumnFiltersState, SortingState, flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react'

interface Props {
    from: Date;
    to: Date;
}

const emptyData: any[] = [];

type TransactionsHistoryRow = GetTransactionsHistoryResponseType[0];

export const columns: ColumnDef<TransactionsHistoryRow>[] = [
    {
        accessorKey: "category",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Category' />
        ),
        filterFn:(row, id, value) => value.includes(row.getValue(id)),
        cell: ({ row }) => (
            <div className='flex gap-2 capitalize'>
                {row.original.categoryIcon}
                <div className='capitalize'>{row.original.category}</div>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Description' />
        ),
        cell: ({ row }) => (
            <div className='capitalize'>
                {row.original.description}
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Date' />
        ),
        cell: ({ row }) => {
            const date = new Date(row.original.date);
            const formattedDate = date.toLocaleDateString("default", {
                timeZone: "UTC",
                year: "numeric",
                month: "2-digit",
                day: "2-digit"
            });
            return <div className='text-muted-foreground'>{formattedDate}</div>
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Type' className='justify-center' />
        ),
        filterFn:(row, id, value) => value.includes(row.getValue(id)),
        cell: ({ row }) => (
            <div
                className={cn("capitalize rounded-lg text-center p-2", row.original.type === "income" ? "bg-emerald-400/10 text-emerald-500" : "bg-rose-400/10 text-rose-500")} >
                {row.original.type}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Amount' className='justify-center' />
        ),
        cell: ({ row }) => (
            <p className='text-md rounded-lg bg-gray-400/10 p-2 text-center font-medium'>{row.original.formattedAmount}</p>
        ),
    },
]

function TransactionsTable({ from, to }: Props) {

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const history = useQuery<GetTransactionsHistoryResponseType>({
        queryKey: ["transaction", "history", from, to],
        queryFn: () => fetch(`/api/transactions-history?from=${from}&to=${to}`).then((res) => res.json()),
    });

    const table = useReactTable({
        data: history.data || emptyData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const categoriesOptions = useMemo(() => {
        const categoriesMap = new Map();
        history.data?.forEach((transaction) => {
            categoriesMap.set(transaction.category, {
                value: transaction.category,
                label: `${transaction.categoryIcon} ${transaction.category}`,
            });
        });
        const uniqueCategories = new Set(categoriesMap.values());
        return Array.from(uniqueCategories);
    }, [history.data]);

    return (
        <div className='w-full'>
            <div className='flex flex-wrap items-end justify-between gap-2 py-4'>
                <div className="flex gap-2">
                    {table.getColumn("category") && (
                        <DataTableFacetedFilter
                            title="Category"
                            column={table.getColumn("category")}
                            options={categoriesOptions}
                        />
                    )}
                    {table.getColumn("type") && (
                        <DataTableFacetedFilter
                            title="Type"
                            column={table.getColumn("type")}
                            options={[
                                { label: "Income", value: "income" },
                                { label: "Expense", value: "expense" },
                            ]}
                        />
                    )}
                </div>
                <DataTableViewOptions table={table} />
            </div>
            <SkeletonWrapper isLoading={history.isFetching}>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </SkeletonWrapper>
        </div>
    )
}

export default TransactionsTable