import { Table, Input } from "antd";
import { ChangeEvent } from "react";
import { sortingEnum } from "./SortComponent";

import styles from "../styles.module.less";

interface ISearchComponentProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dataIndex: string;
  dataSource: any[];
  rowSelection: Function;
  title: string;
  dataIndexType: string;
  showSelection: boolean;
  showSearch: boolean;
}

const sortColumn =
  ({ dataIndex, dataIndexType }: ISearchComponentProps) =>
  (firstRecord: any, secondRecord: any) => {
    if (dataIndexType === "number")
      return firstRecord[dataIndex] < secondRecord[dataIndex] ? -1 : 1;
    return [firstRecord[dataIndex], secondRecord[dataIndex]].sort()[0] ===
      firstRecord[dataIndex]
      ? -1
      : 1;
  };

const generateTableColumns = (props: ISearchComponentProps) => {
  const { title, dataIndex } = props;
  const columns: any[] = [
    {
      dataIndex,
      title,
      sorter: sortColumn(props),
      defaultSortOrder: sortingEnum.asc,
    },
  ];

  return columns;
};

const getSelectionTableData = (props: ISearchComponentProps) => {
  const { dataSource, dataIndex } = props;
  let { searchQuery } = props;
  searchQuery = searchQuery.trim().toLowerCase();
  const uniqueDataSourceRecords = dataSource
    .filter(
      (row, index: number) =>
        !(
          (
            dataSource.findIndex(
              (item) => item[dataIndex] === row[dataIndex]
            ) !== index
          ) // [index] current index
        ) // checking if data exists and not equal to current index then don't include, else it is unique record include it
    ) // for unique rows
    .filter((row) => {
      if (!searchQuery.length) return true;
      // if (this.props.dataIndexType === 'number') return row[dataIndex] == searchQuery; // thing about it later
      return (
        row[dataIndex].toString().toLowerCase().indexOf(searchQuery) !== -1
      );
    }); // at last filtering those who we are searching
  return uniqueDataSourceRecords;
};

const SearchComponent = (props: ISearchComponentProps) => {
  const { showSelection, showSearch } = props;
  const renderer = () => {
    return (
      <>
        {showSearch && (
          <div className={styles.AntTableFilterGroup}>
            <p className={styles.AntTableFilterGroupTitle}>Search</p>
            <Input
              placeholder="Type Something"
              value={props.searchQuery}
              onChange={props.onSearchChange}
            />
          </div>
        )}
        {showSelection && (
          <Table
            className={styles.AntTableFilterGroup}
            dataSource={getSelectionTableData(props)}
            columns={generateTableColumns(props)}
            size="small"
            style={{ marginTop: 10, width: 250 }}
            showSorterTooltip={true}
            rowSelection={props.rowSelection()}
            pagination={false}
            scroll={{
              y: 300,
            }}
            rowKey={props.dataIndex}
          ></Table>
        )}
      </>
    );
  };

  return renderer();
};

export default SearchComponent;
