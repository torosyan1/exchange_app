import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import ReactTableUI from 'react-table-ui';
import axios from 'axios';
import SelectLabels from '../utils/options';

import './style.css';
import { addHoursToDate } from '../helpers/dateValidation';

const DataTable = () => {
    const [data, setData] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(0); // Start from page 0
    const [pageCount, setPageCount] = useState(0); // Initially set to 0
    const tableInstanceRef = useRef(null);

    const fetchData = useCallback(async (pageSize, pageIndex) => {
        try {
            const offset = pageIndex * pageSize;
            const response = await axios.get('http://51.20.225.234:6990/api/getData', {
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
            { Header: 'First Name', accessor: 'first_name' },
            { Header: 'Last Name', accessor: 'last_name' },
            { Header: 'Bank Card Number', accessor: 'bank_card_number' },
            { Header: 'Bank Name', accessor: 'bank_name' },
            { Header: 'ID Number', accessor: 'id_number' },
            { Header: 'Files', accessor: 'files', Cell: ({ value }) => JSON.parse(value)?.map((file, i) => <a href={file} key={i}>{i}</a>) },
            { Header: 'Telegram ID', accessor: 'telegram_id' },
            { Header: 'created_at', accessor: 'created_at',  Cell: ({ value })=>addHoursToDate(value, 0) },
            { Header: 'Status', accessor: 'status', Cell: ({ row }) => <SelectLabels data={row.original} path='auth' /> },
        ],
        []
    );

    const handleTableChange = useCallback((paginationOptions) => {
        const { pageIndex: newPageIndex, pageSize: newPageSize } = paginationOptions;
        setPageIndex(newPageIndex);
        setPageSize(newPageSize - 40);
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

export default DataTable;
