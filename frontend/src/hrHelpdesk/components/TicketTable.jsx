import DataTable from 'react-data-table-component';

function TicketTable({ columns, data }) {
    return (
        <div className="rounded-lg overflow-hidden shadow">
            <DataTable
                columns={columns}
                data={data}
                pagination
                highlightOnHover
                responsive
                striped
                dense
            />
        </div>
    )
}

export default TicketTable;