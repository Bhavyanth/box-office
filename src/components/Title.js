import React, { memo } from 'react';
import { TitleWrapper } from './Title.styles';

// memo is a function to optimize, removing unneccesary rendering of components
const Title = ({ title, subtitle }) =>{
    // it does only shallow comparision of the props
    return(
        <TitleWrapper>
            <h1>{title}</h1>
            <p>{subtitle}</p>
        </TitleWrapper>
    )
}
export default memo(Title);