import { Button, Form, Input, Modal } from "antd";
import React from "react";

const EditModal = ({
  visible,
  record,
  onClose,
  onSave,
  mode,
  onDelete,
}: any) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && mode === "edit" && record) {
      form.setFieldsValue(record);
    } else if (visible && mode === "create") {
      form.resetFields();
    }
  }, [visible, record, mode, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSave(values);
      form.resetFields();
    });
  };

  const handleDelete = () => {
    if (record && onDelete) {
      onDelete(record.id);
      form.validateFields().then((values) => {
        form.resetFields();
        onClose();
      });
    }
  };

  return (
    <Modal
      title={mode === "edit" ? "Edit User" : "Create User"}
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      okText={mode === "edit" ? "Save" : "Create"}
      footer={[
        <Button
          key="delete"
          danger
          type="primary"
          onClick={handleDelete}
          style={{ display: mode === "edit" ? "inline-block" : "none" }}
        >
          Delete
        </Button>,
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          {mode === "edit" ? "Save" : "Create"}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter a name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="surname"
          label="Surname"
          rules={[{ required: true, message: "Please enter a surname" }]}
        >
          <Input />
        </Form.Item>
        {mode === "create" && (
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter a password" }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please enter an E-mail",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone" rules={[{ max: 10 }]}>
          <Input />
        </Form.Item>
        <Form.Item name="age" label="Age">
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country" rules={[{ max: 20 }]}>
          <Input />
        </Form.Item>
        <Form.Item name="district" label="District">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Role">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditModal;
