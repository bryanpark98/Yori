import React, { ReactNode, useState } from 'react';
import FormLabel from '../../components/FormLabel/FormLabel';
import styles from './Table.module.css';
import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

type TableColumn = {
  field: string;
  headerName: string;
  width?: string;
};

type TableRow = {
  key: string;
  data: { [field: string]: ReactNode };
  onClick?: () => void;
};

interface TableProps {
  columns: TableColumn[];
  rows: TableRow[];
  rowVerticalPadding?: string;
  rowHorizontalPadding?: string;
  draggable?: boolean;
  onDragRow?: (sourceIndex: number, destinationIndex: number) => void;
}

// TODO: make column with constant
// TODO: make padding
const Table: React.FC<TableProps> = ({
  columns,
  rows,
  draggable,
  onDragRow,
  rowVerticalPadding,
  rowHorizontalPadding
}) => {
  const uniqueId = useState(() => uuidv4())[0];

  function handleDragEnd(result: DropResult) {
    if (!onDragRow || !draggable) return; // Table is not draggable
    if (!result.destination) return;

    onDragRow(result.source.index, result.destination.index);
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="table">
        {(provided) => (
          <table className={styles.table} ref={provided.innerRef} {...provided.droppableProps}>
            <thead>
              <tr>
                {columns.map(({ headerName, width }, columnIndex) => {
                  const isLastColumn = columnIndex === columns.length - 1;
                  const isFirstColumn = columnIndex === 0;
                  return (
                    <th
                      key={headerName}
                      style={{
                        paddingLeft: isFirstColumn ? undefined : rowHorizontalPadding,
                        paddingRight: isLastColumn ? undefined : rowHorizontalPadding,
                        paddingTop: rowVerticalPadding,
                        paddingBottom: rowVerticalPadding,
                        width
                      }}>
                      <FormLabel label={headerName} />
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {rows.map((row, rowIndex) => {
                return (
                  <Draggable
                    isDragDisabled={!(draggable && onDragRow)}
                    key={`${uniqueId}-${row.key}`}
                    draggableId={`${uniqueId}-${row.key}`}
                    index={rowIndex}>
                    {(provided) => (
                      <tr
                        key={`${uniqueId}-tr-${row.key}`}
                        className={`${styles.row} ${
                          row?.onClick !== undefined ? styles.clickableRow : ''
                        }`}
                        onClick={() => {
                          if (row?.onClick) {
                            row.onClick();
                          }
                        }}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}>
                        {columns.map(({ field, width }, columnIndex) => {
                          const isLastColumn = columnIndex === columns.length - 1;
                          const isFirstColumn = columnIndex === 0;
                          return (
                            <td
                              valign="middle"
                              width={width}
                              style={{
                                paddingLeft: isFirstColumn ? undefined : rowHorizontalPadding,
                                paddingRight: isLastColumn ? undefined : rowHorizontalPadding,
                                paddingTop: rowVerticalPadding,
                                paddingBottom: rowVerticalPadding
                              }}
                              key={`${uniqueId}-${row.key}-${field}`}>
                              {row.data[field]}
                            </td>
                          );
                        })}
                      </tr>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </tbody>
          </table>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default Table;
