/** @jsx React.DOM */
var SearchBox = React.createClass({
	render : function(){
		return (
			<input className="typeahead form-control" type="text" placeholder="Enter a search term e.g. soccer"/>
			);
	}
});

React.renderComponent(
	<SearchBox/>,
	document.getElementById('search_div')
	);