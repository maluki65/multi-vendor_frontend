import React from 'react';
import './Tabs.css';

function TableSkeleton({
  columns = [],
  rows = 6,
}) {
  return (
    <table className='w-full border-[1.4px] border-gray-300 border-separate border-spacing-0 rounded-lg overflow-hidden mt-4'>
      <thead>
        <tr className='bg-gray-200 text-left text-sm text-gray-600'>
          {columns.map((column, index) => (
            <th
              key={index}
              className='p-3'
            >
              {column}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {[...Array(rows)].map((_, rowIndex) => (
          <tr
            key={rowIndex}
            className='[&>td]:border-b-[1.2px] [&>td]:border-gray-300'
          >
            {columns.map((_, colIndex) => (
              <td
                key={colIndex}
                className='p-3'
              >
                <div className='h-4 w-full max-w-[120px] rounded bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer' />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableSkeleton;