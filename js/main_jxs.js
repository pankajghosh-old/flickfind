/** @jsx React.DOM */
var SearchTerm = React.createClass({
  getInitialState:function(){
    return {isSelected:false};
    // return {data:[{term:"termabc"}, {term:"termbcd"}]}
  },
  // componentDidMount: function() {
  //   this.handleClick();
  // },
  render: function() {
    var classes = React.addons.classSet({
      'btn': true,
      'btn-default': true,
      'btn-success': this.state.isSelected,
    });
    return (
      <a className={classes} onChange={this.handleSelection}>
      {this.props.term}
      </a>
      );
  },
  handleSelection: function(term){
    console.log('child received event', term)
  }
  // handleClick: function(event) {
  //   console.log('child click event')
  //   this.setState({isSelected:true})
  //   getlinks(this.props.term);
  //   console.log('child click event end')
  // }
});

var SearchTermList = React.createClass({
  getInitialState:function(){
    return {data:[{term:"abc"},{term:"bcd"}]};
    // return {data:[{term:"termabc"}, {term:"termbcd"}]}
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    var searchTermNodes = this.state.data.map(function (searchTerm) {
      return (
        <SearchTerm term={searchTerm.term}>
        </SearchTerm>
        );
    });
    return (
      <div className="searchTerms" onClick={this.handleClick}>
      {searchTermNodes}
      </div>
      );
  },
  handleClick: function(event) {
    console.log('parent click event', event.target.text);
    // console.log(this.props);
    // if (this.props.onChange){
    //   this.props.onChange(event.target.text);
    // }
    // console.log('called children events')
    // console.log('parent click event', event.target.text);
    // console.log(this.props.children);  // handleClick: function(event) {
  //   console.log('child click event')
  //   this.setState({isSelected:true})
  //   getlinks(this.props.term);
  //   console.log('child click event end')
  // }

  React.Children.forEach(this.props.children, function(child){
    console.log(child.props.term, event.target.text);
        // child.setState({ isSelected: child.props.term === event.target.text });
        // child.parentClickHandler();
      });
}
});

var SearchTermForm = React.createClass({
  getInitialState: function() {
    return {data:[{term:"abc"},{term:"bcd"}]};
  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.search_terms_url,
      dataType: 'json',
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function() {
    return (
      <div className="searchTermForm">
        <h1>Search Terms</h1>
        <SearchTermList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});

// var CommentForm = React.createClass({
//   render: function() {
//     return (
//       <form className="commentForm">
//       <input type="text" placeholder="Your name" />
//       <input type="text" placeholder="Say something..." />
//       <input type="submit" value="Post" />
//       </form>
//       );
//   }
// });

React.renderComponent(
  <SearchTermForm search_terms_url="search_terms"/>,
  document.getElementById('selection_buttons_react')
  );

React.renderComponent(
  <h4>click on a search term...</h4>,
  document.getElementById('d1')
  );

