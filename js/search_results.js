/** @jsx React.DOM */
var SearchResultBanner = React.createClass({
  render:function(){
      var classes = React.addons.classSet({
        'col-lg-3': true,
        // 'col-md-4': true,
        // 'col-sm-6': true,
        // 'col-xs-6': true,
      });
      var imdb_rating = this.props.searchResult.imdb_rating;
      var critics_score = this.props.searchResult.critics_score;
      var critics_rating = this.props.searchResult.critics_rating;
      var audience_score = this.props.searchResult.audience_score;
      var audience_rating = this.props.searchResult.audience_rating;

      var imdb_rating_style = {display:'none'};
      if (imdb_rating > 0){
        imdb_rating_style = {};
      }

      var rt_certified_fresh_style = {display:'none'};
      var rt_fresh_style = {display:'none'};
      var rt_rotten_style = {display:'none'};
      if (critics_score > 0)
        if (critics_rating === "Certified Fresh")
          rt_certified_fresh_style = {};
        else if (critics_rating === "Fresh")
          rt_fresh_style = {};
        else
          rt_rotten_style = {};
      

      var rt_spilled_style = {display:'none'};
      var rt_popcorn_style = {display:'none'};
      if (audience_score > 0)
        if (audience_rating === "Spilled")
          rt_spilled_style = {};    
        else
          rt_popcorn_style = {};

      return (
        <div className={classes}>
          <div className="thumbnail">
            <img src={this.props.searchResult.urlPoster} width="90" height="90"/>
            <div className="caption text-center">
              <p className="bg-success">
                <a href={this.props.searchResult.urlIMDB} className="btn btn-primary center-block" role="button" target = "_blank">
                  {this.props.searchResult.title}
                </a>
              </p>
              <p>
                <div className="center-block">
                  <img src="/assets/imdb_rating.png" width="30" height="30" style={imdb_rating_style}><span class="badge" style={imdb_rating_style}>{imdb_rating}</span></img>
                  <img src="/assets/certified_fresh.png" width="30" height="30" style={rt_certified_fresh_style}><span class="badge" style={rt_certified_fresh_style}>{critics_score}</span></img>
                  <img src="/assets/fresh.png" width="30" height="30" style={rt_fresh_style}><span class="badge" style={rt_fresh_style}>{critics_score}</span></img>
                  <img src="/assets/rotten.png" width="30" height="30" style={rt_rotten_style}><span class="badge" style={rt_rotten_style}>{critics_score}</span></img>
                  <img src="/assets/spilled.png" width="30" height="30" style={rt_spilled_style}><span class="badge" style={rt_spilled_style}>{audience_score}</span></img>
                  <img src="/assets/popcorn.png" width="30" height="30" style={rt_popcorn_style}><span class="badge" style={rt_popcorn_style}>{audience_score}</span></img>
                </div>
              </p>
            </div>  
          </div>
        </div>
        );
  }
});

var SearchResultsRow = React.createClass({
  render: function() {
    var searchResultBanners = this.props.searchResultsRow.map(function (searchResult) {
      return (
        <SearchResultBanner searchResult={searchResult} key={searchResult.title}>
        </SearchResultBanner>
        );
    });
    return (
        <div className="row">
          {searchResultBanners}
        </div>
        )
  }
})

var SearchResults = React.createClass({
  render: function() {
    var searchResultBannerRows = [];
    var arr = this.props.searchResults.slice(0);
    while(arr.length) {
      searchResultBannerRows.push( 
        <SearchResultsRow searchResultsRow={arr.splice(0,4)}>
        </SearchResultsRow>
      );
      
    }

    return (
      <div className="container">
        {searchResultBannerRows}
      </div>
      );  
  }  
});
