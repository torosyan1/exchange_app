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
import SendIcon from "@mui/icons-material/Send";
import RefreshIcon from "@mui/icons-material/Refresh";
import { addHoursToDate } from "../helpers/dateValidation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ApiForm from "./singleMessages";
import "./style.css";

const DataTable = () => {
  const [data, setData] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0); // Start from page 0
  const [pageCount, setPageCount] = useState(0); // Initially set to 0
  const [open, setOpen] = useState(false);
  const [selectedTelegramId, setSelectedTelegramId] = useState("");

  const tableInstanceRef = useRef(null);

  const fetchData = useCallback(async (pageSize, pageIndex) => {
    try {
      const offset = pageIndex * pageSize;
      const response = await axios.get(
        "http://51.20.225.234:6990/api/getData",
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
        .sort((a, b) => a.verified - b.verified);
      setData(data);
      setPageCount(Math.ceil(response.data.totoalCount[0].total / pageSize));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData(pageSize, pageIndex);
  }, [fetchData, pageSize, pageIndex]); // Depend on pageSize and pageIndex for fetching data

  const handleClickOpen = (telegramId) => {
    setSelectedTelegramId(telegramId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const columns = useMemo(
    () => [
      { Header: "id", accessor: "id" },
      { Header: "First Name", accessor: "first_name" },
      { Header: "Last Name", accessor: "last_name" },
      { Header: "Bank Card Number", accessor: "bank_card_number" },
      { Header: "Bank Name", accessor: "bank_name" },
      { Header: "ID Number", accessor: "id_number" },
      {
        Header: "Files",
        accessor: "files",
        Cell: ({ value }) =>
          JSON.parse(value)?.map((file, i) => (
            <a href={file} key={i}>
              {i}
            </a>
          )),
      },
      { Header: "Telegram ID", accessor: "telegram_id" },
      {
        Header: "created_at",
        accessor: "created_at",
        Cell: ({ value }) => addHoursToDate(value, 0),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => <SelectLabels data={row.original} path="auth" />,
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

export default DataTable;
