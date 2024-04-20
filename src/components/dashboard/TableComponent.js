import React from 'react';

const TableComponent = ({ tableData }) => {
  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Arial, sans-serif', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
      <thead style={{ backgroundColor: '#f8f9fa' }}>
        <tr>
          <th style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center',position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1' }}>Name</th>
          <th style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center',position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1' }}>inception date</th>
          <th style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center',position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1' }}>Start Time</th>
          <th style={{ border: '1px solid #dee2e6', padding: '10px', textAlign: 'center' ,position: 'sticky', top: '0', backgroundColor: 'white', zIndex: '1'}}>Total Time</th>
        
        </tr>
      </thead>
      <tbody>
        {tableData.map((item) => (
          <tr key={item.id}  style={{ backgroundColor: '#f8f9fa' }}>
            <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>{item.name}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>{item.startDate ? item.startDate.toLocaleDateString() : '-'}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>{item.startDate ? item.startDate.toLocaleTimeString() : '-'}</td>
            <td style={{ border: '1px solid #dee2e6', padding: '12px', textAlign: 'center' }}>
              {`${item.totalElapsedTime.hours}:${item.totalElapsedTime.minutes}:${item.totalElapsedTime.seconds}`}
            </td>
       
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableComponent;
