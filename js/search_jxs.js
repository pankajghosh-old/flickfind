/** @jsx React.DOM */
var SearchBox = React.createClass({
	getInitialState: function() {
    	return {
    		value: '',
    		searchResults:[]
    	};
	},
	render : function(){
		return (
				<input className="typeahead form-control" type="text" placeholder="Enter a search term e.g. soccer" onChange={this.handleChange}/>
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
	handleChange: function(e){
		this.props.setSearchTermHandler(e.target.value);
	},
	componentWillUnmount:function(){
		console.log('componentWillUnmount called');
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

var SearchBoxResults = React.createClass({
	getInitialState: function(){
		return {
			searchTerm:"",
			searchResults:[]
		};
	},
	render: function() {
		return (
		<div>
			<div className="centered input-group-lg">
			  <form className="searchForm" onSubmit={this.handleSubmit}>
			  	<SearchBox ref="searchBox" setSearchTermHandler={this.setSearchTermHandler}/>
			  	<input type="submit" value = "search" className="btn btn-default"/>
			  </form>
			</div>
		  <SearchResults searchResults={this.state.searchResults} />		  
		 </div>
		  );	
	},
	setSearchTermHandler: function(searchTerm){
		console.log('setting search term', searchTerm);
		this.setState({"searchTerm":searchTerm})
	},
	handleSubmit: function(e){
		e.preventDefault();
		if (this.state.searchTerm === ""){
			console.log("no term to search for");
			return
		}
		this.loadSearchResultsFromServer();
	},
	loadSearchResultsFromServer:function(){
	$.ajax({
	  url: this.props.search_results_url,
	  dataType: 'json',
	  data: {search_term:this.state.searchTerm},
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
	<SearchBoxResults search_results_url="search_results" />,
	document.getElementById('search_div')
	);