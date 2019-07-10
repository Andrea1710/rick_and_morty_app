import React, { Component } from "react";
// Import UI Components from Libraries
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import { Pagination, Card, Progress } from "antd";
import "antd/dist/antd.css";
// Import base URL for fetching data
import { baseURL } from "../../constants/baseUrl";
// Import Custom CSS Style
import "./ListGrid.css";

class ListGrid extends Component {
  state = {
    data: [],
    search: "",
    filteredData: [],
    page: 1,
    selectedChar: null,
    count: {
      mCount: 0,
      fCount: 0,
      uCount: 0
    }
  };

  componentDidMount() {
    const { page } = this.state;
    this.fetchData(page);
  }

  // Function to fetch data from API
  fetchData = page => {
    fetch(`${baseURL}?page=${page}`)
      .then(res => res.json())
      .then(resData => {
        const data = resData.results;
        this.setState({ data, selectedChar: null, filteredData: [] });
        this.onCount();
      });
  };

  // Function to count characters based on Gender
  onCount = () => {
    const { data } = this.state;

    const maleCount = data.filter(m => {
      return m.gender === "Male";
    });

    const femaleCount = data.filter(f => {
      return f.gender === "Female";
    });

    const unknownCount = data.filter(u => {
      return u.gender === "unknown";
    });

    let mCount = maleCount.length;
    let fCount = femaleCount.length;
    let uCount = unknownCount.length;

    this.setState({
      count: { mCount, fCount, uCount }
    });
  };

  // Function to filter Characters from Search Bar
  filterList = event => {
    const { data } = this.state;

    let filteredData;
    filteredData = data.filter(item => {
      return (
        item.name.toLowerCase().search(event.target.value.toLowerCase()) !== -1
      );
    });

    if (event.target.value === "") {
      this.setState({ filteredData: [] });
    } else {
      this.setState({ filteredData });
    }
  };

  render() {
    const { data, filteredData, page, selectedChar } = this.state;
    const { mCount, fCount, uCount } = this.state.count;

    let maleCount = (mCount / 20) * 100;
    let femaleCount = (fCount / 20) * 100;
    let unknownCount = (uCount / 20) * 100;

    // If we have filtered data, we show it on the Screen
    let filtered;
    if (filteredData) {
      filtered = (
        <div>
          <div className="searched" style={{ margin: 10 }}>
            {filteredData.map(char => {
              return (
                <img
                  key={char.id}
                  className="image"
                  style={styles.image}
                  src={char.image}
                  alt={char.name}
                  onClick={() => this.setState({ selectedChar: char })}
                />
              );
            })}
          </div>
        </div>
      );
    }

    // If we have a selected character, we show it in a Card
    let selected;
    if (selectedChar) {
      selected = (
        <Card
          style={styles.card}
          cover={<img alt={selectedChar.name} src={selectedChar.image} />}
        >
          <p>
            <strong>Name:</strong> {selectedChar.name}
          </p>
          <p>
            <strong>Location:</strong>
            {selectedChar.location.name}
          </p>
          <p>
            <strong>Species:</strong> {selectedChar.species}
          </p>
          <p>
            <strong>Gender:</strong> {selectedChar.gender}
          </p>
        </Card>
      );
    }

    return (
      <div style={styles.root}>
        <form>
          <div className="form-group shadow ml-5 mt-1 bg-white rounded">
            <input
              className="form-control shadow bg-white rounded"
              style={{ width: 300 }}
              type="text"
              placeholder="Search character..."
              onChange={this.filterList}
            />
          </div>
        </form>
        {filtered}

        <GridList style={styles.gridList} cellHeight={120} cols={5}>
          {data.map(char => {
            return (
              <GridListTile key={char.id}>
                <img
                  className="image"
                  style={styles.image}
                  src={char.image}
                  alt={char.name}
                  onClick={() => this.setState({ selectedChar: char })}
                />
              </GridListTile>
            );
          })}
          }
        </GridList>

        <div style={{ marginLeft: "100px" }}>
          <Pagination
            defaultCurrent={page}
            onChange={this.fetchData}
            total={210}
          />
        </div>

        <div className="cardContainer shadow bg-white rounded">{selected}</div>

        <div style={{ margin: 30 }}>
          <div style={styles.chart} className="chart">
            <Progress percent={maleCount} size="small" />
            <p>Male: {mCount}</p>
            <Progress percent={femaleCount} size="small" />
            <p>Female: {fCount}</p>
            <Progress percent={unknownCount} size="small" />
            <p>Unknown: {uCount}</p>
          </div>
        </div>
      </div>
    );
  }
}

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: 800
  },
  gridList: {
    borderWidth: 1,
    borderColor: "black",
    margin: 10
  },

  image: {
    width: "5rem",
    height: "5rem",
    margin: 15
  },
  card: {
    width: 300
  },
  chart: {
    width: 200
  }
};

export default ListGrid;
