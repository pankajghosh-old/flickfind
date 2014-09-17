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
			<input className="typeahead form-control" type="text" placeholder="Enter a search term e.g. soccer"/>
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
		}).on('typeahead:selected', this.onSelected).on('typeahead:autocompleted', this.onAutoCompleted);
	},
	onSelected:function($e, datum){
		console.log('onSelected');
	},
	onAutoCompleted:function($e, datum, ds){
		console.log('onAutoCompleted');
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

React.renderComponent(
	<SearchBox search_results_url="search_results"/>,
	document.getElementById('search_div')
	);