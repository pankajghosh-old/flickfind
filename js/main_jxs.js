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

var SearchResultBanner = React.createClass({
  render:function(){
      var classes = React.addons.classSet({
        'col-lg-3': true,
        'col-md-4': true,
        'col-sm-6': true,
        'col-xs-6': true,
      });
      return (
        <div className={classes}>
          <div className="thumbnail">
            <img src={this.props.searchResult.urlPoster} width="90" height="90"/>
            <div className="caption">
              <p className="bg-success" align="center">
                <a href={this.props.searchResult.urlIMDB} className="btn btn-primary" role="button" target = "_blank">
                  {this.props.searchResult.title}
                </a>
              </p>
              <p align="center">
                <img src="/assets/imdb_rating.png" width="30" height="30">
                  <span className="badge">{this.props.searchResult.imdb_rating}</span>
                </img>
              </p>
            </div>  
          </div>
        </div>
        );
  }
});

var SearchResults = React.createClass({
  render: function() {
    var searchResultBanners = this.props.searchResults.map(function (searchResult) {
      return (
        <SearchResultBanner searchResult={searchResult} key={searchResult.title}>
        </SearchResultBanner>
        );
    });
    return (
      <div className="container">
        <div className="row">
          {searchResultBanners}
        </div>
      </div>
      );  
  }  
});

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

React.renderComponent(
  <SearchTermBox search_terms_url="search_terms" search_results_url="search_results"/>,
  document.getElementById('selection_buttons_react')
  );

React.renderComponent(
  <h4>click on a search term...</h4>,
  document.getElementById('d1')
  );

