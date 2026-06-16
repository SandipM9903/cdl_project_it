import { FaEye, FaPen, FaTrash } from 'react-icons/fa';

export const getTicketTableColumns = ({ handleOpen, editTicket, handleDelete, showEditColumn, activeTab }) => [
  {
    name: 'Ticket Id',
    selector: row => row.id,
    wrap: true,
  },
  {
    name: <div style={{ whiteSpace: "normal", textAlign: "center" }}>Ticket Raised By<br />(Emp Name)</div>,
    selector: row => row.raisedByEmpName,
    wrap: true,
    minWidth: "180px"
  },
  {
    name: <div style={{ whiteSpace: "normal", textAlign: "center" }}>Ticket Raised By<br />(Emp Code)</div>,
    selector: row => row.raisedByEmpCode,
    wrap: true,
    minWidth: "180px"
  },
  {
    name: <div style={{ whiteSpace: "normal", textAlign: "center" }}>User Cell<br />No</div>,
    selector: row => row.userCellNo,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: 'Category',
    selector: row => row.category,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: 'SubCategory',
    selector: row => row.subCategory,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: 'Type',
    selector: row => row.ticketClassification,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: 'Severity Level',
    selector: row => row.severity,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: <div style={{ whiteSpace: "normal", textAlign: "center" }}>Turn-Around-<br />Time</div>,
    selector: row => row.timeLine,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: <div style={{ whiteSpace: "normal", textAlign: "center" }}>Ticket Created<br />On Date</div>,
    selector: row => row.createdDate,
    wrap: true,
    minWidth: "150px"
  },
  {
    name: 'Ticket Owner',
    selector: row => row.assignedToEmpName,
    wrap: true,
    minWidth: "150px"
  },
  ...((activeTab === 'tickets' || activeTab === 'assigned' || activeTab === 'team-tickets') ? [
    {
      name: 'Preview',
      center: true,
      minWidth: "120px",
      cell: row => (
        <div>
          <button
            onClick={() => handleOpen(row)}
            title="Preview"
            style={{
              padding: '5px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <FaEye />
          </button>
        </div>
      )
    }
  ] : []),

  ...(activeTab !== 'report' ? [
    {
      name: 'Edit',
      center: true,
      minWidth: "120px",
      cell: row => (
        <div>
          {(row.status === "CLOSED" || row.status === "RESOLVED") ? (
            <span
              title="Edit Disabled"
              style={{
                padding: '5px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'not-allowed',
                opacity: 0.5
              }}
            >
              <FaPen style={{ color: '#424242' }} />
            </span>
          ) : (
            <button
              onClick={() => editTicket(row)}
              title="Edit"
              style={{ padding: '5px' }}
            >
              <FaPen />
            </button>
          )}
        </div>
      )
    }
  ] : []),
  {
    name: 'Status',
    selector: row => row.status,
    center: true,
    minWidth: "150px",
    cell: (row) => (
      <div>
        <button className="statusButton" style={{
          backgroundColor:
            row.status === "CREATED" ? "#007676" :
              row.status === "OPEN" ? "#FDD835" :
                row.status === "INPROGRESS" ? "#90CAF9" :
                  row.status === "CANCELLED" ? "#F44336" :
                    row.status === "RESOLVED" ? "#00C300" :
                      row.status === "CLOSED" ? "#FA7682" : "gray",
          padding: "6px",
          fontWeight: "bold",
          color: "white",
          borderRadius: "5px",
          width: "100px"
        }}>
          {row.status}
        </button>
      </div>
    )
  },
];