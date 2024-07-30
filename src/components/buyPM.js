import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import ReactTableUI from "react-table-ui";
import axios from "axios";
import SelectLabels from "../utils/options";
import RefreshIcon from "@mui/icons-material/Refresh";

import "./style.css";
import { addHoursToDate } from "../helpers/dateValidation";
import { IconButton } from "@mui/material";

const BuyPMSellTable = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0); // Start from page 0
  const [pageCount, setPageCount] = useState(0); // Initially set to 0
  const tableInstanceRef = useRef(null);

  const fetchData = useCallback(async (pageSize, pageIndex) => {
    try {
      const offset = pageIndex * pageSize;
      const response = await axios.get(
        "http://51.20.225.234:6990/api/get-buy-data",
        {
          params: {
            limit: pageSize,
            offset: offset,
          },
          headers: { Authorization: localStorage.getItem("token") },
        }
      );
      const data = response.data.data
        .reverse()
        .sort((a, b) => a.status - b.status);
      setData(data);
      setPageCount(Math.ceil(response.data.totoalCount[0].total / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(pageSize, pageIndex);
  }, [fetchData, pageSize, pageIndex]); // Depend on pageSize and pageIndex for fetching data

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "Amount USD", accessor: "amount" },
      {
        Header: "Amount TOMAN",
        accessor: "amount_toman",
        Cell: ({ row }) => row.original.amount * row.original.current_rate,
      },
      { Header: "Current rate", accessor: "current_rate" },
      { Header: "Telegram ID", accessor: "telegram_id" },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: ({ value }) => addHoursToDate(value, 0),
      },
      {
        Header: "Photos",
        accessor: "photo",
        Cell: ({ value }) =>
          JSON.parse(value)?.map((file, i) => (
            <a href={file} key={i}>
              {i}
            </a>
          )),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <SelectLabels data={row.original} path="buy" statusName="Done" />
        ),
      },
    ],
    []
  );

  const handleTableChange = useCallback((paginationOptions) => {
    const { pageIndex: newPageIndex, pageSize: newPageSize } =
      paginationOptions;
    setPageIndex(newPageIndex);
    setPageSize(newPageSize - 40);
  }, []);

  return (
    <>
      <IconButton
        sx={{
          position: "absolute",
          left: "90%",
          zIndex: "50000000000",
          top: "0%",
          color: "white",
        }}
        onClick={() => fetchData(pageSize, pageIndex)}
      >
        <RefreshIcon
          sx={{
            width: "48px",
            height: "48px",
            display: "flex",
            justifyContent: "flex-end",
          }}
        />
      </IconButton>
      <ReactTableUI
        title="Sarafchi Exchange Table"
        data={data}
        columns={columns}
        tableInstanceRef={tableInstanceRef}
        paginationOptions={{
          manualPagination: true,
          pageCount,
          defaultPageSize: 10,
          pageIndex,
          pageSize,
          fetchData: handleTableChange,
        }}
      />
    </>
  );
};

export default BuyPMSellTable;
