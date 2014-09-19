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
      var imdb_rating = this.props.searchResult.imdb_rating;
      var critics_score = this.props.searchResult.critics_score;
      var critics_rating = this.props.searchResult.critics_rating;
      var audience_score = this.props.searchResult.audience_score;
      var audience_rating = this.props.searchResult.audience_rating;

      var string_element = "";
      if (imdb_rating > 0){
        string_element = '<img src="/assets/imdb_rating.png" width="30" height="30"><span class="badge">'+imdb_rating+'</span></img>'        
      }

      if (critics_score > 0)
        if (critics_rating === "Certified Fresh")
          string_element+='<img src="/assets/certified_fresh.png" width="30" height="30"><span class="badge">'+critics_score+'</span></img>'
        else if (critics_rating === "Fresh")
          string_element+='<img src="/assets/fresh.png" width="30" height="30"><span class="badge">'+critics_score+'</span></img>'
        else
          string_element+='<img src="/assets/rotten.png" width="30" height="30"><span class="badge">'+critics_score+'</span></img>'

      if (audience_score > 0)
        if (audience_rating === "Spilled")
          string_element+='<img src="/assets/spilled.png" width="30" height="30"><span class="badge">'+audience_score+'</span></img>'
        else
          string_element+='<img src="/assets/popcorn.png" width="30" height="30"><span class="badge">'+audience_score+'</span></img>'


      return (
        <div className={classes}>
          <div className="thumbnail">
            <img src={this.props.searchResult.urlPoster} width="90" height="90"/>
            <div className="caption">
              <p className="bg-success">
                <a href={this.props.searchResult.urlIMDB} className="btn btn-primary center-block" role="button" target = "_blank">
                  {this.props.searchResult.title}
                </a>
              </p>
              <p>
                <div className="center-block" dangerouslySetInnerHTML={{__html: string_element}}/>
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
