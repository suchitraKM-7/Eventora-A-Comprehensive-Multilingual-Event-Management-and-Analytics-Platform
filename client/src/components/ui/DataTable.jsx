import EmptyState from "./EmptyState";

function DataTable({
  columns,
  rows,
  getRowKey,
  emptyTitle,
  emptyMessage,
}) {
  if (rows.length === 0 && emptyTitle) {
    return (
      <EmptyState
        title={emptyTitle}
        message={emptyMessage}
      />
    );
  }

  return (
    <div className="eventora-table-wrapper">

      <table className="eventora-table">

        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={
                getRowKey
                  ? getRowKey(row)
                  : row._id || index
              }
            >
              {columns.map((column) => (
                <td key={column.key}>
                  {column.render
                    ? column.render(row)
                    : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default DataTable;