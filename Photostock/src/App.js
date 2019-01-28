import React, {Component} from 'react';
import Search from './Search.js';
import Gallery from './Gallery.js';
import Arrow from './Arrow.js';
import Unsplash, {toJson} from 'unsplash-js';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            keyword: '',
            isFound: '',
            images: [],
            isLoading: false,
            currentPage: 1,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.flipPage = this.flipPage.bind(this);
        this.fetchData = this.fetchData.bind(this);
    }

    handleChange(e) {
        this.setState({value: e.target.value})
    }
    handleClick() {
        // если ничего не введено, то останавливаем поиск
        if (!this.state.value.length) return;
        this.setState({keyword: this.state.value})
        console.log(this.state.keyword)
    }
    handleKeyDown(e) {
        if (e.keyCode !== 13) return;
        this.handleClick();
    }
    flipPage(e) {
        if (!this.state.keyword.length) return;
        if (e.target.classList.contains('arrow__right')) {
            this.setState(prevState => {
                return {
                    currentPage: prevState.currentPage + 1
                }
            })
            return;
        } 
        this.setState(prevState => {
            return {
                currentPage: prevState.currentPage - 1
            }
        })
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.keyword !== prevState.keyword) {
            this.setState({isLoading: true});
            this.fetchData();
        }
        if (this.state.currentPage !== prevState.currentPage) {
            // console.log('Page is changed!', this.state.currentPage);
            this.setState({isLoading: true});
            this.fetchData(this.state.currentPage);
        }
    }

    fetchData(page=1) {
        const unsplash = new Unsplash({
            applicationId: "e849bc7088cbffe75e6377b5c193866c45f4b129137b3fa913e1c9787ac25748",
            secret: "9614cbca16dcaf073d3afa6fc0173bfc91e69ff44671d5dbb896929902bf305f", 
        });
        const tag = this.state.keyword.toLowerCase();

        unsplash.search.photos(tag, page, 12)
            .then(toJson)
            .then(json => {
                if (!json.results.length) {
                    this.setState({
                        isFound: false,
                        isLoading: false,
                        currentPage: 1
                    })
                } else {
                    this.setState({
                        isFound: true,
                        images: json.results,
                        isLoading: false,
                        currentPage: page
                    })
                }
            })
    }

    render() {
        return (
            <div className='container'>
                <Search 
                    handleChange={this.handleChange}
                    handleClick={this.handleClick}
                    handleKeyDown={this.handleKeyDown}
                    value={this.state.value}
                />
                <Arrow 
                    flipPage={this.flipPage}
                    currentPage={this.state.currentPage}
                />
                <Gallery 
                    images={this.state.images}
                    isFound={this.state.isFound}
                    isLoading={this.state.isLoading}
                />
            </div>
        )
    }
}

export default App;