import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import firebase from './firebase';

class App extends Component {
  constructor(props) {
    super(props);

    this.urlsRef = firebase.database().ref('urls').orderByKey();
    this.state = { urls: []};
  }


  componentWillMount() {
    let urlsRef = firebase.database().ref('urls').orderByKey();

    //Not so efficent, should use other methods
    urlsRef.on('value', snapshot => {
      const values = snapshot.val();
      const urls = Object.keys(values).map(key => {
        return {id:key, url:values[key].url};
      });

      this.setState({ urls });
   });
  }

  addUrl(e){
    e.preventDefault();
    firebase.database().ref('urls').push({url:this.inputEl.value});
    this.inputEl.value = '';
  }

  render() {
    return (
      <article className="pa3 pa5-ns">
        <h1 className="f3 f2-m f-subheadline-l measure lh-title fw1 mt0">Hi Kevin.</h1>
        <p className="measure lh-copy">
          These sites will get hit once every minute. Feel free to add some!
        </p>


        <form onSubmit={this.addUrl.bind(this)} className="bg-light-red mw7 center pa4 br2-ns ba b--black-10">
          <input className="f6 f5-l input-reset bn black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns" placeholder="Your url" type="text" ref={ el => this.inputEl = el }/>
          <input type="submit" className="f6 f5-l button-reset pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"/>
        </form>

        <div>
          <h1 className="pt3 f4 f-subheadline-l measure lh-title fw1 mt0">Urls:</h1>
          <ul className="list pl0 measure">
            {this.state.urls.map(message => {
              return (
                <p
                  className="lh-copy pv3 ba bl-0 bt-0 br-0 b--dotted b--black-30"
                  key={message.id}>{message.url}
                </p>
              );
            })}
          </ul>
        </div>

       </article>
   );
 }

}

export default App;
