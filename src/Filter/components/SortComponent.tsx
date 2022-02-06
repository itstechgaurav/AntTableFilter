import { Radio, RadioChangeEvent } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";

import styles from "../styles.module.less";

export enum sortingEnum {
  none = "none",
  asc = "ascend",
  desc = "descend",
}

interface ISortComponentProps {
  sortIn: sortingEnum;
  onChange: (e: RadioChangeEvent) => void;
}

const SortComponent = (props: ISortComponentProps) => {
  const { sortIn, onChange } = props;
  const renderer = () => {
    return (
      <div className={styles.AntTableFilterGroup}>
        <p className={styles.AntTableFilterGroupTitle}>Sort</p>
        <Radio.Group value={sortIn} onChange={onChange}>
          <Radio.Button value={sortingEnum.asc}>
            <ArrowUpOutlined /> Ascending
          </Radio.Button>
          <Radio.Button value={sortingEnum.desc}>
            <ArrowDownOutlined /> Descending
          </Radio.Button>
        </Radio.Group>
        <br />
      </div>
    );
  };

  return renderer();
};

export default SortComponent;
