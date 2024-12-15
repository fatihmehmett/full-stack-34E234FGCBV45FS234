import { Button, Input, TableColumnsType } from "antd";
import DataTable from "./components/DataTable";
import { DataType } from "./types/Data-type";
import dayjs from "dayjs";
import { useBaseContext } from "./context/BaseContext";
import { useState } from "react";
import {
  EditOutlined,
  SearchOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import EditModal from "./components/EditModal";

function App() {
  const {
    userData,
    setSearchText,
    searchOnClick,
    createUser,
    updateUser,
    deleteUser,
  } = useBaseContext();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);
  const [mode, setMode] = useState<"edit" | "create">("create");

  const columns: TableColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Surname",
      dataIndex: "surname",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "E-mail",
      dataIndex: "email",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: "30%",
    },
    {
      title: "Age",
      dataIndex: "age",
      width: "30%",
      sorter: (a, b) => a.age - b.age,
    },
    {
      title: "Country",
      dataIndex: "country",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "District",
      dataIndex: "district",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Role",
      dataIndex: "role",
      width: "30%",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Created at",
      dataIndex: "created_at",
      width: "30%",
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</div>,
      sorter: (a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: "Updated at",
      dataIndex: "updated_at",
      width: "30%",
      render: (text) => <div>{dayjs(text).format("DD/MM/YYYY HH:mm:ss")}</div>,
      sorter: (a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      title: "Edit",
      key: "actions",
      width: "10%",
      render: (_, record) => (
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        ></Button>
      ),
    },
  ];

  const handleEdit = (record: DataType) => {
    setSelectedRecord(record);
    setMode("edit");
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedRecord(null);
    setMode("create");
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedRecord(null);
  };

  const handleSave = async (newData: DataType) => {
    if (mode === "edit" && selectedRecord) {
      await updateUser(newData, selectedRecord.id);
    } else if (mode === "create") {
      await createUser(newData);
    }
    handleCloseModal();
  };

  return (
    <div
      style={{
        margin: 20,
        backgroundColor: "#e2e2e2",
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Button
        type="primary"
        onClick={handleCreate}
        style={{ marginBottom: "16px" }}
        icon={<UserAddOutlined />}
        size="large"
      >
        Create New User
      </Button>
      <div
        style={{
          marginBottom: 16,
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        <Input
          placeholder="Search ..."
          allowClear
          size="large"
          onChange={handleChange}
        />
        <Button
          type="primary"
          size="large"
          icon={<SearchOutlined />}
          onClick={searchOnClick}
        >
          Search
        </Button>
      </div>
      <DataTable columns={columns} data={userData} />
      <EditModal
        visible={isModalVisible}
        record={selectedRecord}
        onClose={handleCloseModal}
        onSave={handleSave}
        mode={mode}
        onDelete={deleteUser}
      />
    </div>
  );
}

export default App;
