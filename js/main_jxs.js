/** @jsx React.DOM */
var SearchTermBox = React.createClass({
  getInitialState: function() {
    return {
      searchTermResults:[{term:"abc"},{term:"bcd"}],
      searchResults:[]
          };
  },
  loadSearchTermsFromServer:function(){
    $.ajax({
      url: this.props.search_terms_url,
      dataType: 'json',
      success: function(data) {
        this.setState({searchTermResults: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.search_terms_url, status, err.toString());
      }.bind(this)
    });
  },
  loadSearchResultsFromServer:function(){
    $.ajax({
      url: this.props.search_results_url,
      dataType: 'json',
      data: {search_term:"soccer"},
      success: function(data) {
        this.setState({searchResults: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.search_results_url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadSearchTermsFromServer();
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
        this.loadSearchTermsFromServer();
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
      <SearchResults searchResults={this.state.searchResults} />
      </div>
      );
  }
});

// React.renderComponent(
//   <ReactTypeahead.Tokenizer defaultValue="foo" options={["foobar", "spameggs", "hameggs", "spamfoo", "spam"]} />,
//   document.getElementById("d1")
// );

React.renderComponent(
  <SearchTermBox search_terms_url="search_terms" search_results_url="search_results"/>,
  document.getElementById('selection_buttons_react')
  );

// React.renderComponent(
//   <h4>click on a search term...</h4>,
//   document.getElementById('d1')
//   );

