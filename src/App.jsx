import { useEffect, useState } from "react";
import { 
    ImageList,
    ImageListItem,
    Radio,
    RadioGroup,
    Card,
    CardMedia,
    Button,
    FormControl,
    FormControlLabel,
    Grid
 } from '@mui/material';
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
    const [puzzleContent,setPuzzleContent] = useState({dogcat:"dog", id:0});
    const [listContents,setListContents] = useState([]);
    const [dogPictures,setDogPictures] = useState([]);
    const [catPictures,setCatPictures] = useState([]);
    const [value, setValue] = useState("dog");
    const [windowSize, setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    const handleChange = (e) => {
        setValue(e.target.value);
    };
    const handleChangeList = (e) => {
        setPuzzleContent({dogcat:e.target.name,id:e.target.value});
    };
    
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
            setListContents(newContent.dog);
        })();
    },[]);
    useEffect(() => {
        if(value == "dog"){
            setListContents(dogPictures);
        } else {
            setListContents(catPictures);
        }
    },[value]);
    return(
        <>
        <div className="header">
            <Header />
        </div>
        <form style={{marginTop:10}} onSubmit={async (event)=>{
            event.preventDefault();
            
        }}>
            {listContents.length > 0 && <Puzzle imageUrl={puzzleContent.dogcat == "dog" ? dogPictures[puzzleContent.id] : catPictures[puzzleContent.id]}/>}
            <Grid container alignItems='center' justifyContent='center'>
                <Grid item>
                    <FormControl sx={{ width: "100%" }}>
                        <RadioGroup
                        aria-labelledby="radio-buttons-group-label"
                        defaultValue="dog"
                        name="radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                        row
                        >
                        <FormControlLabel
                            value="dog"
                            control={<Radio />}
                            label="Dog"
                            sx={{
                                width: windowSize.width/4,
                                border: `${
                                    value === "dog" ? "2px solid blue" : "1px solid black"
                                }`,
                                m: "8px 0",
                                borderRadius: "4px"
                            }}
                        />
                        <FormControlLabel
                            value="cat"
                            control={<Radio />}
                            label="Cat"
                            sx={{
                                width: windowSize.width/4,
                                border: `${
                                    value === "cat" ? "2px solid blue" : "1px solid black"
                                }`,
                                m: "8px 0",
                                borderRadius: "4px"
                            }}
                        />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>
            <div className="pictrures" style={{marginLeft: 25,marginRight: 25,marginTop:10}}>
                <RadioGroup defaultValue={value+0} name="picture" onChange={handleChangeList}>
                    <ImageList cols={3} gap={30} style={{marginLeft: 20,marginRight: 20,marginTop:10,padding:5}}>
                        {listContents.map((item,i) => (
                            <Radio
                            key={i}
                            value={i}
                            name={value}
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
                                <ImageListItem key={item} sx={{border: 3}}>
                                    <Card sx={{x:3, width: (windowSize.width-100-30*2)/3-6,minWidth: 200-6 }}>
                                        <CardMedia
                                            sx={{ height: 250-6 }}
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