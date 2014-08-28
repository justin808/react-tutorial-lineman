/** @jsx React.DOM */
Object.defineProperty(Object.prototype, 'map', {
    value: function(f, ctx) {
        ctx = ctx || this;
        var self = this, result = {};
        Object.keys(self).forEach(function(v) {
            result[v] = f.call(ctx, self[v], v, self); 
        });
        return result;
    }
});

function copy(obj) {
    var newObj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
}

var Cell = React.createClass({
    propTypes: {
        data: React.PropTypes.string.isRequired,
        // Will be called with the new value for the cell
        onChange: React.PropTypes.func.isRequired
    },
    handleChange: function(evt) {
        this.props.onChange(evt.target.value);
    },
    render: function() {
        return <input value={this.props.data} onChange={this.handleChange} />
    }
});

var Row = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        // Will be called with a cell's name and its new value
        onCellChange: React.PropTypes.func.isRequired
    },
    handleChange: function(prop, val) {
        // (Since this function simply calls this.props.onCellChange, we could
        // instead refer to the callback directly below.)
        this.props.onCellChange(prop, val);
    },
    render: function() {
        return <div className="row">
            <Cell data={this.props.data.name}
                  onChange={this.handleChange.bind(null, "name")} />
            <Cell data={this.props.data.location}
                  onChange={this.handleChange.bind(null, "location")} />
            <Cell data={this.props.data.phone}
                  onChange={this.handleChange.bind(null, "phone")} />
        </div>;
    }
});

var Grid = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        // Will be called with a cell's row index, name, and new value
        onCellChange: React.PropTypes.func.isRequired
    },
    render: function() {
        var rows = this.props.data.map(function(rowData, key, obj) {
            return <Row key={key} data={rowData}
                        onCellChange={this.props.onCellChange.bind(null, key)} />;
        }, this);
        return <div className="table">{rows}</div>;
    }
});

var Editor = React.createClass({
    getInitialState: function() {
        return {data: this.props.initialData};
    },
    handleCellChange: function(rowIdx, prop, val) {
        updateObj = {};
        updateObj.data = {};
        updateObj.data[rowIdx] = {};
        updateObj.data[rowIdx][prop] = { $set: val };
        var newState = React.addons.update(this.state, updateObj);
        this.setState(newState);
    },
    handleButtonClick: function(evt) {
        console.log(this.state.data);
    },
    render: function() {
        return <div>
            <Grid data={this.state.data} onCellChange={this.handleCellChange} />
            <button type="button" onClick={this.handleButtonClick}>Update</button>
        </div>;
    }
});

var company = {
    employees: {
      row1:  {id: "1", name: "Peter", location: "IT", phone: "555-1212"},
      row2:  {id: "2", name: "Samir", location: "IT", phone: "555-1213"},
      row3:  {id: "3", name: "Milton", location: "loading dock", phone: "none"}
    }
};


React.renderComponent(
    <Editor initialData={company.employees} />,
    document.getElementById('employees')
);
