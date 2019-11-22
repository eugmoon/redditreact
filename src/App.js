import React, { Component } from 'react';
import './App.css';
import './index.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      after: null,
      children: [],
      isLoading: false,
      sub: 'aww'
    };
  }

  applySetResult = (result) => (prevState) => (
    prevState ? { after: result.data.after, children: [...prevState.children, ...result.data.children], isLoading: false } : { after: result.data.after, children: result.data.children, isLoading: false });
  
  /*
  onInitialSetup = (e) => {
    e.preventDefault();

    const { value } = this.input;

    if (value === '') { return; }

    fetch(`https://www.reddit.com/r/${value}/new.json`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  onPaginate = (e) => {
    const { after } = this.state;

    this.setState({ isLoading: true });
    fetch(`https://www.reddit.com/r/${this.input.value}/new.json?count=25&after=${after}`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }
  */

  onPaginate = (e) => {
    const { after, sub } = this.state;

    this.setState({ isLoading: true });
    fetch(`https://www.reddit.com/r/${sub}/new.json?count=25&after=${after}`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  onSetResult = (result) =>
    this.setState(this.applySetResult(result));

  componentDidMount() {
    const { sub } = this.state;

    fetch(`https://www.reddit.com/r/${sub}/new.json`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  render() {
    return (
      <div className="App">
        <RedditListContainer
          container={this.state.children} 
          isLoading={this.state.isLoading}
          onPaginate={this.onPaginate}
        />
      </div>
    );
  }
  /*
  render() {
    return (
      <div className="App">
        <div className="subreddit">
          <form type="submit" onSubmit={this.onInitialSetup}>
            <input type="text" ref={ node => this.input = node } className="input" />
            <button type="submit">Get subreddit</button>
          </form>
        </div>
        <RedditListContainer
          container={this.state.children} 
          isLoading={this.state.isLoading}
          onPaginate={this.onPaginate}
        />
      </div>
    );
  }
  */
}

class RedditListContainer extends Component {
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500) && this.props.container.length && !this.props.isLoading) {
      this.props.onPaginate();
    }
  }

  render() {
    const { container } = this.props;
    
    return (
      <div className="container">
        {container.map(item => <RedditListItem link={'https://reddit.com' + item.data.permalink} sub={item.data.subreddit_name_prefixed} thumbnail={item.data.thumbnail} title={item.data.title} />)}
      </div>
    );
  };
}

class RedditListItem extends Component {
  render() {
    const { link, sub, thumbnail, title } = this.props;

    return (
      <div className="row item">
        <div className="col-md-4 thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="col-md-8 label">
          <span className="sub">{sub}</span><br />
          <span className="title"><a href={link}>{title}</a></span>
        </div>
      </div>
    );
  };
}

export default App;
