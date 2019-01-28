import React from 'react';

function Gallery(props) {

    const loading = <div className='loader'><div className="loader__spinner"></div></div>;
    const notFound = <h3 className='notFound'>No matching photos :(</h3>;
    const justMounted = (<div className='note'>
                            <h3>Please enter a keyword to generate photo gallery</h3>
                            <p>NOTE: Only 50 requests per hour are available</p>
                        </div>    
                        )    

    const photos = props.images.map( photo => {

        const standardRatio = 4 / 3;
        const photoRatio = photo.width / photo.height;
        const landscape = photoRatio > standardRatio; // widescreen photo 
        const styles = {
            width: landscape ? 'auto' : '100%',
            height: landscape ? '100%' : 'auto'
        }
        let desc = '';
        if (photo.description) {
            // first letter to uppercase
            desc = photo.description.charAt(0).toUpperCase() + photo.description.slice(1); 
        } 
        return (
            <div className='photo'>
                <a className='photo__wrapper' target='_blank' href={photo.urls.full}>
                    <img key={photo.id} src={photo.urls.small} style={styles}/> 
                </a>
                <div className='photo__description'>{desc}</div>
            </div>
        )
    });
    let result;
    switch (props.isFound) {
        case true:
            result = photos;
            break;
        case false:
            result = notFound;
            break;
        default:
            result = justMounted;
    }
    
    return (
        <div className='gallery'>
            {props.isLoading ? loading : null}
            {result}
        </div>
    )  

}

export default Gallery ;