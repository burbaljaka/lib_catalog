import React from 'react';
import './App.css';

// class App extends React.Component{
//   constructor(props){
//     super(props);
//     this.state = {
//       bookList:[],
//       activeItem:{
//         id:null,
//         name:'',
//         authors:[],
//         bbks:[],
//         author_sign:'',
//         issue_year:'',
//         keywords:[],
//         descriprion:'',
//         issue_city:'',
//         publishing_house:'',
//         place:'',
//         pages:'',
//       }
//       // this.fetchBooks
//     }
//   };
//
//   fetchBooks(){
//     fetch('http:127.0.0.1:8000/api/v1/lib/book/')
//     .then(response => response.json())
//     .then(data =>
//       this.setState({bookList:data}))
//   }
// }
//
// render{
//   return(
//     <div className="container">
//       <div id="list-wrapper">
//
//       </div>
//     </div>
//   )
// }

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      authorList:[],
      activeItem:{
        id:null,
        short_name: '',
      }
    }
      this.fetchAuthors = this.fetchAuthors.bind(this)
  };

  componentDidMount(){
    this.fetchAuthors()
  }

  fetchAuthors(){
    console.log('Fetching...');
    fetch('http://127.0.0.1:8000/api/v1/lib/author/')
    .then(response => response.json())
    .then(data =>
      this.setState({authorList:data}))
  }

  render(){
    var authors = this.state.authorList
    return(
      <div className="container">
        <div id="author-container">
          <div id="list-wrapper">
            {authors.map(function(author, index){
              return(
                <div key={index} className="item-wrapper flex-wrapper">
                  <div style={{flex:10}}>
                    <span>Имя для отображения в списках: {author.short_name}</span>
                  </div>
                  <div style={{flex:10}}>
                    <span>Полное имя: {author.lname} {author.fname} {author.mname}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
