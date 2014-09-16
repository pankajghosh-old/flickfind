/** @jsx React.DOM */
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

var SearchBox = React.createClass({
	getInitialState: function() {
    	return {
    		value: '',
    		searchResults:[]
    	};
	},
	render : function(){
		console.log('render called');
		return (
			<div>
				<input className="typeahead form-control" type="text" placeholder="Enter a search term e.g. soccer" onChange={this.handleChange}/>
			</div>
			);
	},
	componentDidMount: function(){
		var element = this.getDOMNode();
		var search_terms = new Bloodhound({
		  datumTokenizer: function(d) { return Bloodhound.tokenizers.whitespace(d.term); },
		  queryTokenizer: Bloodhound.tokenizers.whitespace,
		  limit:10,
		  prefetch:'./search_terms'
		});
		 
		// kicks off the loading/processing of `local` and `prefetch`
		search_terms.initialize();		
		$(element).typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
			name: 'search_terms',
			displayKey: 'term',		  
			source: search_terms.ttAdapter()
		});
	},
	componentWillUnmount:function(){
		console.log('componentWillUnmount called');
	},
	handleChange: function(e){
		this.setState({value: e.target.value});
		console.log('user selected', this.state);
	},
	loadSearchResultsFromServer:function(){
	$.ajax({
	  url: this.props.search_results_url,
	  dataType: 'json',
	  data: {search_term:this.state.value},
	  success: function(data) {
	    this.setState({searchResults: data});
	  }.bind(this),
	  error: function(xhr, status, err) {
	    console.error(this.props.search_results_url, status, err.toString());
	  }.bind(this)
	});
	},

	});

React.renderComponent(
	<SearchBox search_results_url="search_results"/>,
	document.getElementById('search_div')
	);