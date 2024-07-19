import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactTableUI from 'react-table-ui';
import axios from 'axios';
import SelectLabels from '../utils/options';

import './style.css';

const SellPMTable = () => {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0); // Start from page 0
    const [pageCount, setPageCount] = useState(0); // Initially set to 0
    const tableInstanceRef = useRef(null);

    const fetchData = useCallback(async (pageSize, pageIndex) => {
        try {
            const offset = pageIndex * pageSize;
            const response = await axios.get('http://51.20.225.234:6990/api/get-sell-data', {
                params: {
                    limit: pageSize,
                    offset: offset
                },
                headers: {Authorization: localStorage.getItem('token')}
            });
            const data = response.data.data.reverse().sort((a, b) => a.verified - b.verified);
            setData(data);
            setPageCount(Math.ceil(response.data.totoalCount[0].total / pageSize));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData(pageSize, pageIndex);
    }, [fetchData, pageSize, pageIndex]); // Depend on pageSize and pageIndex for fetching data

    const columns = useMemo(
        () => [
            { Header: 'id', accessor: 'id' },
            { Header: 'Amount', accessor: 'amount' },
            { Header: 'Telegram ID', accessor: 'telegram_id' },
            { Header: 'Current rate', accessor: 'current_rate' },
            { Header: 'Vaucher code', accessor: 'vaucher_code' },
            { Header: 'Vaucher code', accessor: 'activation_code' },
            { Header: 'created_at', accessor: 'created_at' },
            { Header: 'Status', accessor: 'status', Cell: ({ row }) => <SelectLabels data={row.original} path='sell' statusName='Done'  /> },
        ],
        []
    );

    const handleTableChange = useCallback((paginationOptions) => {
        const { pageIndex: newPageIndex, pageSize: newPageSize } = paginationOptions;
        setPageIndex(newPageIndex);
        setPageSize(newPageSize);
    }, []);

    return (
        <ReactTableUI
            title='Sarafchi Exchange Table'
            data={data}
            columns={columns}
            tableInstanceRef={tableInstanceRef}
            paginationOptions={{
                manualPagination: true,
                pageCount,
                defaultPageSize: 10,
                pageIndex,
                pageSize,
                fetchData: handleTableChange
            }}
        />
    );
};

export default SellPMTable;
