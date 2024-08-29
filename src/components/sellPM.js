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
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ApiForm from "./singleMessages";
import SendIcon from "@mui/icons-material/Send";

import "./style.css";
import { addHoursToDate } from "../helpers/dateValidation";

const SellPMTable = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0); // Start from page 0
  const [pageCount, setPageCount] = useState(0); // Initially set to 0
  const tableInstanceRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedTelegramId, setSelectedTelegramId] = useState("");

  const fetchData = useCallback(async (pageSize, pageIndex) => {
    try {
      const offset = pageIndex * pageSize;
      const response = await axios.get(
        "http://51.20.225.234:6990/api/get-sell-data",
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
    const interval = setInterval(()=>fetchData(pageSize, pageIndex), 10000); // Polling every 10 seconds

    return () => clearInterval(interval); // Clean up interval on component unmount
  }, [fetchData, pageSize, pageIndex]); // Depend on pageSize and pageIndex for fetching data

  const handleClose = () => {
    setOpen(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
const handleStatusChange = (id, newStatus) => {
  setData((prevData) => 
    prevData.map((item) => 
      item.id === id ? { ...item, status: newStatus } : item
    )
  );
};

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
      { Header: "Vaucher code", accessor: "vaucher_code" },
      { Header: "Vaucher code", accessor: "activation_code" },
      { Header: "Telegram ID", accessor: "telegram_id" },
      {
        Header: "created_at",
        accessor: "created_at",
        Cell: ({ value }) => addHoursToDate(value, 0),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <SelectLabels
            data={row.original}
            path="sell" 
            statusName="Done"
            onStatusChange={(newStatus) => handleStatusChange(row.original.id, newStatus)}
          />
        ),
      },
      {
        Header: "Send Message",
        accessor: "send_message",
        Cell: ({ row }) => (
          <IconButton
            color="primary"
            onClick={() => handleClickOpen(row.original.telegram_id)}
          >
            <SendIcon />
          </IconButton>
        ),
      },
    ],
   [handleStatusChange]);


  const handleTableChange = useCallback((paginationOptions) => {
    const { pageIndex: newPageIndex, pageSize: newPageSize } =
      paginationOptions;
    setPageIndex(newPageIndex);
    setPageSize(newPageSize - 40);
  }, []);

  const handleClickOpen = (telegramId) => {
    setSelectedTelegramId(telegramId);
    setOpen(true);
  };
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
            <Dialog open={open} onClose={handleClose}>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            <CloseIcon color="primary" sx={{ width: "36px", height: "36px" }} />
          </Button>
        </DialogActions>
        <DialogContent>
          <ApiForm
            selectedTelegramId={selectedTelegramId}
            onClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellPMTable;
