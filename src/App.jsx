import { useEffect, useState } from "react";
import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Puzzle from "./components/Puzzle";
import Header from './components/Header';

async function fetchData(){
    const response = await fetch("https://splendorous-malabi-4516db.netlify.app/.netlify/functions/data");
    var data;
    if (response.ok) {
        data = await response.json();
    } else {
        console.error("Error: ", response.statusText);
    }
    return data;
}



export default function App(){
    const [dogPictures,setDogPictures] = useState([]);
    const [catPictures,setCatPictures] = useState([]);
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    
    useEffect(() => {
        const handleWindowResize = () => {
          setWindowSize({width: window.innerWidth, height: window.innerHeight});
        };
    
        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect (() => {
        (async () =>{ 
            const newContent = await fetchData();
            setDogPictures(newContent.dog);
            setCatPictures(newContent.cat);
        })();
    },[]);
    return(
        <>
        <div className="header">
            <Header />
        </div>
        <form onSubmit={async (event)=>{
            event.preventDefault();
            
        }}>
            {dogPictures.length > 0 && <Puzzle imageUrl={dogPictures[0]}/>}
            <div className="pictrures" style={{marginLeft: 25,marginRight: 25,marginTop:10}}>
                <RadioGroup name="picture" style={{marginLeft: 25,marginRight: 25,marginTop:10}}/*onChange={handleChange}*/>
                    <ImageList cols={3} gap={30}>
                        {dogPictures.map((item,i) => (
                            <Radio
                            key={i}
                            value={i}
                            name="picture"
                            icon={
                            <ImageListItem key={item}>
                                <Card sx={{ width: (windowSize.width-100-30*2)/3,minWidth: 200 }}>
                                    <CardMedia
                                        sx={{ height: 250 }}
                                        image={item}
                                        title={"dog"+{i}}
                                    />
                                </Card>        
                            </ImageListItem>
                            }
                            checkedIcon={
                                <ImageListItem key={item} sx={{border: 4}}>
                                    <Card sx={{ width: (windowSize.width-100-30*2)/3,minWidth: 200 }}>
                                        <CardMedia
                                            sx={{ height: 250 }}
                                            image={item}
                                            title={"dog"+{i}}
                                        />
                                    </Card>
                                </ImageListItem>
                            }
                            sx={{margin: 0, padding: 0, border: 0,minWidth: 200,height: 250}}
                            />
                        ))}
                    </ImageList>
                </RadioGroup>
            </div>
        </form>
        </>
    );
}
/*<img
                    src={`${item}?w=164&h=164&fit=crop&auto=format`}
                    srcSet={`${item}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    loading="lazy"
                    />*/