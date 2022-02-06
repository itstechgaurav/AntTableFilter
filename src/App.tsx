import { Component } from "react";
import { Table, Row, Col } from "antd";
import "antd/dist/antd.css";

// filter
import AntTableFilter, {
  FilterData,
  AntTableFilterColumn,
} from "./Filter/index";

class App extends Component {
  state = {
    data: [],
    filters: {} as Record<string, AntTableFilterColumn>,
  };

  updateFilters = (filters: Record<string, AntTableFilterColumn>) => {
    this.setState({ filters });
  };

  getColumns = () => {
    return [
      {
        title: (
          <AntTableFilter
            title="Name"
            dataIndex="name"
            dataSource={this.state.data}
            filters={this.state.filters}
            onFilter={this.updateFilters}
            onClear={this.updateFilters}
          />
        ),
        dataIndex: "name",
        width: 150,
      },
      {
        title: (
          <AntTableFilter
            title="Age"
            dataIndex="age"
            dataSource={this.state.data}
            filters={this.state.filters}
            onFilter={this.updateFilters}
            onClear={this.updateFilters}
            config={{
              showSearch: false,
              showSelection: false,
            }}
          />
        ),
        dataIndex: "age",
        width: 150,
      },
      {
        title: (
          <AntTableFilter
            title="Gender"
            dataIndex="gender"
            dataSource={this.state.data}
            filters={this.state.filters}
            onFilter={this.updateFilters}
            onClear={this.updateFilters}
            config={{
              showSorting: false,
              showSearch: false,
              showSelection: true,
            }}
          />
        ),
        dataIndex: "gender",
        width: 150,
      },
      {
        title: (
          <AntTableFilter
            title="Address"
            dataIndex="address"
            dataSource={this.state.data}
            filters={this.state.filters}
            onFilter={this.updateFilters}
            onClear={this.updateFilters}
            config={{
              showSorting: false,
              showSelection: false,
            }}
          />
        ),
        dataIndex: "address",
      },
    ];
  };

  componentWillMount() {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        key: i,
        name: i % 2 ? `King ${i}` : `Queen  ${i}`,
        age: 32 + Math.floor(Math.random() * 20),
        gender: i % 2 ? "Male" : "Female",
        address: `London, Park Lane no. ${i}`,
      });
    }
    this.setState({ data });
  }

  render = () => {
    return (
      <Row justify={"space-around"} style={{ marginTop: 100 }}>
        <Col span={15}>
          <h1>Ant-Table Demo with Filters</h1>
          <Table
            columns={this.getColumns()}
            dataSource={FilterData(this.state.data, this.state.filters)}
            pagination={false}
            scroll={{ y: 500 }}
            bordered
          />
        </Col>
      </Row>
    );
  };
}

export default App;
