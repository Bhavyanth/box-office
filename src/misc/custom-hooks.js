import { useEffect, useReducer, useRef, useState } from 'react';
import { apiGet } from './config';

function showReducer (prevState, action) {
    switch(action.type) {
        case'ADD': {
            return [...prevState, action.showId];
        }
        // to filter current state
        case'REMOVE': {
            return prevState.filter(showId => showId !== action.showId);
        }
        default: return prevState;
    }
}
// All hooks are functions
function usePersistedReducer(reducer, initialState, key) {
    // Third argument in useReducer is initializer function
    // The third argument will receive initialState as its parameter
    const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
            const persisted = localStorage.getItem(key);
        return persisted ? JSON.parse(persisted) : initial;
    });

    useEffect(()=>{
        localStorage.setItem(key, JSON.stringify(state));
    }, [state,key]);

    return [state, dispatch];
}

export function useShows(key = 'shows'){
    return usePersistedReducer(showReducer,[],key);
}

export function useLastQuery (key= 'lastQuery') {
    const [input, setInput] = useState(()=>{
        const persisted = sessionStorage.getItem(key);
        return persisted ? JSON.parse(persisted) : '';
    });
const setPersistedInput = newState => {
    setInput(newState);
    sessionStorage.setItem(key, JSON.stringify(newState));
};

return [input, setPersistedInput];
}

const reducer = (prevState, action) => {
    switch(action.type) {
        case 'FETCH_SUCCESS': {
            return{ isLoading: false, error: null, show: action.show };
        }
        case 'FETCH_FAILED': {
            return{ ...prevState, isLoading: false, error: action.error };
        }
        default: 
            return prevState;
    }
};

export function useShow(showId){
    const [state, dispatch] = useReducer( reducer, {
            show: null,
            isLoading: true,
            error: null,
        });
    // Commenting below code to use useReducer
    // const [show, setShow] = useState(null);
    // const [isLoading, setIsLoading] = useState(true);
    // const [error, setError] = useState(null);
    useEffect (()=> { 
        // then will be the promise
        let isMounted = true;
        apiGet(`/shows/${showId}?embed[]=seasons&embed[]=cast`).then(results=> {
                if(isMounted) {
                dispatch( {type: 'FETCH_SUCCESS', show: results} );
                }
        }).catch(err => {
            if(isMounted){
                dispatch({ type: 'FETCH_FAILED', error: err.message }); 
            }
        });
        return () => {
            isMounted = false;
        };
    }, [showId]);
    return state;
}

export function useWhyDidYouUpdate(name, props) {
    // Get a mutable ref object where we can store props ...
    // ... for comparison next time this hook runs.
    const previousProps = useRef();
  
    useEffect(() => {
      if (previousProps.current) {
        // Get all keys from previous and current props
        const allKeys = Object.keys({ ...previousProps.current, ...props });
        // Use this object to keep track of changed props
        const changesObj = {};
        // Iterate through keys
        allKeys.forEach(key => {
          // If previous is different from current
          if (previousProps.current[key] !== props[key]) {
            // Add to changesObj
            changesObj[key] = {
              from: previousProps.current[key],
              to: props[key]
            };
          }
        });
  
        // If changesObj not empty then output to console
        if (Object.keys(changesObj).length) {
          console.log('[why-did-you-update]', name, changesObj);
        }
      }
  
      // Finally update previousProps with current props for next hook call
      previousProps.current = props;
    });
  }