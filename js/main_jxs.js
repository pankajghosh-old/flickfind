/** @jsx React.DOM */
var SearchTerm = React.createClass({
  render: function() {
    var classes = React.addons.classSet({
      'btn': true,
      'btn-default': true,
      'btn-success': this.props.isSelected,
    });
    return (
      <a className={classes}>
      {this.props.term}
      </a>
      );
  }
});

var SearchTermList = React.createClass({
  getInitialState:function(){
    return {selectedSearchTerm:""};
  },
  render: function() {
    var searchTermNodes = this.props.data.map(function (searchTerm) {
      return (
        <SearchTerm term={searchTerm.term} key={searchTerm.term} isSelected={searchTerm.term===this.state.selectedSearchTerm}>
        </SearchTerm>
        );
    }.bind(this));
    return (
      <div className="searchTerms" onClick={this.handleClick}>
      {searchTermNodes}
      </div>
      );
  },
  handleClick: function(event) {
    this.setState({selectedSearchTerm:event.target.text});
    searchByTerm(event.target.text);
  }
});

// var SearchResults = React.createClass({
//   render: function() {
//     return (
//       );
//   }  
// });

var SearchTermBox = React.createClass({
  getInitialState: function() {
    return {
      searchTermResults:[{term:"abc"},{term:"bcd"}],
      searchResults:[]
          };
  },
  loadSearchResultsFromServer:function(){
    $.ajax({
      url: this.props.search_terms_url,
      dataType: 'json',
      success: function(data) {
        this.setState({searchTermResults: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadSearchResultsFromServer();
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
        this.loadSearchResultsFromServer();
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="searchTermForm">
      <SearchTermList data={this.state.searchTermResults} />
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

