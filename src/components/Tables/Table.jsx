import React from 'react';
import './Table.css';

function Table({
  columns, data, loading, renderActions, sortField, sortOrder, setSortField, setSortOrder
}) {
  return (
    <div className='overflow-x-auto h-[50vh] overflow-y-auto'>
      <table className='w-full border-collapse text-sm'>
        <thead className='border-y-[1.5px] border-gray-400'>
          <tr>
            <th className='p-2 text-left hash'>#</th>

            {columns.map(({ label, field }) => (
              <th
                key={field}
                className='p-2 text-left titleTable cursor-pointer'
                onClick={() => {
                  if (!setSortField) return;

                  if (sortField === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField(field);
                    setSortOrder('asc');
                  }
                }}
               >
                {label}
                {sortField === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}

            {renderActions && (
              <th className='p-2 text-left act'>Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className='border-b animate-pulse'>
                {Array.from({ length: columns.length + 2 }).map((_, j) => (
                  <td key={j} className='p-2 bg-gray-100 h-6'></td>
                ))}
              </tr>
            ))
            : data.map((row, index) => (
              <tr key={row._id} className='border-b hover:bg-gray-100'>
                <td className='p-2'>{index + 1 }</td>

                {columns.map(({ field, render}) => (
                  <td key={field} className='p-2'>
                    {render ? render(row) : row[field]}
                  </td>
                ))}

                {renderActions && (
                  <td className='p-2'>
                    {renderActions(row)}
                  </td>
                )}
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default Table