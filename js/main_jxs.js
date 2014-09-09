/** @jsx React.DOM */
var SearchTerm = React.createClass({
  getInitialState:function(){
    return {isSelected:false};
  },
  render: function() {
    var classes = React.addons.classSet({
      'btn': true,
      'btn-default': true,
      'btn-success': this.state.isSelected,
    });
    return (
      <a className={classes} parentClickHandle={this.handleSelection}>
      {this.props.term}
      </a>
      );
  },
  handleSelection: function(){
    console.log('child received event', term)
  }
});

var SearchTermList = React.createClass({
  render: function() {
    var searchTermNodes = this.props.data.map(function (searchTerm) {
      return (
        <SearchTerm term={searchTerm.term}>
        </SearchTerm>
        );
    });
    return (
      <div className="searchTerms" onClick={this.handleClick}>
      {searchTermNodes}
      </div>
      );
  },
  handleClick: function(event) {
    React.Children.forEach(this.props.data, function(child){
      // console.log(child.props, event.target.text);
        // child.setState({ isSelected: child.props === event.target.text });
        child.parentClickHandle();
      });    
  }
});

var SearchTermBox = React.createClass({
  getInitialState: function() {
    return {data:[{term:"abc"},{term:"bcd"}]};
  },
  loadCommentsFromServer:function(){
    $.ajax({
      url: this.props.search_terms_url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadCommentsFromServer();
  },
  handleAddSearchTerm:function(){
    var addsearchterm = this.refs.addsearchterm.getDOMNode().value.trim();
    console.log('add search term clicked', addsearchterm)
    $.ajax({
      url: this.props.search_terms_url,
      dataType: 'json',
      type: 'POST',
      data: {term:addsearchterm},
      success: function(data) {
        this.loadCommentsFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="searchTermForm">
      <SearchTermList data={this.state.data} />
      <input type="text" placeholder="Say something here..." ref="addsearchterm" />
      <button id="addsearchtermbutton" onClick={this.handleAddSearchTerm}>Add Search Term</button>
      </div>
      );
  }
});

React.renderComponent(
  <SearchTermBox search_terms_url="search_terms"/>,
  document.getElementById('selection_buttons_react')
  );

React.renderComponent(
  <h4>click on a search term...</h4>,
  document.getElementById('d1')
  );

