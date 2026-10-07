import TableComponent from "../ui/TableComponent";

const DataTable = () => {
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
    },
  ];

  const rows = [
    {
      id: 1,
      name: "Sakshi",
      email: "sakshi@gmail.com",
      mobile: "9876543210",
    },
    {
      id: 2,
      name: "Rahul",
      email: "rahul@gmail.com",
      mobile: "9876543211",
    },
    {
      id: 3,
      name: "Amit",
      email: "amit@gmail.com",
      mobile: "9876543212",
    },
    {
      id: 4,
      name: "Priya",
      email: "priya@gmail.com",
      mobile: "9876543213",
    },
  ];

  return (
    <div className="bg-[#050816] min-h-screen p-6">
      <TableComponent
        title="Users List"
        rows={rows}
        columns={columns}
      />
    </div>
  );
};

export default DataTable;