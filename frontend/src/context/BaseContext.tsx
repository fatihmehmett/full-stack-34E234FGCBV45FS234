/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";
import { DataType } from "../types/Data-type";
import { message, TablePaginationConfig } from "antd";

interface BaseContextType {
  userData: DataType[];
  getUsers: (
    page: number | undefined,
    pageSize: number | undefined,
    search: string
  ) => Promise<void>;
  createUser: (newData: DataType) => Promise<void>;
  updateUser: (updatedData: Partial<DataType>, id: number) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  pagination: TablePaginationConfig;
  searchText: string;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  searchOnClick: () => void;
}

// Backend API URL
const API_URL = "http://localhost:3000";
axios.defaults.headers.post["Content-Type"] = "application/json;charset=utf-8";
axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

const BaseContext = createContext<BaseContextType | undefined>(undefined);

export const BaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState<DataType[]>([]);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 1,
    total: 100,
  });
  const [searchText, setSearchText] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  const openMessage = (
    type: "loading" | "success" | "error",
    content: string,
    duration: number = 2
  ) => {
    messageApi.open({
      key,
      type,
      content,
      duration,
    });
  };

  const getUsers = useCallback(
    async (
      page: number | undefined,
      pageSize: number | undefined,
      search: string
    ) => {
      const url = `${API_URL}/users?page=${page}&pageSize=${pageSize}&search=${search}`;
      try {
        const response = await axios.get(url);
        setUserData(response.data.data.users);
        setPagination({
          current: response.data.data.page,
          pageSize: response.data.data.pageSize,
          total: response.data.data.totalUserCount,
        });
      } catch (error) {
        console.error("Get Users Data fetch failed:", error);
        if (error instanceof Error) {
          openMessage("error", error.message);
        } else {
          openMessage("error", "Unknown error occurred");
        }
      }
    },
    [openMessage]
  );

  const createUser = async (newData: DataType) => {
    const url = `${API_URL}/users/save`;
    try {
      await axios.post<DataType>(url, newData);
      getUsers(1, 5, "");
      openMessage("success", "User create successfully!");
    } catch (error) {
      if (error instanceof Error) {
        openMessage("error", error.message);
      } else {
        openMessage("error", "Unknown error occurred");
      }
    }
  };

  const updateUser = async (updatedData: Partial<DataType>, id: number) => {
    const url = `${API_URL}/users/update`;
    try {
      await axios.post<DataType>(url, { ...updatedData, id });
      getUsers(1, 5, "");
      openMessage("success", "User update successfully!");
    } catch (error) {
      if (error instanceof Error) {
        openMessage("error", error.message);
      } else {
        openMessage("error", "Unknown error occurred");
      }
    }
  };

  const deleteUser = async (id: number) => {
    const url = `${API_URL}/users/delete`;
    try {
      await axios.delete<DataType>(url, { data: { id } });
      getUsers(1, 5, "");
      openMessage("success", "User delete successfully!");
    } catch (error) {
      console.error("Failed to delete user:", error);
      if (error instanceof Error) {
        openMessage("error", error.message);
      } else {
        openMessage("error", "Unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getUsers(1, 5, "");
  }, []);

  const searchOnClick = useCallback(async () => {
    await getUsers(pagination.current, pagination.pageSize, searchText);
  }, [getUsers, pagination, searchText]);

  return (
    <BaseContext.Provider
      value={{
        userData,
        getUsers,
        createUser,
        updateUser,
        deleteUser,
        pagination,
        searchText,
        setSearchText,
        searchOnClick,
      }}
    >
      {contextHolder}
      {children}
    </BaseContext.Provider>
  );
};

export const useBaseContext = (): BaseContextType => {
  const context = useContext(BaseContext);
  if (!context) {
    throw new Error("useBaseContext must be used within a BaseProvider");
  }
  return context;
};
