import React, { ChangeEvent, Component } from "react";
import { FilterFilled } from "@ant-design/icons";
import { Popover, Button, RadioChangeEvent } from "antd";
import { TooltipPlacement } from "antd/lib/tooltip";
import _ from "lodash";
import styles from "./styles.module.less";

// components
import SortComponent from "./components/SortComponent";
import SearchComponent from "./components/SearchComponent";

enum sortingEnum {
  none = "none",
  asc = "ascend",
  desc = "descend",
}

export interface AntTableFilterColumn {
  dataIndex: string;
  sortIn: sortingEnum;
  searchQuery: string;
  selectedRowKeys?: any[];
}

interface configTypes {
  showSorting?: boolean;
  showSearch?: boolean;
  showSelection?: boolean;
}

interface IAntTableFilterProps {
  dataSource: any[];
  dataIndex: string;
  title: string;
  onFilter?: Function;
  onClear?: Function;
  resetUI?: Function;
  placement?: TooltipPlacement;
  dataIndexType?: "string" | "number";
  config?: configTypes;
  filters: Record<string, AntTableFilterColumn>;
}

interface IAntTableFilterState {
  searchQuery: string;
  sortIn: sortingEnum;
  dataIndex: string;
  selectedRowKeys?: any[];
  config: configTypes;
  isVisible: boolean;
}

class AntTableFilter extends Component<
  IAntTableFilterProps,
  IAntTableFilterState
> {
  constructor(props: IAntTableFilterProps) {
    super(props);
    this.state = {
      searchQuery: "",
      sortIn: sortingEnum.none,
      dataIndex: props.dataIndex,
      selectedRowKeys: [],
      config: {
        showSorting: true,
        showSearch: true,
        showSelection: true,
        ...(props.config ?? {}),
      },
      isVisible: false,
    };
    this.initCurrentFilter(this.props.filters);
  }

  private initCurrentFilter = (
    filters: Record<string, AntTableFilterColumn>
  ) => {
    let currentFilter = filters[this.state.dataIndex];

    if (!currentFilter) {
      currentFilter = this.initEmptyFilter();
    }

    this.setState({
      ...this.state,
      ...currentFilter,
    });
  };

  private getAllUpdatedFilter = () => {
    const filters = this.props.filters;
    filters[this.state.dataIndex] = this.getFilterOptions();
    return filters;
  };

  private initEmptyFilter = () => {
    return {
      dataIndex: this.state.dataIndex,
      sortIn: sortingEnum.none,
      searchQuery: "",
      selectedRowKeys: [],
    } as AntTableFilterColumn;
  };

  private isEmptyFilter = () => {
    let { searchQuery, selectedRowKeys, sortIn } = this.state;
    return (
      selectedRowKeys?.length === 0 &&
      sortIn === sortingEnum.none &&
      searchQuery.trim().length === 0
    );
  };

  private awakeOnFilter = () => {
    const { onFilter } = this.props;
    if (onFilter) onFilter(this.getAllUpdatedFilter(), this.getFilterOptions()); // allFilters, currentFitler;
    this.setState({
      isVisible: false,
    });
  };

  private getFilterOptions = () => {
    const { dataIndex, searchQuery, sortIn, selectedRowKeys } = this.state;
    return {
      dataIndex,
      searchQuery,
      sortIn,
      selectedRowKeys,
    } as AntTableFilterColumn;
  };

  private clearFilters = () => {
    const { onClear } = this.props;
    this.setState(
      {
        ...this.state,
        searchQuery: "",
        sortIn: sortingEnum.none,
        selectedRowKeys: [],
      },
      () => {
        if (onClear)
          onClear(this.getAllUpdatedFilter(), this.getFilterOptions());
        this.setState({
          isVisible: false,
        });
      }
    );
  };

  private onSortChange = ({ target }: RadioChangeEvent) => {
    this.setState({
      sortIn: target.value,
    });
  };

  private rowSelection = () => {
    return {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedKeys: React.Key[], _selectedRows: any[]) =>
        this.setState({ selectedRowKeys: selectedKeys }),
    };
  };

  private onSearchQueryChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      searchQuery: target.value,
    });
  };

  private RenderFooter = () => {
    return (
      <div className="callToAction">
        <Button
          size="small"
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={this.awakeOnFilter}
        >
          Filter
        </Button>
        <Button size="small" onClick={this.clearFilters}>
          Clear
        </Button>
      </div>
    );
  };

  private renderOn = (isVisible: boolean) => () => {
    return (
      <div
        className={`${styles.AntTableFilterTrigger} ${
          isVisible ? styles.AntTableFilterTriggerActive : ""
        } ${this.isEmptyFilter() ? "" : styles.AntTableFilterTriggerFiltered}`}
      >
        <FilterFilled />
      </div>
    );
  };

  private renderFilter = () => {
    const { sortIn, config, searchQuery } = this.state;
    const { title, dataIndex, dataSource, dataIndexType } = this.props;
    const { RenderFooter, onSearchQueryChange, rowSelection } = this;

    return (
      <div className={styles.AntTableFilterContainer}>
        {config.showSorting && (
          <SortComponent sortIn={sortIn} onChange={this.onSortChange} />
        )}
        <SearchComponent
          title={title}
          dataIndex={dataIndex}
          dataIndexType={dataIndexType ?? "string"}
          dataSource={dataSource}
          rowSelection={rowSelection}
          onSearchChange={onSearchQueryChange}
          searchQuery={searchQuery}
          showSelection={config.showSelection ?? false}
          showSearch={config.showSearch ?? false}
        />
        <RenderFooter />
      </div>
    );
  };

  private wrapInPopover = ({
    renderFilter,
    renderOn,
    onVisibleChange,
  }: any) => {
    const { title, placement } = this.props;
    const { isVisible } = this.state;
    return (
      <>
        {title}
        <Popover
          content={renderFilter()}
          trigger={"click"}
          title={
            <div className={styles.AntTableFilterPopOverTitle}>
              {"Filter: " + title}
            </div>
          }
          placement={placement ?? "topLeft"}
          onVisibleChange={onVisibleChange}
          arrowContent={<div>hello</div>}
          popupVisible={isVisible}
          overlayClassName={styles.hidePopOverArrow}
        >
          {renderOn()}
        </Popover>
      </>
    );
  };

  render = () => {
    const { isVisible } = this.state;
    const { wrapInPopover, renderFilter, renderOn } = this;
    return wrapInPopover({
      renderFilter,
      renderOn: renderOn(isVisible),
      onVisibleChange: (visible: boolean) =>
        this.setState({ isVisible: visible }),
    });
  };
}

export default AntTableFilter;

const getFilteredData = (dataSource: any[], filter: AntTableFilterColumn) => {
  const { dataIndex, sortIn, selectedRowKeys } = filter;
  let { searchQuery } = filter;
  searchQuery = searchQuery.trim().toLowerCase();

  if (selectedRowKeys?.length) {
    // do searching for selection only
    dataSource = dataSource.filter((data: any) =>
      selectedRowKeys?.includes(data[dataIndex])
    );
  } else if (searchQuery.length) {
    // do searching on text basis
    dataSource = dataSource.filter(
      (data: any) =>
        data[dataIndex].toString().toLowerCase().indexOf(searchQuery) !== -1 // toString if it is a number
    );
  }

  // if sorting available
  if (sortIn !== sortingEnum.none) {
    dataSource = _.orderBy(
      dataSource,
      [dataIndex],
      [sortIn === sortingEnum.asc ? "asc" : "desc"]
    );
  }

  return dataSource;
};

export const FilterData = (
  dataSource: any[],
  filters: Record<string, AntTableFilterColumn>
) => {
  const filterNames = Object.keys(filters);
  filterNames.forEach((filterName) => {
    dataSource = getFilteredData(dataSource, filters[filterName]);
    if (!dataSource.length) return [];
  });

  return dataSource;
};
