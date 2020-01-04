import React, { Component } from 'react';
import './App.css';
import './index.css';

const DEFAULT_SUBREDDIT = 'aww';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      after: '',
      children: [],
      isLoading: false,
      isRefresh: false,
      subReddit: ''
    };
  }

  applySetResult = (result, isRefresh) => (prevState) => (
    prevState && !isRefresh
      ? {
        after: result.data.after,
        children: [...prevState.children, ...result.data.children],
        isLoading: false
      }
      : {
        after: result.data.after,
        children: result.data.children,
        isLoading: false,
        isRefresh: false
      }
    );
  
  onSubmit = (e) => {
    e.preventDefault();

    const { value } = this.input;

    if (value === '') { return; }

    this.setState({ isLoading: true, isRefresh: true, subReddit: value });
    fetch(`https://www.reddit.com/r/${value}/new.json`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  onPaginate = (e) => {
    const { after, subReddit } = this.state;

    this.setState({ isLoading: true });
    fetch(`https://www.reddit.com/r/${subReddit}/new.json?count=25&after=${after}`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  onSetResult = (result) => {
    const { isRefresh } = this.state;
    if (result.Message !== "Not Found" && result.error !== 404)
      this.setState(this.applySetResult(result, isRefresh));
  }

  componentDidMount() {
    if (this.input) {
      this.input.focus();
      this.input.value = DEFAULT_SUBREDDIT;
    }

    this.setState({ subReddit: DEFAULT_SUBREDDIT });

    fetch(`https://www.reddit.com/r/${DEFAULT_SUBREDDIT}/new.json`).then(response => response.json()).then(result => this.onSetResult(result)).catch(error => error);
  }

  render() {
    return (
      <div className="App">
        <div className="subreddit">
          <form type="submit" onSubmit={this.onSubmit}>
            <input type="text" ref={ node => this.input = node } className="input" />
            <button type="submit">Update</button>
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

    if (container == null)
      return <div className="container">No subreddit selected.</div>;
    
    return (
      <div className="container">
        {container.map(item => <RedditListItem key={item.data.id} link={'https://reddit.com' + item.data.permalink} sub={item.data.subreddit_name_prefixed} thumbnail={item.data.thumbnail} title={item.data.title} />)}
      </div>
    );
  };
}

class RedditListItem extends Component {
  render() {
    const { link, sub, thumbnail, title } = this.props;

    return (
      <div className="row item">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-4 thumbnail">
              <img src={thumbnail} alt={title} />
            </div>
            <div className="col-md-8 label">
              <span className="sub">{sub}</span><br />
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <span className="title"><a href={link}>{title}</a></span>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default App;
