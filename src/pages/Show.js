import React from 'react';
import {useParams} from 'react-router-dom';
import Cast from '../components/show/Cast';
import Details from '../components/show/Details';
import Seasons from '../components/show/Seasons';
import ShowMainData from '../components/show/ShowMainData';
import { useShow } from '../misc/custom-hooks';
import { InfoBlock, ShowPageWrapper } from './Show.styles';


const Show = () => {
    // Using custom hooks, id will be populated from the params
    // Use effect allows us to hook into different components, it accepts callback function and an array
    //UseEfect -> Call back function will run only once when array is []
    // only when the [value in this] changes, that callback function will run
    // Cleanup is the return from callback function
    const { id } = useParams();
    // Using single line code to get results by providing show ID
    const { show, isLoading, error } = useShow(id); 
    // removed and moved to custom hooks
    if (isLoading) {
        return <div>Data is being loaded</div>;
      }
    
      if (error) {
        return <div>Error occured: {error}</div>;
      }

    return ( 
        //instead of div, use ShowPageWrapper from styled
    <ShowPageWrapper>
       <ShowMainData 
       image={show.image} 
       name={show.name} 
       rating={show.rating} 
       summary={show.summary} 
       tags={show.genres}/>
        <InfoBlock>
            <h2>Details</h2>
            <Details status={show.status} network={show.network} premiered={show.premiered}/>
        </InfoBlock>
        <InfoBlock>
            <h2>Seasons</h2>
            <Seasons seasons={show._embedded.seasons}/>
        </InfoBlock>
        <InfoBlock>
            <h2>Cast</h2>
            <Cast cast={show._embedded.cast}/>
        </InfoBlock>
    </ShowPageWrapper>
    );
};
export default Show;