import React, {useState, useCallback} from 'react';
import ActorGrid from '../components/actor/ActorGrid';
import CustomRadio from '../components/CustomRadio';
import { RadioInputsWrapper, SearchButtonWrapper, SearchInput } from '../components/Home.styled';
import MainPageLayout from '../components/MainPageLayout';
import ShowGrid from '../components/show/ShowGrid';
import { apiGet } from '../misc/config';
import { useLastQuery, useWhyDidYouUpdate } from '../misc/custom-hooks';

//useCallback is used when we want to have only one copy of the change

const Home = () =>{
    const [input, setInput] = useLastQuery();
    const [results, setResults] = useState(null); 
    const [searchOption, setSearchOption] = useState('shows');
    const isSearchOption = searchOption === 'shows';
    const onClick = () => {
        // https://api.tvmaze.com/search/shows?q=men
        apiGet(`/search/${searchOption}?q=${input}`).then(result => {
            setResults(result);
        });
        //Handling in configs
        // fetch(`https://api.tvmaze.com/search/shows?q=${input}`)
        // .then(r =>r.json())
        // .then(result=> {
        //     setResults(result);
        // });
    };
  
    // optimising onInputChange using callBack
    const onInputChange = useCallback(ev =>{
        setInput(ev.target.value);
    },[setInput]);

    // for enter or any key press event (keycode is 13 for enter)
    const onKeyDown = ev => {
        if (ev.keyCode === 13) {
          onClick();
        }
      };

      // Using callBack to avoid multiple renders, creating only one copy of the radio change
      const onRadioChange = useCallback( ev => {
        setSearchOption(ev.target.value);
    }, []);

   const renderResults = () =>{
        if(results && results.length === 0) {
            return <div>No results</div>;
        }
        // commenting below code and directly using components
        // if(results && results.length > 0){
        //    return results[0].show ? results.map(item =>(
        //     <div key="item.show.id">{item.show.name}
        //     </div>)) : results.map(item =>(
        //        <div key="item.person.id">{item.person.name}
        //        </div>));  
        // }
        if(results && results.length > 0) {
          return results[0].show ? (<
              ShowGrid data={results}/> 
              ) : (
              <ActorGrid data={results}/>
              );
        }
        return null;
   };

   useWhyDidYouUpdate('home', { onInputChange, onKeyDown });
   
    return ( <MainPageLayout>
        <SearchInput type="text" placeholder="Search for something" onChange={onInputChange} onKeyDown={onKeyDown} value={input}/>
        <RadioInputsWrapper>
            <div>
                <CustomRadio
                label="Shows"
                id="show-search"
                value="shows" 
                checked={isSearchOption}
                onChange={onRadioChange}
                />
            </div>
            <div>
                <CustomRadio
                label="Actors"
                id="actor-search"
                value="people" 
                checked={!isSearchOption}
                onChange={onRadioChange}
                />
            </div>
        </RadioInputsWrapper>
        <SearchButtonWrapper>
        <button type="button" onClick={onClick}>Search</button>
        </SearchButtonWrapper>
        {renderResults()}
        </MainPageLayout>
    );
};
export default Home;