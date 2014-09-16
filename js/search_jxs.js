/** @jsx React.DOM */
var SearchBox = React.createClass({
	render : function(){
		console.log('render called');
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
		$(element).typeahead(null,
		{
			name: 'search_terms',
			displayKey: 'term',		  
			source: search_terms.ttAdapter()
		});
	},
	componentWillUnmount:function(){
		console.log('componentWillUnmount called');
	}
	});

React.renderComponent(
	<SearchBox/>,
	document.getElementById('search_div')
	);