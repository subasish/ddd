'use strict';

/* capitalizes string */
function capitalize(string) {
  var splitStr = string.split(' ');
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
	return splitStr.join(' '); 
}


/*----------------------------
Simple One Dropdown
------------------------------*/
/* generic component for a dropdown menu with only one possible value in the column */
class DropdownOne extends React.Component {
  render() {
    /* NOTE: the column parameter passed in to the component selects the certain row from the total data*/
    var column = this.props.column;
    var totalOptions = [" "]
    var data = this.props.data
    /* uses ES6, saves all options into array, then uses Set to find unique value then sort by alphabet */
    {data.map((object)=> {
      totalOptions.push(capitalize(object[column].trim()));
    })}
    var uniqueOpt = Array.from(new Set(totalOptions))
    /* sorts by alphabetical order */
    /* uniqueOpt.sort() */
    uniqueOpt.splice(uniqueOpt.length - 1, 1);
    /* console.log(uniqueOpt) */
    /* updates state with selected option and column name*/
    return (
      <div class="rct-comp-div">
        <h5>{this.props.title} <sup class="required noprint">*</sup></h5>
        <select class="form-control rct-dropdown" onChange={(e)=> this.props.onChangeElem(e.target.value, column)}>{uniqueOpt.map((dat, i)=> {
          return <option>{dat}</option> })}
        </select>
      </div>
    )
  }
}

/*--------------------
Multi Dropdown
--------------------*/
/* generic component for a dropdown menu with columns that contain arrays */
/* use this with columns like location1/location2/location3/location4 */
class DropdownMult extends React.Component {
  render() {
    var column = this.props.column;
    var totalOptions = [" "]
    var data = this.props.data
    /* uses ES6, saves all array of options into single layer array, then uses Set to find unique value then sort by alphabet */
    {data.map((object)=> {
      var myarr = object[column].split("/");
      {myarr.map((element)=> {
        totalOptions.push(capitalize(element.trim()));
      })}
    })}
    var uniqueOpt = Array.from(new Set(totalOptions))
    uniqueOpt.sort();
    uniqueOpt.splice(0, 1);
    /* console.log(uniqueOpt) */
    return (
      <div class="rct-comp-div">
        <h5>{this.props.title} <sup class="required noprint">*</sup></h5>
        <select class="form-control rct-dropdown" onChange={(e)=> this.props.onChangeElem(e.target.value, column)}>{uniqueOpt.map((dat, i)=> {
          return <option>{dat}</option> })}
        </select>
      </div>
    )
  }
}

/* filters the control methods, adding to a filtered array and calls the card component */
class MethodList extends React.Component {
  render() {
    /* NOTE: instantiate these variables to each field in the selected object*/
    var selLoc = this.props.selected.location.toLowerCase();
    var selFacility = this.props.selected.facility.toLowerCase();
    var selConstruction = this.props.selected.construction.toLowerCase();
    var data = this.props.data;
    var filter = [];
    /* makeshift iterator to save the results that match the search to the filter array */
    var iter = 0;
    {data.map((opt)=> {
        /* if (sellcost == opt.lcost.trim()) { */
          /* since state is an array of states */
          {opt.location.split("/").map((indivState)=> {
            if(selLoc == indivState.trim()) {
              {opt.facility.split("/").map((indivFac)=> {
                if(selFacility == indivFac.trim()) {
                  {opt.construction.split("/").map((indivCons)=> {
                    if(selConstruction == indivCons.trim()) {
                      filter.push(data[iter]);
                    }
                  })}
                }
              })}
            }
          })}
        /*}*/
      iter++
    })}
    /* {((selState != "--choose an option--" && selDuration != "--choose an option--") && filter.length == 0 ? <h5 class="listcontainer">No results found. </h5> : <h5></h5>} */
    console.log(filter);
    /* remember to RETURN when using map() to render elements! */
    /* add summary of all choices as a tabale here */
    return (
      <div>
        {filter.length == 0 && (selLoc && selFacility && selConstruction) != " "  ? <h2 class="listcontainer">No information available.</h2> : <h5></h5>}
        {filter.length > 0 ? <h2 class="listcontainer">Results</h2> : <h5></h5>}
        {filter.map((obj)=> {
          return <MethodCard result={obj} />
        })}
      </div>
    )
  }
}

/* card component of the list */
class MethodCard extends React.Component {
  render() {
    var images = this.props.result.image.split("/");
    if (this.props.result.method == "n/a") {
      return ( 
        <div>
          <h2 class="listcontainer">No information available.</h2>
        </div>
      )
    }
    return (
      <div class="rct-comp-div rct-method-card">
        <div class="rct-card-img">
        {images.map((img)=> {
          return <img src={"images/ref/" + img.trim()} />
        })}
        </div>
        <div class="rct-card-txt">
          <h3>{this.props.result.method}</h3>
          {this.props.result.description.split('<br>').map( (it, i) => <p key={'x'+i}>{it}</p> )}
          {<p><a href={"docs/" + this.props.result.link}>Find out more</a></p>}
        </div>
      </div>
    )
  }
}


/* parent element */
class ControlMethods extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: undefined, 
            example: "", 
            selected: {
              /* this is where you add the selected fields for the options*/
              location: " ", 
              facility: " ",
              construction: " ", 
            }
        };
        /* because of the async nature of jsx, need to ensure data is fetched before updating state*/
        this.UpdateData = this.UpdateData.bind(this);
        this.onChangeElem = this.onChangeElem.bind(this);
    }

    /* function that updates state.selected with selected values of dropdowns */
    onChangeElem(val, column) {
      var selTemp = this.state.selected;
      console.log(val);
      selTemp[column] = val;
      this.setState({
        selected: selTemp
      });
      console.log(this.state.selected)
    }

    /* grabs data from csv database */
    componentWillMount() {
        Papa.parse("data/VegeSheetUrel.csv", {
            download: true, 
            header: true, 
            delimiter: "|",
            skipEmptyLines: true,
            complete: this.UpdateData
            });
    }

    UpdateData(result) {
      const tempdat = result.data;
      this.setState({
        data: tempdat
      })
      console.log(this.state.data);
    }
/* the if statement in render makes sure data is fetched before displaying */
    render() {
        return (
          <div>
              {this.state.data ? 
              <div>
                <div>
                  <DropdownMult title="Treatment Location" onChangeElem={this.onChangeElem} data={this.state.data} column="location"/> 
                  <DropdownMult title="Aesthetic Considerations" onChangeElem={this.onChangeElem} data={this.state.data} column="facility"/> 
                  <DropdownMult title="Construction Type" onChangeElem={this.onChangeElem} data={this.state.data} column="construction"/> 
                </div>
                <div>
                </div>
                {/* <MethodList data={this.state.data} selected={this.state.selected} /> */}
              </div>
              : 
              <div>
                <h5>Loading.</h5>
              </div>}
          </div>
        )
      }
}

const domContainer = document.querySelector('#react-component');
ReactDOM.render(<ControlMethods />, domContainer);